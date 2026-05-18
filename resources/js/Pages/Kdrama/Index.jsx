import { useState } from 'react';
import { Link, router, usePage } from '@inertiajs/react';
import UserLayout from '@/Layouts/UserLayout';
import SearchInput from '@/Components/SearchInput';

export default function KdramaIndex({ dramas, filters, genres, counts }) {
    const [search, setSearch] = useState(filters.search ?? '');
    const [activeGenre, setActiveGenre] = useState(filters.genre ?? []);
    const [activeMode, setActiveMode] = useState(filters.mode ?? 'all');

    const handleSearchChange = (value) => {
        setSearch(value);
        router.get('/dramas', { search: value, genre: activeGenre, mode: activeMode }, {
            preserveState: true, preserveScroll: true,
        });
    };

    const handleGenre = (genre) => {
        const newGenres = activeGenre.includes(genre)
            ? activeGenre.filter(g => g !== genre)
            : [...activeGenre, genre];
        setActiveGenre(newGenres);
        router.get('/dramas', { search, genre: newGenres, mode: activeMode }, {
            preserveState: true, preserveScroll: true,
        });
    };

    const handleModeChange = (mode) => {
        setActiveMode(mode);
        router.get('/dramas', { search, genre: activeGenre, mode }, {
            preserveState: true, preserveScroll: true,
        });
    };

    // Fungsi status drama (hanya untuk tampilan badge di card, tidak untuk filtering)
    const getDramaStatus = (drama) => {
        const today = new Date();
        const startDate = drama.start_date ? new Date(drama.start_date) : null;
        const endDate = drama.end_date ? new Date(drama.end_date) : null;

        if (!startDate || startDate > today) {
            return { label: 'Akan Tayang', className: 'bg-blue-500/80 text-white' };
        } else if (!endDate || endDate >= today) {
            return { label: 'On Going', className: 'bg-emerald-500/80 text-white' };
        } else {
            return { label: 'Tamat', className: 'bg-gray-800/80 text-gray-300' };
        }
    };

    const stats = [
        { key: 'all', label: 'Total Drama', icon: '🎬', mode: 'all' },
        { key: 'latest', label: 'Update Terbaru', icon: '🔥', mode: 'latest' },
        { key: 'ongoing', label: 'On-Going', icon: '📺', mode: 'ongoing' },
    ];

    return (
        <UserLayout>
            {/* Hero Header */}
            <div className="relative mb-10 overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-950/40 via-purple-950/30 to-black/40 backdrop-blur-sm border border-white/10 p-6 sm:p-8">
                <div className="absolute top-0 right-0 w-64 h-64 bg-purple-600/20 rounded-full blur-3xl -z-0" />
                <div className="absolute bottom-0 left-0 w-72 h-72 bg-indigo-600/20 rounded-full blur-3xl -z-0" />
                <div className="relative z-10">
                    <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-white via-purple-200 to-indigo-300 bg-clip-text text-transparent">
                        Koleksi Drama Korea
                    </h1>
                    <p className="text-gray-400 mt-2 text-sm sm:text-base max-w-xl">
                        Temukan drama favoritmu, dari yang sedang hits hingga klasik abadi.
                    </p>

                    {/* Tombol mode */}
                    <div className="flex flex-wrap items-center gap-3 mt-6">
                        {stats.map((stat) => (
                            <button
                                key={stat.key}
                                onClick={() => handleModeChange(stat.mode)}
                                className={`group relative flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200
                                    ${activeMode === stat.mode
                                        ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-500/20 scale-105'
                                        : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white border border-white/10'
                                    }`}
                            >
                                <span>{stat.icon}</span>
                                <span>{stat.label}</span>
                                <span className={`text-xs px-1.5 py-0.5 rounded-full ${activeMode === stat.mode ? 'bg-white/20' : 'bg-white/10'}`}>
                                    {counts?.[stat.key] ?? 0}
                                </span>
                                {activeMode === stat.mode && (
                                    <span className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 blur-md opacity-50 -z-10" />
                                )}
                            </button>
                        ))}
                    </div>
                    <p className="text-xs text-gray-500 mt-3">
                        Menampilkan: <span className="text-purple-300">{stats.find(s => s.mode === activeMode)?.label}</span>
                    </p>
                </div>
            </div>

            {/* Search & Filter */}
            <div className="mb-8 space-y-5">
                <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center">
                    <div className="flex-1">
                        <SearchInput
                            initialValue={search}
                            onSearch={handleSearchChange}
                            placeholder="Cari judul drama, aktor, atau sutradara..."
                            className="w-full"
                        />
                    </div>
                    <div className="text-xs text-gray-500 bg-black/30 rounded-full px-3 py-1.5 text-center sm:text-left">
                        ⚡ {dramas.total} hasil
                    </div>
                </div>

                <div className="flex flex-wrap gap-2">
                    {genres.map((genre) => (
                        <button
                            key={genre}
                            onClick={() => handleGenre(genre)}
                            className={`group relative px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200
                                ${activeGenre.includes(genre)
                                    ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-500/20'
                                    : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white border border-white/10'
                                }`}
                        >
                            {genre}
                            {activeGenre.includes(genre) && (
                                <span className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 blur-md opacity-50 -z-10" />
                            )}
                        </button>
                    ))}
                    {activeGenre.length > 0 && (
                        <button
                            onClick={() => {
                                setActiveGenre([]);
                                router.get('/dramas', { search, genre: [], mode: activeMode }, { preserveState: true, preserveScroll: true });
                            }}
                            className="px-3 py-1.5 rounded-full text-xs text-gray-500 hover:text-red-400 transition"
                        >
                            ✕ Reset filter
                        </button>
                    )}
                </div>
            </div>

            {/* Grid Drama Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5 mb-10">
                {dramas.data.map((drama) => {
                    const dramaGenres = Array.isArray(drama.genre) ? drama.genre : [];
                    const status = getDramaStatus(drama);
                    return (
                        <Link
                            key={drama.kdrama_id}
                            href={`/dramas/${drama.kdrama_id}`}
                            className="group relative bg-gradient-to-b from-white/5 to-white/0 rounded-2xl overflow-hidden border border-white/10 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-purple-500/20 hover:border-purple-500/30 backdrop-blur-sm"
                        >
                            <div className="relative aspect-[2/3] overflow-hidden bg-black/40">
                                {drama.poster_url ? (
                                    <img
                                        src={drama.poster_url}
                                        alt={drama.kdrama_name}
                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                        loading="lazy"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-5xl bg-gradient-to-br from-gray-800 to-gray-900">
                                        🎬
                                    </div>
                                )}
                                <div className={`absolute top-2 right-2 px-2 py-0.5 rounded-full text-[10px] font-semibold backdrop-blur-md ${status.className}`}>
                                    {status.label}
                                </div>
                                {drama.popularity && (
                                    <div className="absolute bottom-2 left-2 bg-black/60 backdrop-blur-sm rounded-full px-2 py-0.5 text-[10px] text-yellow-300 font-medium">
                                        #{drama.popularity}
                                    </div>
                                )}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            </div>
                            <div className="p-3 space-y-1.5">
                                <h3 className="font-semibold text-sm text-white line-clamp-1 group-hover:text-purple-300 transition">
                                    {drama.kdrama_name}
                                </h3>
                                <div className="flex flex-wrap gap-1">
                                    {dramaGenres.slice(0, 2).map((g) => (
                                        <span key={g} className="text-[10px] px-1.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300">
                                            {g}
                                        </span>
                                    ))}
                                    {dramaGenres.length > 2 && (
                                        <span className="text-[10px] text-gray-500">+{dramaGenres.length - 2}</span>
                                    )}
                                </div>
                                {drama.year && (
                                    <div className="flex items-center gap-2 text-[11px] text-gray-500">
                                        <span>📅 {drama.year}</span>
                                        {drama.country && <span>🌏 {drama.country}</span>}
                                    </div>
                                )}
                            </div>
                            <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 pointer-events-none" />
                        </Link>
                    );
                })}
            </div>

            {/* Empty State */}
            {dramas.data.length === 0 && (
                <div className="text-center py-16 bg-white/5 rounded-2xl border border-white/10">
                    <div className="text-6xl mb-3">🎭</div>
                    <h3 className="text-xl font-medium text-white">Tidak ada drama ditemukan</h3>
                    <p className="text-gray-500 mt-1">Coba ubah filter atau kata kunci pencarian</p>
                </div>
            )}

            {/* Pagination */}
            {dramas.links && dramas.links.length > 3 && (
                <div className="flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between mt-8 pt-4 border-t border-white/10">
                    <p className="text-xs text-gray-500">
                        Menampilkan {dramas.from}–{dramas.to} dari {dramas.total} drama
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                        {dramas.links.map((link, i) => (
                            <button
                                key={i}
                                disabled={!link.url}
                                onClick={() => link.url && router.get(link.url, {}, { preserveScroll: true })}
                                className={`px-3 py-1.5 text-xs rounded-lg transition-all duration-200
                                    ${link.active
                                        ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md'
                                        : link.url
                                            ? 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white border border-white/10'
                                            : 'bg-transparent text-gray-700 cursor-not-allowed'
                                    }`}
                                dangerouslySetInnerHTML={{ __html: link.label }}
                            />
                        ))}
                    </div>
                </div>
            )}
        </UserLayout>
    );
}
