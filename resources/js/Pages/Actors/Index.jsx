import { Link, router } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import UserLayout from '@/Layouts/UserLayout';
import SearchInput from '@/Components/SearchInput';

export default function Index({ actors, filters }) {
    const [search, setSearch] = useState(filters.search || '');

    const handleSearch = (value) => {
        router.get('/actors', { search: value }, { preserveState: true });
    };

    useEffect(() => {
        setSearch(filters.search || '');
    }, [filters.search]);

    // Hitung total aktor untuk statistik (jika tidak ada, bisa dari actors.total)
    const totalActors = actors.total || actors.data.length;

    return (
        <UserLayout>
            {/* Hero Header - Aesthetic seperti halaman drama */}
            <div className="relative mb-10 overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-950/40 via-purple-950/30 to-black/40 backdrop-blur-sm border border-white/10 p-6 sm:p-8">
                <div className="absolute top-0 right-0 w-64 h-64 bg-purple-600/20 rounded-full blur-3xl -z-0" />
                <div className="absolute bottom-0 left-0 w-72 h-72 bg-indigo-600/20 rounded-full blur-3xl -z-0" />
                <div className="relative z-10">
                    <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-white via-purple-200 to-indigo-300 bg-clip-text text-transparent">
                        Para Aktor & Aktris
                    </h1>
                    <p className="text-gray-400 mt-2 text-sm sm:text-base max-w-xl">
                        Jelajahi bintang-bintang drama Korea favoritmu, dari aktor senior hingga pendatang baru.
                    </p>
                </div>
            </div>

            {/* Search Bar - lebih terintegrasi */}
            <div className="mb-8">
                <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center">
                    <div className="flex-1">
                        <SearchInput
                            initialValue={search}
                            onSearch={handleSearch}
                            placeholder="Cari nama aktor atau aktris..."
                            className="w-full"
                        />
                    </div>
                    <div className="text-xs text-gray-500 bg-black/30 rounded-full px-3 py-1.5 text-center sm:text-left">
                        🔍 {actors.total} hasil
                    </div>
                </div>
            </div>

            {/* Card Grid - tidak diubah, tetap seperti semula */}
            {actors.data.length === 0 ? (
                <div className="text-center py-12 text-gray-500">Aktor tidak ditemukan</div>
            ) : (
                <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {actors.data.map((actor) => {
                            const initials = actor.actor_name
                                .split(' ')
                                .map(w => w[0])
                                .join('')
                                .slice(0, 2)
                                .toUpperCase();

                            return (
                                <Link
                                    key={actor.actor_name}
                                    href={`/actors/${encodeURIComponent(actor.actor_name)}`}
                                    className="bg-[#111118] border border-white/[0.06] rounded-2xl p-3 hover:border-purple-500/30 transition group flex items-center gap-4"
                                >
                                    <div className="w-14 h-14 rounded-full overflow-hidden bg-violet-500/20 flex items-center justify-center flex-shrink-0">
                                        {actor.photo_url ? (
                                            <img src={actor.photo_url} alt={actor.actor_name} className="w-full h-full object-cover" />
                                        ) : (
                                            <span className="text-lg font-medium text-purple-300">{initials}</span>
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-medium text-sm group-hover:text-purple-300 transition truncate">
                                            {actor.actor_name}
                                        </p>
                                        <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-gray-400 mt-1">
                                            {actor.drama_count !== undefined && (
                                                <span>🎬 {actor.drama_count} drama</span>
                                            )}
                                            {actor.popularity && (
                                                <span>⭐ Peringkat #{actor.popularity}</span>
                                            )}
                                        </div>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>

                    {actors.links.length > 3 && (
                        <div className="mt-8 flex justify-center gap-2 flex-wrap">
                            {actors.links.map((link, idx) => (
                                <Link
                                    key={idx}
                                    href={link.url || '#'}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                    className={`px-3 py-1 rounded-lg text-sm transition ${
                                        link.active ? 'bg-purple-600 text-white' : 'bg-[#111118] text-gray-400 hover:text-white'
                                    } ${!link.url && 'opacity-50 cursor-default'}`}
                                    disabled={!link.url}
                                />
                            ))}
                        </div>
                    )}
                </>
            )}
        </UserLayout>
    );
}
