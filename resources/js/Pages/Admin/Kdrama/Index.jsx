import { useState } from 'react';
import { Link, router, usePage } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import SearchInput from '@/Components/SearchInput';

export default function KdramaIndex({ dramas, filters: initialFilters }) {
    const [filters, setFilters] = useState({
        search: initialFilters.search ?? '',
        year: initialFilters.year ?? '',
        genre: initialFilters.genre ?? '',
    });
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [collapsed, setCollapsed] = useState(false);
    const { url } = usePage();

    const currentYear = new Date().getFullYear();
    const startYear = 1990;
    const years = Array.from(
        { length: currentYear - startYear + 1 },
        (_, i) => currentYear - i
    );

    const GENRE_OPTIONS = [
        'Romansa', 'Drama', 'Komedi', 'Laga', 'Misteri', 'Horor', 'Fantasi', 'Sejarah',
        'Thriller', 'Kehidupan', 'Remaja', 'Keluarga', 'Supernatural', 'Kriminal',
        'Medis', 'Hukum', 'Fiksi Ilmiah', 'Musik', 'Olahraga', 'BL', 'LGBTQ+', 'Coming-of-age',
        'Office', 'Psychological', 'Time Travel', 'Melodrama', 'Political', 'Balas Dendam',
        'Adaptasi', 'Friendship', 'Teknologi', 'Petualangan', 'Zombie', 'Reinkarnasi',
        'Spionase', 'Culinary', 'Detektif', 'School Life', 'Military', 'Chaebol', 'Webtoon'
    ];

    const handleSearchChange = (value) => {
        setFilters(prev => ({ ...prev, search: value }));
        applyFilters({ ...filters, search: value });
    };

    const handleYearChange = (e) => {
        const newYear = e.target.value;
        setFilters(prev => ({ ...prev, year: newYear }));
        applyFilters({ ...filters, year: newYear });
    };

    const handleGenreChange = (e) => {
        const newGenre = e.target.value;
        setFilters(prev => ({ ...prev, genre: newGenre }));
        applyFilters({ ...filters, genre: newGenre });
    };

    const applyFilters = (newFilters) => {
        router.get('/admin/kdrama', newFilters, { preserveState: true });
    };

    const resetFilters = () => {
        setFilters({ search: '', year: '', genre: '' });
        router.get('/admin/kdrama', {}, { preserveState: true });
    };

    const handleDelete = (id, name) => {
        if (confirm(`Hapus "${name}"?`)) {
            router.delete(`/admin/kdrama/${id}`);
        }
    };

    return (
        <AdminLayout>
                    {/* Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
                        <div>
                            <h1 className="text-xl sm:text-2xl font-medium text-white">Kelola Drama</h1>
                            <p className="text-xs sm:text-sm text-gray-500 mt-1">Total {dramas.total} drama</p>
                        </div>
                        <Link href="/admin/kdrama/create"
                            className="w-full sm:w-auto text-center px-4 py-2.5 bg-violet-600 hover:bg-violet-700 rounded-xl text-sm font-medium transition">
                            + Tambah Drama
                        </Link>
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
                            className="px-4 py-2.5 bg-[#0d0d14] border border-white/[0.08] rounded-xl text-sm"
                        >
                            <option value="">Semua Genre</option>
                            {GENRE_OPTIONS.map(genre => (
                                <option key={genre}>{genre}</option>
                            ))}
                        </select>
                        <button onClick={resetFilters} className="px-4 py-2.5 border border-white/10 rounded-xl text-sm">
                            Reset Filter
                        </button>
                    </div>

                    {/* Desktop Table */}
                    <div className="hidden md:block bg-[#111118] border border-white/[0.06] rounded-2xl overflow-hidden mt-6">
                        <div className="overflow-x-auto">
                            <table className="w-full min-w-[700px]">
                                <thead>
                                    <tr className="border-b border-white/[0.06] bg-white/[0.02]">
                                        <th className="text-left px-4 py-3 text-xs text-gray-500 font-medium">Drama</th>
                                        <th className="text-left px-4 py-3 text-xs text-gray-500 font-medium">Tahun</th>
                                        <th className="text-left px-4 py-3 text-xs text-gray-500 font-medium">Genre</th>
                                        <th className="text-left px-4 py-3 text-xs text-gray-500 font-medium">Popularitas</th>
                                        <th className="text-left px-4 py-3 text-xs text-gray-500 font-medium">Status</th>
                                        <th className="text-right px-4 py-3 text-xs text-gray-500 font-medium">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {dramas.data.map((drama) => {
                                        const genres = Array.isArray(drama.genre) ? drama.genre : [];
                                        const isOngoing = !drama.end_date;
                                        return (
                                            <tr key={drama.kdrama_id}
                                                className="border-b border-white/[0.04] hover:bg-white/[0.02] transition">
                                                <td className="px-4 py-3">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-14 rounded-lg overflow-hidden bg-[#0d0d14] flex-shrink-0">
                                                            {drama.poster_url
                                                                ? <img src={drama.poster_url} alt={drama.kdrama_name} className="w-full h-full object-cover" />
                                                                : <div className="w-full h-full flex items-center justify-center text-sm">🎬</div>}
                                                        </div>
                                                        <div className="min-w-0">
                                                            <p className="text-sm font-medium text-white truncate max-w-[160px]">{drama.kdrama_name}</p>
                                                            <p className="text-xs text-gray-600 mt-0.5">{drama.original_network || '—'}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-3 text-sm text-gray-400">{drama.year ?? '—'}</td>
                                                <td className="px-4 py-3">
                                                    <div className="flex flex-wrap gap-1">
                                                        {genres.length > 0 ? (
                                                            genres.map((g) => (
                                                                <span key={g} className="text-xs px-2 py-0.5 rounded-lg bg-violet-500/15 text-violet-300">
                                                                    {g}
                                                                </span>
                                                            ))
                                                        ) : null}
                                                    </div>
                                                </td>
                                                <td className="px-4 py-3 text-sm text-yellow-300">#{drama.popularity ?? '—'}</td>
                                                <td className="px-4 py-3">
                                                    <span className={`text-xs px-2 py-1 rounded-full ${isOngoing ? 'bg-emerald-500/15 text-emerald-400' : 'bg-white/[0.05] text-gray-500'}`}>
                                                        {isOngoing ? 'On-Going' : 'Tamat'}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3">
                                                    <div className="flex justify-end gap-2">
                                                        <Link href={`/admin/kdrama/${drama.kdrama_id}/edit`}
                                                            className="px-3 py-1.5 text-xs border border-white/10 rounded-lg text-gray-400 hover:text-white hover:border-white/20 transition">
                                                            Edit
                                                        </Link>
                                                        <button onClick={() => handleDelete(drama.kdrama_id, drama.kdrama_name)}
                                                            className="px-3 py-1.5 text-xs border border-red-500/20 rounded-lg text-red-400 hover:bg-red-500/10 transition">
                                                            Hapus
                                                        </button>
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
                        {dramas.data.map((drama) => {
                            const genres = Array.isArray(drama.genre) ? drama.genre : [];
                            const isOngoing = !drama.end_date;
                            return (
                                <div key={drama.kdrama_id}
                                    className="bg-[#111118] border border-white/[0.06] rounded-xl p-3 flex gap-3">
                                    <div className="w-14 h-20 rounded-lg overflow-hidden bg-[#0d0d14] flex-shrink-0">
                                        {drama.poster_url
                                            ? <img src={drama.poster_url} alt={drama.kdrama_name} className="w-full h-full object-cover" />
                                            : <div className="w-full h-full flex items-center justify-center text-xl">🎬</div>}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-white truncate">{drama.kdrama_name}</p>
                                        <p className="text-xs text-gray-600 mt-0.5">{drama.year ?? '—'} · {drama.original_network || '—'}</p>
                                        <div className="flex flex-wrap gap-1 mt-1.5">
                                            {genres.length > 0 ? (
                                                genres.map((g) => (
                                                    <span key={g} className="text-xs px-2 py-0.5 rounded-lg bg-violet-500/15 text-violet-300">
                                                        {g}
                                                    </span>
                                                ))
                                            ) : null}
                                        </div>
                                        <div className="flex items-center justify-between mt-2">
                                            <span className={`text-xs px-2 py-0.5 rounded-full ${isOngoing ? 'bg-emerald-500/15 text-emerald-400' : 'bg-white/[0.05] text-gray-500'}`}>
                                                {isOngoing ? 'On-Going' : 'Tamat'}
                                            </span>
                                            <div className="flex gap-2">
                                                <Link href={`/admin/kdrama/${drama.kdrama_id}/edit`}
                                                    className="px-2.5 py-1 text-xs border border-white/10 rounded-lg text-gray-400 hover:text-white transition">
                                                    Edit
                                                </Link>
                                                <button onClick={() => handleDelete(drama.kdrama_id, drama.kdrama_name)}
                                                    className="px-2.5 py-1 text-xs border border-red-500/20 rounded-lg text-red-400 hover:bg-red-500/10 transition">
                                                    Hapus
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Pagination */}
                    <div className="mt-5 flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
                        <p className="text-xs text-gray-600">
                            Menampilkan {dramas.from}–{dramas.to} dari {dramas.total} drama
                        </p>
                        <div className="flex flex-wrap gap-1.5">
                            {dramas.links.map((link, i) => (
                                <button key={i} disabled={!link.url}
                                    onClick={() => link.url && router.get(link.url)}
                                    className={`px-3 py-1.5 text-xs rounded-lg border transition
                                        ${link.active
                                            ? 'bg-violet-600 border-violet-600 text-white'
                                            : link.url
                                                ? 'border-white/10 text-gray-400 hover:border-white/20 hover:text-white'
                                                : 'border-white/[0.04] text-gray-700 cursor-not-allowed'}`}
                                    dangerouslySetInnerHTML={{ __html: link.label }} />
                            ))}
                        </div>
                    </div>
        </AdminLayout>
    );
}

// Sidebar component dengan collapse
function Sidebar({ active, sidebarOpen, setSidebarOpen, collapsed, setCollapsed }) {
    const logout = () => router.post('/logout');
    const menuItems = [
        { label: 'Dashboard', icon: '📊', href: '/admin/dashboard' },
        { label: 'Kelola Drama', icon: '🎬', href: '/admin/kdrama' },
        { label: 'Kelola Aktor', icon: '🎭', href: '/admin/actors' },
        { label: 'Aktivitas User', icon: '📋', href: '/admin/activities' },
        { label: 'Drama Favorit', icon: '❤️', href: '/admin/likes' },
    ];

    return (
        <aside className={`
            fixed top-0 left-0 z-50 h-screen
            bg-[#0d0d15] border-r border-white/[0.07]
            flex flex-col py-6 px-3
            transform transition-all duration-300
            ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
            lg:translate-x-0
            ${collapsed ? 'lg:w-20' : 'lg:w-56'}
        `}>
            {/* Logo & toggle */}
            <div className={`flex items-center mb-6 ${collapsed ? 'justify-center' : 'justify-between'}`}>
                <div className={`flex items-center gap-2 ${collapsed ? 'justify-center w-full' : ''}`}>
                    <img
                        src="/images/logo.png"
                        alt="You(D)rama"
                        onClick={() => setCollapsed(!collapsed)}
                        className={`object-contain cursor-pointer transition-all duration-300 ${
                            collapsed ? 'h-10 w-10' : 'h-8 w-auto'
                        }`}
                    />
                    {!collapsed && (
                        <span className="text-lg font-extrabold tracking-widest bg-gradient-to-r from-indigo-300 via-purple-300 to-pink-300 bg-clip-text text-transparent drop-shadow-lg">
                            You(D)rama
                        </span>
                    )}
                </div>
                {!collapsed && (
                    <button
                        onClick={() => setSidebarOpen(false)}
                        className="lg:hidden w-8 h-8 rounded-lg bg-white/[0.05] border border-white/[0.08] flex items-center justify-center text-gray-400"
                    >
                        ✕
                    </button>
                )}
            </div>

            {/* Admin badge */}
            {!collapsed && (
                <div className="px-3 mb-5">
                    <span className="text-xs bg-violet-500/20 text-purple-300 px-2 py-1 rounded-full border border-violet-500/30">
                        Admin Panel
                    </span>
                </div>
            )}

            {/* Navigation */}
            <nav className="flex flex-col gap-1 flex-1 overflow-y-auto">
                {menuItems.map((item) => (
                    <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setSidebarOpen(false)}
                        className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition cursor-pointer
                            ${collapsed ? 'justify-center' : ''}
                            ${active === item.href || (item.href !== '/admin/dashboard' && active.startsWith(item.href))
                                ? 'bg-violet-500/15 text-purple-300'
                                : 'text-gray-600 hover:text-gray-300 hover:bg-white/[0.04]'
                            }`}
                    >
                        <span>{item.icon}</span>
                        {!collapsed && item.label}
                    </Link>
                ))}
            </nav>

            {/* Logout */}
            <div className="border-t border-white/[0.07] pt-4 px-2">
                <button
                    onClick={logout}
                    className={`w-full text-left px-3 py-2 text-xs text-gray-600 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition cursor-pointer
                        ${collapsed ? 'flex justify-center' : ''}
                    `}
                >
                    {collapsed ? '🚪' : 'Logout'}
                </button>
            </div>
        </aside>
    );
}
