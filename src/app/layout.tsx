import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from '@/components/providers/AuthProvider';
import JsonLd from '@/components/common/JsonLd';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://firstmatebeauties.com/" ;
const ogImage = `${siteUrl}/logo.png`;

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'FirstMate Beauty - Skincare Original untuk Kulit Sehat & Glowing',
    template: '%s | FirstMate Beauty',
  },
  description: 'Belanja skincare original di FirstMate Beauty. Rangkaian perawatan kulit berkualitas dengan harga bersahabat untuk kulit sehat, cerah, dan glowing setiap hari.',
  keywords: ['skincare', 'perawatan kulit', 'kosmetik', 'kecantikan', 'FirstMate Beauty', 'jual skincare', 'beli skincare online'],
  authors: [{ name: 'FirstMate Beauty' }],
  creator: 'FirstMate Beauty',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'id_ID',
    url: siteUrl,
    siteName: 'FirstMate Beauty',
    title: 'FirstMate Beauty - Skincare Original untuk Kulit Sehat & Glowing',
    description: 'Skincare original dan berkualitas dengan harga bersahabat. Wujudkan kulit sehat dan glowing bersama FirstMate Beauty.',
    images: [
      {
        url: ogImage,
        width: 480,
        height: 510,
        alt: 'FirstMate Beauty',
      },
    ],
  },
  twitter: {
    card: 'summary',
    title: 'FirstMate Beauty - Skincare Original untuk Kulit Sehat & Glowing',
    description: 'Skincare original dan berkualitas dengan harga bersahabat. Wujudkan kulit sehat dan glowing bersama FirstMate Beauty.',
    images: [ogImage],
  },
  icons: {
    shortcut: '/logoPav.png',
    apple: '/logoPav.png',
  },
  // NOTE: no global `alternates.canonical` here — a root canonical would make
  // every page without its own canonical claim to be the homepage. Each
  // indexable page sets its own canonical instead.
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body className={inter.className}>
        <JsonLd
          data={{
            '@context': 'https://schema.org',
            '@type': 'Organization',
            name: 'FirstMate Beauty',
            url: siteUrl,
            logo: `${siteUrl}/logo.png`,
            description: 'Skincare original dan berkualitas dengan harga bersahabat. Wujudkan kulit sehat dan glowing bersama FirstMate Beauty.',
            sameAs: [],
          }}
        />
        <JsonLd
          data={{
            '@context': 'https://schema.org',
            '@type': 'WebSite',
            name: 'FirstMate Beauty',
            url: siteUrl,
            inLanguage: 'id-ID',
            potentialAction: {
              '@type': 'SearchAction',
              target: {
                '@type': 'EntryPoint',
                urlTemplate: `${siteUrl}/products?search={search_term_string}`,
              },
              'query-input': 'required name=search_term_string',
            },
          }}
        />
        <AuthProvider>
          {children}
        </AuthProvider>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: '#fff',
              color: '#363636',
            },
            success: {
              iconTheme: {
                primary: '#10b981',
                secondary: '#fff',
              },
            },
            error: {
              iconTheme: {
                primary: '#ef4444',
                secondary: '#fff',
              },
            },
          }}
        />
      </body>
    </html>
  );
}