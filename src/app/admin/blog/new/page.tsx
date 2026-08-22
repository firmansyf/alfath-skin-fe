'use client'

import { ChevronLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';


export default function AddBlog() {
    const router = useRouter()


    const handleSubmit = () => {

    } 

    return (
        <section>
            <button
                onClick={() => router.back()}
                className="flex items-center cursor-pointer gap-1 text-sm text-gray-500 hover:text-gray-900 mb-6 transition-colors"
            >
                <ChevronLeft className="w-4 h-4" />
                Kembali
            </button>

            <h1 className="text-xl font-semibold text-gray-900 mb-6">Tambah Blog Baru</h1>

            <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                </div>
            </form>

        </section>
    )
}