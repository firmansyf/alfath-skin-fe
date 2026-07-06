import ProductsClient from '@/components/customer/ProductsClient';
import JsonLd from '@/components/common/JsonLd';

const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://firstmatebeauties.com';

async function getProducts(params: Record<string, string | undefined>) {
  try {
    const query = new URLSearchParams({ limit: '12' });
    if (params.page) query.set('page', params.page);
    if (params.category) query.set('category', params.category);
    if (params.search) query.set('search', params.search);
    if (params.sortBy) query.set('sortBy', params.sortBy);
    if (params.order) query.set('order', params.order);

    const res = await fetch(`${apiUrl}/products?${query}`, {
      cache: 'no-store',
    });
    if (!res.ok) return { data: [], pagination: { currentPage: 1, totalPages: 1, totalItems: 0 } };
    const json = await res.json();
    return {
      data: json.data || [],
      pagination: json.pagination || { currentPage: 1, totalPages: 1, totalItems: 0 },
    };
  } catch {
    return { data: [], pagination: { currentPage: 1, totalPages: 1, totalItems: 0 } };
  }
}

async function getCategories() {
  try {
    const res = await fetch(`${apiUrl}/products/categories`, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) return [];
    const json = await res.json();
    return json.data || [];
  } catch {
    return [];
  }
}

interface Props {
  searchParams: Promise<Record<string, string | undefined>>;
}

export default async function ProductsPage({ searchParams }: Props) {
  const params = await searchParams;

  const [productsData, categories] = await Promise.all([
    getProducts(params),
    getCategories(),
  ]);

  const itemListJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Produk Skincare — FirstMate Beauty',
    url: `${siteUrl}/products`,
    numberOfItems: productsData.data.length,
    itemListElement: productsData.data.map(
      (product: { slug: string; name: string }, index: number) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: product.name,
        url: `${siteUrl}/products/${product.slug}`,
      })
    ),
  };

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Beranda', item: siteUrl },
      { '@type': 'ListItem', position: 2, name: 'Produk', item: `${siteUrl}/products` },
    ],
  };

  return (
    <>
      <JsonLd data={itemListJsonLd} />
      <JsonLd data={breadcrumbJsonLd} />
      <ProductsClient
        initialProducts={productsData.data}
        initialPagination={productsData.pagination}
        categories={categories}
        currentFilters={params}
      />
    </>
  );
}
