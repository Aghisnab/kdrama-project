import { Link, router } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import SearchInput from '@/Components/SearchInput';

export default function Index({ actors, filters }) {
    const [search, setSearch] = useState(filters.search || '');

    const handleSearch = (value) => {
        router.get('/admin/actors', { search: value }, { preserveState: true });
    };

    useEffect(() => {
        setSearch(filters.search || '');
    }, [filters.search]);

    return (
        <AdminLayout>
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                    <h1 className="text-2xl font-semibold">Kelola Aktor</h1>
                    <Link
                        href="/admin/actors/create"
                        className="px-4 py-2 bg-violet-600 hover:bg-violet-700 rounded-xl text-sm font-medium transition"
                    >
                        + Tambah Peran Aktor
                    </Link>
                </div>

                {/* Search */}
                <div className="mb-6">
                    <SearchInput
                        initialValue={search}
                        onSearch={handleSearch}
                        placeholder="Cari nama aktor..."
                    />
                </div>

                {/* Daftar Aktor */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {actors.data.map((actor) => (
                        <Link
                            key={actor.actor_name}
                            href={`/admin/actors/${encodeURIComponent(actor.actor_name)}`}
                            className="bg-[#111118] border border-white/[0.06] rounded-2xl p-4 hover:border-purple-500/30 transition"
                        >
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-violet-500/20 flex items-center justify-center overflow-hidden">
                                    {actor.photo_url ? (
                                        <img
                                            src={actor.photo_url}
                                            alt={actor.actor_name}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <span className="text-purple-300 font-bold">
                                            {actor.actor_name.charAt(0).toUpperCase()}
                                        </span>
                                    )}
                                </div>
                                <div>
                                    <p className="font-medium">{actor.actor_name}</p>
                                    <p className="text-xs text-gray-500">{actor.drama_count} drama</p>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>

                {/* Pagination */}
                <div className="mt-8 flex justify-center gap-2">
                    {actors.links.map((link, i) => (
                        <Link
                            key={i}
                            href={link.url || '#'}
                            dangerouslySetInnerHTML={{ __html: link.label }}
                            className={`px-3 py-1 rounded-lg text-sm transition ${
                                link.active
                                    ? 'bg-violet-600 text-white'
                                    : 'bg-[#111118] text-gray-400 hover:text-white'
                            } ${!link.url && 'opacity-50 cursor-default'}`}
                        />
                    ))}
                </div>
            </div>
        </AdminLayout>
    );
}
