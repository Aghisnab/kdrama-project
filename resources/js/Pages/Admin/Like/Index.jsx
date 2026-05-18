import { useState } from 'react';
import { Link, router, usePage } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import SearchInput from '@/Components/SearchInput';

export default function LikedDramas({ dramas, filters: initialFilters }) {
    const [filters, setFilters] = useState({
        search: initialFilters.search ?? '',
        year:   initialFilters.year   ?? '',
        genre:  initialFilters.genre  ?? '',
    });
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [collapsed,   setCollapsed]   = useState(false);
    const { url } = usePage();

    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: currentYear - 1990 + 1 }, (_, i) => currentYear - i);

    const GENRE_OPTIONS = [
        'Romansa', 'Drama', 'Komedi', 'Laga', 'Misteri', 'Horor', 'Fantasi', 'Sejarah',
        'Thriller', 'Kehidupan', 'Remaja', 'Keluarga', 'Supernatural', 'Kriminal',
        'Medis', 'Hukum', 'Fiksi Ilmiah', 'Musik', 'Olahraga', 'BL', 'LGBTQ+', 'Coming-of-age',
        'Office', 'Psychological', 'Time Travel', 'Melodrama', 'Political', 'Balas Dendam',
        'Adaptasi', 'Friendship', 'Teknologi', 'Petualangan', 'Zombie', 'Reinkarnasi',
        'Spionase', 'Culinary', 'Detektif', 'School Life', 'Military', 'Chaebol', 'Webtoon',
    ];

    const applyFilters = (newFilters) => {
        router.get('/admin/likes', newFilters, { preserveState: true });
    };

    const handleSearchChange = (value) => {
        const next = { ...filters, search: value };
        setFilters(next);
        applyFilters(next);
    };

    const handleYearChange = (e) => {
        const next = { ...filters, year: e.target.value };
        setFilters(next);
        applyFilters(next);
    };

    const handleGenreChange = (e) => {
        const next = { ...filters, genre: e.target.value };
        setFilters(next);
        applyFilters(next);
    };

    const resetFilters = () => {
        setFilters({ search: '', year: '', genre: '' });
        router.get('/admin/likes', {}, { preserveState: true });
    };

    return (
        <AdminLayout>
                    {/* Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
                        <div>
                            <h1 className="text-xl sm:text-2xl font-medium text-white">Drama Disukai</h1>
                            <p className="text-xs sm:text-sm text-gray-500 mt-1">
                                Total {dramas.total} drama dengan likes
                            </p>
                        </div>
                        {/* Optional: ranking legend */}
                        <div className="flex items-center gap-3 text-xs text-gray-600">
                            <span className="flex items-center gap-1"><span className="text-rose-400">❤️</span> Disukai</span>
                            <span className="flex items-center gap-1"><span className="text-sky-400">👁️</span> Ditonton</span>
                        </div>
                    </div>

                    {/* Filter bar */}
                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 mb-6">
                        <SearchInput
                            initialValue={filters.search}
                            onSearch={handleSearchChange}
                            placeholder="Cari judul drama..."
                        />
                        <select
                            value={filters.year}
                            onChange={handleYearChange}
                            className="px-4 py-2.5 bg-[#0d0d14] border border-white/[0.08] rounded-xl text-sm text-white"
                        >
                            <option value="">Semua Tahun</option>
                            {years.map(year => (
                                <option key={year}>{year}</option>
                            ))}
                        </select>
                        <select
                            value={filters.genre}
                            onChange={handleGenreChange}
                            className="px-4 py-2.5 bg-[#0d0d14] border border-white/[0.08] rounded-xl text-sm text-white"
                        >
                            <option value="">Semua Genre</option>
                            {GENRE_OPTIONS.map(genre => (
                                <option key={genre}>{genre}</option>
                            ))}
                        </select>
                        <button
                            onClick={resetFilters}
                            className="px-4 py-2.5 border border-white/10 rounded-xl text-sm text-gray-400 hover:text-white hover:border-white/20 transition"
                        >
                            Reset Filter
                        </button>
                    </div>

                    {/* Desktop Table */}
                    <div className="hidden md:block bg-[#111118] border border-white/[0.06] rounded-2xl overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full min-w-[680px]">
                                <thead>
                                    <tr className="border-b border-white/[0.06] bg-white/[0.02]">
                                        <th className="text-left px-4 py-3 text-xs text-gray-500 font-medium w-8">#</th>
                                        <th className="text-left px-4 py-3 text-xs text-gray-500 font-medium">Drama</th>
                                        <th className="text-left px-4 py-3 text-xs text-gray-500 font-medium">Tahun</th>
                                        <th className="text-left px-4 py-3 text-xs text-gray-500 font-medium">Genre</th>
                                        <th className="text-left px-4 py-3 text-xs text-gray-500 font-medium">Disukai</th>
                                        <th className="text-left px-4 py-3 text-xs text-gray-500 font-medium">Ditonton</th>
                                        <th className="text-right px-4 py-3 text-xs text-gray-500 font-medium">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {dramas.data.length === 0 ? (
                                        <tr>
                                            <td colSpan={7} className="text-center py-16 text-gray-600 text-sm">
                                                Tidak ada drama ditemukan.
                                            </td>
                                        </tr>
                                    ) : dramas.data.map((drama, index) => {
                                        const genres = Array.isArray(drama.genre) ? drama.genre : [];
                                        const rank = (dramas.current_page - 1) * dramas.per_page + index + 1;
                                        return (
                                            <tr
                                                key={drama.kdrama_id}
                                                className="border-b border-white/[0.04] hover:bg-white/[0.02] transition"
                                            >
                                                {/* Rank */}
                                                <td className="px-4 py-3">
                                                    <span className={`text-xs font-bold tabular-nums ${
                                                        rank === 1 ? 'text-yellow-400' :
                                                        rank === 2 ? 'text-gray-300' :
                                                        rank === 3 ? 'text-amber-600' :
                                                        'text-gray-600'
                                                    }`}>
                                                        {rank <= 3 ? ['🥇','🥈','🥉'][rank - 1] : `#${rank}`}
                                                    </span>
                                                </td>

                                                {/* Drama */}
                                                <td className="px-4 py-3">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-14 rounded-lg overflow-hidden bg-[#0d0d14] flex-shrink-0">
                                                            {drama.poster_url
                                                                ? <img src={drama.poster_url} alt={drama.kdrama_name} className="w-full h-full object-cover" />
                                                                : <div className="w-full h-full flex items-center justify-center text-sm">🎬</div>}
                                                        </div>
                                                        <div className="min-w-0">
                                                            <p className="text-sm font-medium text-white truncate max-w-[180px]">{drama.kdrama_name}</p>
                                                            <p className="text-xs text-gray-600 mt-0.5">{drama.original_network || '—'}</p>
                                                        </div>
                                                    </div>
                                                </td>

                                                {/* Tahun */}
                                                <td className="px-4 py-3 text-sm text-gray-400">{drama.year ?? '—'}</td>

                                                {/* Genre */}
                                                <td className="px-4 py-3">
                                                    <div className="flex flex-wrap gap-1 max-w-[180px]">
                                                        {genres.slice(0, 2).map(g => (
                                                            <span key={g} className="text-xs px-2 py-0.5 rounded-lg bg-violet-500/15 text-violet-300">
                                                                {g}
                                                            </span>
                                                        ))}
                                                        {genres.length > 2 && (
                                                            <span className="text-xs px-2 py-0.5 rounded-lg bg-white/[0.05] text-gray-500">
                                                                +{genres.length - 2}
                                                            </span>
                                                        )}
                                                    </div>
                                                </td>

                                                {/* Disukai */}
                                                <td className="px-4 py-3">
                                                    <div className="flex items-center gap-1.5">
                                                        <span className="text-rose-400 text-sm">❤️</span>
                                                        <span className="text-sm font-semibold text-rose-300 tabular-nums">
                                                            {(drama.likes_count ?? 0).toLocaleString('id')}
                                                        </span>
                                                    </div>
                                                </td>

                                                {/* Ditonton */}
                                                <td className="px-4 py-3">
                                                    <div className="flex items-center gap-1.5">
                                                        <span className="text-sky-400 text-sm">👁️</span>
                                                        <span className="text-sm font-semibold text-sky-300 tabular-nums">
                                                            {(drama.watch_count ?? 0).toLocaleString('id')}
                                                        </span>
                                                    </div>
                                                </td>

                                                {/* Aksi */}
                                                <td className="px-4 py-3">
                                                    <div className="flex justify-end">
                                                        <Link
                                                            href={`/admin/kdrama/${drama.kdrama_id}/edit`}
                                                            className="px-3 py-1.5 text-xs border border-white/10 rounded-lg text-gray-400 hover:text-white hover:border-white/20 transition"
                                                        >
                                                            Detail
                                                        </Link>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Mobile Card List */}
                    <div className="md:hidden flex flex-col gap-3">
                        {dramas.data.length === 0 ? (
                            <div className="text-center py-16 text-gray-600 text-sm">
                                Tidak ada drama ditemukan.
                            </div>
                        ) : dramas.data.map((drama, index) => {
                            const genres = Array.isArray(drama.genre) ? drama.genre : [];
                            const rank = (dramas.current_page - 1) * dramas.per_page + index + 1;
                            return (
                                <div
                                    key={drama.kdrama_id}
                                    className="bg-[#111118] border border-white/[0.06] rounded-xl p-3 flex gap-3"
                                >
                                    {/* Poster */}
                                    <div className="w-14 h-20 rounded-lg overflow-hidden bg-[#0d0d14] flex-shrink-0">
                                        {drama.poster_url
                                            ? <img src={drama.poster_url} alt={drama.kdrama_name} className="w-full h-full object-cover" />
                                            : <div className="w-full h-full flex items-center justify-center text-xl">🎬</div>}
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        {/* Title & rank */}
                                        <div className="flex items-start justify-between gap-2">
                                            <p className="text-sm font-medium text-white truncate">{drama.kdrama_name}</p>
                                            <span className={`text-xs font-bold flex-shrink-0 ${
                                                rank === 1 ? 'text-yellow-400' :
                                                rank === 2 ? 'text-gray-300' :
                                                rank === 3 ? 'text-amber-600' :
                                                'text-gray-600'
                                            }`}>
                                                {rank <= 3 ? ['🥇','🥈','🥉'][rank - 1] : `#${rank}`}
                                            </span>
                                        </div>

                                        <p className="text-xs text-gray-600 mt-0.5">{drama.year ?? '—'} · {drama.original_network || '—'}</p>

                                        {/* Genre */}
                                        <div className="flex flex-wrap gap-1 mt-1.5">
                                            {genres.slice(0, 2).map(g => (
                                                <span key={g} className="text-xs px-2 py-0.5 rounded-lg bg-violet-500/15 text-violet-300">
                                                    {g}
                                                </span>
                                            ))}
                                            {genres.length > 2 && (
                                                <span className="text-xs px-2 py-0.5 rounded-lg bg-white/[0.05] text-gray-500">
                                                    +{genres.length - 2}
                                                </span>
                                            )}
                                        </div>

                                        {/* Stats & action */}
                                        <div className="flex items-center justify-between mt-2">
                                            <div className="flex items-center gap-3">
                                                <span className="text-xs text-rose-300 flex items-center gap-1">
                                                    ❤️ {(drama.likes_count ?? 0).toLocaleString('id')}
                                                </span>
                                                <span className="text-xs text-sky-300 flex items-center gap-1">
                                                    👁️ {(drama.watch_count ?? 0).toLocaleString('id')}
                                                </span>
                                            </div>
                                            <Link
                                                href={`/admin/kdrama/${drama.kdrama_id}/edit`}
                                                className="px-2.5 py-1 text-xs border border-white/10 rounded-lg text-gray-400 hover:text-white transition"
                                            >
                                                Detail
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Pagination */}
                    <div className="mt-5 flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
                        <p className="text-xs text-gray-600">
                            Menampilkan {dramas.from ?? 0}–{dramas.to ?? 0} dari {dramas.total} drama
                        </p>
                        <div className="flex flex-wrap gap-1.5">
                            {dramas.links.map((link, i) => (
                                <button
                                    key={i}
                                    disabled={!link.url}
                                    onClick={() => link.url && router.get(link.url)}
                                    className={`px-3 py-1.5 text-xs rounded-lg border transition
                                        ${link.active
                                            ? 'bg-violet-600 border-violet-600 text-white'
                                            : link.url
                                                ? 'border-white/10 text-gray-400 hover:border-white/20 hover:text-white'
                                                : 'border-white/[0.04] text-gray-700 cursor-not-allowed'}`}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                />
                            ))}
                        </div>
                    </div>
        </AdminLayout>
    );
}
