import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Halaman Tidak Ditemukan',
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <span className="text-6xl mb-6 block">🧴</span>
        <h1 className="text-2xl font-semibold text-gray-900 mb-2">
          Halaman Tidak Ditemukan
        </h1>
        <p className="text-gray-500 mb-8">
          Maaf, halaman yang Anda cari tidak ada atau sudah dipindahkan.
        </p>
        <div className="flex items-center justify-center gap-3">
          <Link
            href="/"
            className="px-6 py-3 bg-pink-600 text-white text-sm font-semibold rounded-full hover:bg-pink-700 transition-colors"
          >
            Kembali ke Beranda
          </Link>
          <Link
            href="/products"
            className="px-6 py-3 border border-gray-200 text-gray-700 text-sm font-semibold rounded-full hover:bg-gray-50 transition-colors"
          >
            Lihat Produk
          </Link>
        </div>
      </div>
    </div>
  );
}
