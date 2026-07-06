import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import ProductDetailClient from '@/components/customer/ProductDetailClient';
import JsonLd from '@/components/common/JsonLd';

interface Props {
  params: Promise<{ slug: string }>;
}

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://firstmatebeauties.com';

async function getProduct(slug: string) {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
    const res = await fetch(`${apiUrl}/products/${slug}`, { next: { revalidate: 60 } });
    if (!res.ok) return null;
    const json = await res.json();
    return json.data;
  } catch {
    return null;
  }
}

// Product descriptions are TipTap HTML — strip tags before using in meta tags
function stripHtml(html: string): string {
  return html
    .replace(/<[^>]*>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function truncate(text: string, max: number): string {
  if (text.length <= max) return text;
  return text.slice(0, max - 1).replace(/\s+\S*$/, '') + '…';
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProduct(slug);

  if (!product) {
    return {
      title: 'Produk Tidak Ditemukan',
      robots: { index: false, follow: false },
    };
  }

  const title = product.name;
  const description = product.description
    ? truncate(stripHtml(product.description), 155)
    : `Beli ${product.name} original di FirstMate Beauty. Kualitas terjamin dengan harga terbaik.`;

  const ogImages = [product.image_url, ...(Array.isArray(product.images) ? product.images : [])]
    .filter((v, i, arr) => Boolean(v) && arr.indexOf(v) === i)
    .slice(0, 4)
    .map((url: string) => ({ url, alt: product.name }));

  return {
    title,
    description,
    keywords: [
      product.name,
      product.brand,
      product.category_name,
      'skincare',
      'perawatan kulit',
      'FirstMate Beauty',
    ].filter(Boolean),
    openGraph: {
      title: `${product.name} | FirstMate Beauty`,
      description,
      type: 'website',
      url: `${siteUrl}/products/${slug}`,
      siteName: 'FirstMate Beauty',
      locale: 'id_ID',
      images: ogImages,
    },
    twitter: {
      card: 'summary_large_image',
      title: `${product.name} | FirstMate Beauty`,
      description,
      images: ogImages.map((img) => img.url),
    },
    alternates: {
      canonical: `/products/${slug}`,
    },
  };
}

function buildProductJsonLd(product: any, slug: string) {
  const variants: any[] = Array.isArray(product.variants) ? product.variants : [];

  const images: string[] = [
    product.image_url,
    ...(Array.isArray(product.images) ? product.images : []),
    ...variants.map((v) => v.image_url),
  ].filter((v, i, arr) => Boolean(v) && arr.indexOf(v) === i);

  const effectivePrice = (p: { price: any; discount_price?: any }) => {
    const base = Number(p.price);
    const disc = p.discount_price !== null && p.discount_price !== undefined ? Number(p.discount_price) : null;
    return disc !== null && disc < base ? disc : base;
  };

  const totalStock = variants.length > 0
    ? variants.reduce((sum, v) => sum + Number(v.stock || 0), 0)
    : Number(product.stock || 0);

  const availability = product.is_available && totalStock > 0
    ? 'https://schema.org/InStock'
    : 'https://schema.org/OutOfStock';

  const url = `${siteUrl}/products/${slug}`;

  let offers: object;
  if (variants.length > 1) {
    const prices = variants.map(effectivePrice);
    offers = {
      '@type': 'AggregateOffer',
      priceCurrency: 'IDR',
      lowPrice: Math.min(...prices),
      highPrice: Math.max(...prices),
      offerCount: variants.length,
      availability,
      url,
    };
  } else {
    offers = {
      '@type': 'Offer',
      price: effectivePrice(variants[0] || product),
      priceCurrency: 'IDR',
      availability,
      url,
      itemCondition: 'https://schema.org/NewCondition',
    };
  }

  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description ? stripHtml(product.description) : '',
    image: images,
    sku: String(product.id),
    url,
    ...(product.category_name ? { category: product.category_name } : {}),
    brand: {
      '@type': 'Brand',
      name: product.brand || 'FirstMate Beauty',
    },
    offers,
  };
}

function buildBreadcrumbJsonLd(product: any, slug: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Beranda', item: siteUrl },
      { '@type': 'ListItem', position: 2, name: 'Produk', item: `${siteUrl}/products` },
      { '@type': 'ListItem', position: 3, name: product.name, item: `${siteUrl}/products/${slug}` },
    ],
  };
}

export default async function ProductDetailPage({ params }: Props) {
  const { slug } = await params;
  const product = await getProduct(slug);

  if (!product) {
    notFound();
  }

  return (
    <>
      <JsonLd data={buildProductJsonLd(product, slug)} />
      <JsonLd data={buildBreadcrumbJsonLd(product, slug)} />
      <ProductDetailClient slug={slug} initialProduct={product} />
    </>
  );
}
