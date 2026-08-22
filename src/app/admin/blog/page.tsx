'use client';

import { Plus } from "lucide-react"
import { useRouter } from 'next/navigation';

export default function Blog() {
    const router = useRouter()

    return (
        <section>
           <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
             <div>
                <h1 className="text-xl font-semibold text-gray-900">Kelola Blog</h1>
                {/* <p className="text-sm text-gray-500 mt-1">{pagination.total} kategori tersedia</p> */}
                </div>
                <button
                  onClick={() => router.push('/admin/blog/new')}
                  className="flex items-center gap-2 px-4 py-2 bg-pink-600 text-white text-sm font-medium rounded-lg hover:bg-pink-700 transition-colors"
                 >
                  <Plus className="w-4 h-4" />
                    Buat Blog
                </button>
            </div>

            
        </section>
    )
}