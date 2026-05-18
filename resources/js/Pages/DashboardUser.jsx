import { useState } from 'react';
import { Link, router } from '@inertiajs/react';
import axios from 'axios';

const menuItems = [
    { label: 'Drama', icon: '🎬', href: '/dramas' },
    { label: 'Aktor', icon: '🎭', href: '/actors' },
    { label: 'Watchlist', icon: '⭐', href: '/watchlist' },
];

const statusLabel = {
    plan_to_watch: { text: 'Plan to Watch', cls: 'bg-white/[0.07] text-gray-500' },
    watching:      { text: 'Watching',      cls: 'bg-violet-500/20 text-purple-300' },
    completed:     { text: 'Selesai',       cls: 'bg-emerald-500/15 text-emerald-400' },
};

const activityIcon = {
    watchlist_add:      '📺',
    watchlist_complete: '✅',
    favorite_add:       '⭐',
    like:               '♡',
};

const moodStyles = {
    'Malam Hujan':     { pill: 'border-pink-500/40    bg-pink-500/10    text-pink-300',    active: 'ring-pink-500/50    bg-pink-500/20    border-pink-500/60    text-pink-200' },
    'Pengen Ketawa':   { pill: 'border-blue-500/40    bg-blue-500/10    text-blue-300',    active: 'ring-blue-500/50    bg-blue-500/20    border-blue-500/60    text-blue-200' },
    'Deg-degan Terus': { pill: 'border-amber-500/40   bg-amber-500/10   text-amber-300',   active: 'ring-amber-500/50   bg-amber-500/20   border-amber-500/60   text-amber-200' },
    'Mau Baper':       { pill: 'border-rose-500/40    bg-rose-500/10    text-rose-300',    active: 'ring-rose-500/50    bg-rose-500/20    border-rose-500/60    text-rose-200' },
    'Pengen Takut':    { pill: 'border-purple-500/40  bg-purple-500/10  text-purple-300',  active: 'ring-purple-500/50  bg-purple-500/20  border-purple-500/60  text-purple-200' },
    'Jiwa Petualang':  { pill: 'border-orange-500/40  bg-orange-500/10  text-orange-300',  active: 'ring-orange-500/50  bg-orange-500/20  border-orange-500/60  text-orange-200' },
    'Dunia Dongeng':   { pill: 'border-indigo-500/40  bg-indigo-500/10  text-indigo-300',  active: 'ring-indigo-500/50  bg-indigo-500/20  border-indigo-500/60  text-indigo-200' },
    'Vibes Kerajaan':  { pill: 'border-yellow-500/40  bg-yellow-500/10  text-yellow-300',  active: 'ring-yellow-500/50  bg-yellow-500/20  border-yellow-500/60  text-yellow-200' },
    'Hari Santai':     { pill: 'border-teal-500/40    bg-teal-500/10    text-teal-300',    active: 'ring-teal-500/50    bg-teal-500/20    border-teal-500/60    text-teal-200' },
    'Pengen Nangis':   { pill: 'border-sky-500/40     bg-sky-500/10     text-sky-300',     active: 'ring-sky-500/50     bg-sky-500/20     border-sky-500/60     text-sky-200' },
    'Balas Dendam':    { pill: 'border-red-500/40     bg-red-500/10     text-red-300',     active: 'ring-red-500/50     bg-red-500/20     border-red-500/60     text-red-200' },
    'Drama Kantor':    { pill: 'border-emerald-500/40 bg-emerald-500/10 text-emerald-300', active: 'ring-emerald-500/50 bg-emerald-500/20 border-emerald-500/60 text-emerald-200' },
};

// ─── Mood Recommendation Section (enhanced visually, logic unchanged) ─────────
function MoodRecommendSection({ moods }) {
    const [selectedMood, setSelectedMood] = useState(null);
    const [dramas, setDramas]             = useState([]);
    const [loading, setLoading]           = useState(false);
    const [error, setError]               = useState(null);

    const handleMoodSelect = async (mood) => {
        if (selectedMood === mood) {
            setSelectedMood(null);
            setDramas([]);
            setError(null);
            return;
        }

        setSelectedMood(mood);
        setLoading(true);
        setError(null);
        setDramas([]);

        try {
            const { data } = await axios.post('/dashboard/recommend', { mood });
            setDramas(data.dramas ?? []);
        } catch (e) {
            setError('Gagal memuat rekomendasi. Coba lagi.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-sm font-semibold text-white flex items-center gap-2">
                    <span className="w-1 h-4 bg-gradient-to-b from-purple-400 to-pink-400 rounded-full"></span>
                    Rekomendasi untuk Kamu
                </h2>
                {selectedMood && !loading && dramas.length > 0 && (
                    <span className="text-xs text-gray-500">{dramas.length} drama ditemukan</span>
                )}
            </div>

            <div className="flex gap-2 flex-wrap mb-5">
                {moods.map((mood) => {
                    const style   = moodStyles[mood] ?? { pill: 'border-white/20 bg-white/5 text-white/60', active: 'ring-white/30 bg-white/10 border-white/40 text-white' };
                    const isActive = selectedMood === mood;
                    return (
                        <button
                            key={mood}
                            onClick={() => handleMoodSelect(mood)}
                            className={`
                                px-3 py-1.5 rounded-full border text-xs font-medium
                                transition-all duration-200 cursor-pointer
                                ${isActive
                                    ? `${style.active} ring-2 ring-offset-1 ring-offset-[#0a0a0f] scale-105 shadow-lg`
                                    : `${style.pill} hover:scale-105 hover:brightness-110`
                                }
                            `}
                        >
                            {mood}
                        </button>
                    );
                })}
            </div>

            {!selectedMood && (
                <div className="bg-gradient-to-br from-white/[0.03] to-white/[0.01] backdrop-blur-sm border border-white/[0.06] rounded-xl p-6 text-center">
                    <p className="text-xs text-gray-500">Pilih mood kamu di atas untuk melihat rekomendasi drama yang pas.</p>
                </div>
            )}

            {loading && (
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
                    {Array.from({ length: 12 }).map((_, i) => (
                        <div key={i} className="animate-pulse">
                            <div className="h-24 rounded-xl bg-white/[0.04]" />
                            <div className="mt-2 h-2.5 rounded bg-white/[0.04] w-3/4" />
                            <div className="mt-1.5 h-2 rounded bg-white/[0.03] w-1/2" />
                        </div>
                    ))}
                </div>
            )}

            {error && !loading && (
                <div className="bg-red-500/5 border border-red-500/20 rounded-xl p-4 text-center">
                    <p className="text-xs text-red-400">{error}</p>
                    <button
                        onClick={() => handleMoodSelect(selectedMood)}
                        className="mt-2 text-xs text-red-400/70 hover:text-red-400 underline"
                    >
                        Coba lagi
                    </button>
                </div>
            )}

            {!loading && !error && dramas.length > 0 && (
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
                    {dramas.map((drama) => {
                        const genres = Array.isArray(drama.genre)
                            ? drama.genre
                            : JSON.parse(drama.genre ?? '[]');
                        return (
                            <Link
                                key={drama.kdrama_id}
                                href={`/dramas/${drama.kdrama_id}`}
                                className="group relative bg-gradient-to-br from-white/[0.03] to-white/[0.01] backdrop-blur-sm border border-white/[0.06] rounded-xl overflow-hidden hover:border-purple-500/30 hover:shadow-xl hover:shadow-purple-500/5 transition-all duration-300 hover:-translate-y-1 block"
                            >
                                <div className="h-24 bg-gradient-to-br from-violet-900/30 to-pink-900/20 overflow-hidden relative">
                                    {drama.poster_url ? (
                                        <img
                                            src={drama.poster_url}
                                            alt={drama.kdrama_name}
                                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-3xl">🎬</div>
                                    )}
                                    {genres[0] && (
                                        <span className="absolute top-2 left-2 text-[10px] px-1.5 py-0.5 rounded-full bg-black/60 text-white/70 backdrop-blur-sm">
                                            {genres[0]}
                                        </span>
                                    )}
                                </div>
                                <div className="p-2">
                                    <p className="text-xs font-medium text-white truncate mb-0.5 group-hover:text-purple-300 transition-colors">
                                        {drama.kdrama_name}
                                    </p>
                                    <p className="text-[10px] text-gray-500">
                                        {drama.year} · {drama.total_episodes} eps
                                    </p>
                                </div>
                            </Link>
                        );
                    })}
                </div>
            )}

            {!loading && !error && selectedMood && dramas.length === 0 && (
                <div className="bg-gradient-to-br from-white/[0.03] to-white/[0.01] backdrop-blur-sm border border-white/[0.06] rounded-xl p-6 text-center">
                    <p className="text-xs text-gray-500">
                        Belum ada drama yang cocok untuk mood <span className="text-white/50">{selectedMood}</span>.
                    </p>
                </div>
            )}
        </div>
    );
}

// ─── Main Dashboard (Enhanced Aesthetics, No Functional Changes) ────────────
export default function Dashboard({
    user,
    watchlist      = [],
    latestDramas   = [],
    activities     = [],
    favorites      = [],
    popularActors  = [],
    collectionCount = 0,
    moods          = [],
}) {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [collapsed, setCollapsed] = useState(false);

    const completedCount = watchlist.filter(w => w.status === 'completed').length;
    const logout = () => router.post('/logout');

    const formattedDate = new Date().toLocaleDateString('id-ID', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#0a0a0f] via-[#0d0b17] to-[#07070a] text-white flex relative overflow-hidden">
            {/* Animated gradient orbs */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-600/20 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-pink-600/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl"></div>
            </div>

            {/* Overlay mobile */}
            {sidebarOpen && (
                <div
                    onClick={() => setSidebarOpen(false)}
                    className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 lg:hidden"
                />
            )}

            {/* Sidebar (unchanged structure, only visual polish) */}
            <aside className={`
                fixed top-0 left-0 z-50 h-screen
                bg-[#0d0d15] border-r border-white/[0.07]
                flex flex-col py-6 px-3
                transform transition-all duration-300
                ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
                lg:translate-x-0
                ${collapsed ? 'lg:w-20' : 'lg:w-56'}
            `}>
                <div className={`flex items-center mb-6 ${collapsed ? 'justify-center' : 'justify-between'}`}>
                    <div className={`flex items-center gap-2 ${collapsed ? 'justify-center w-full' : ''}`}>
                        <img
                            src="/images/logo.png"
                            alt="YouDrama"
                            onClick={() => setCollapsed(!collapsed)}
                            className={`object-contain cursor-pointer transition-all duration-300 ${
                                collapsed ? 'h-12 w-12' : 'h-12 w-auto'
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

                <nav className="flex flex-col gap-1 flex-1 overflow-y-auto">
                    {menuItems.map((item) => (
                        <Link key={item.href} href={item.href}
                            onClick={() => setSidebarOpen(false)}
                            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all duration-200
                                ${collapsed ? 'justify-center' : ''}
                                ${item.href === '/dashboard'
                                    ? 'bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-300 shadow-lg shadow-purple-500/10'
                                    : 'text-gray-500 hover:text-gray-200 hover:bg-white/[0.06]'}`}>
                            <span className="text-lg">{item.icon}</span>
                            {!collapsed && item.label}
                        </Link>
                    ))}
                </nav>

                {!collapsed && (
                    <div className="mt-auto border-t border-white/[0.07] pt-4 px-2">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-xs font-medium text-white shadow-lg">
                                {user?.name?.[0]?.toUpperCase()}
                            </div>
                            <div className="min-w-0">
                                <p className="text-xs text-gray-300 truncate">{user?.name}</p>
                                <p className="text-xs text-gray-600 truncate">{user?.email}</p>
                            </div>
                        </div>
                        <button onClick={logout}
                            className="w-full text-left px-3 py-2 text-xs text-gray-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all duration-200">
                            Logout
                        </button>
                    </div>
                )}

                {collapsed && (
                    <div className="mt-auto pt-4 flex justify-center">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-xs font-medium text-white shadow-lg">
                            {user?.name?.[0]?.toUpperCase()}
                        </div>
                    </div>
                )}
            </aside>

            {/* Main content */}
            <main className={`flex-1 min-w-0 overflow-y-auto transition-all duration-300 relative z-10 ${collapsed ? 'lg:ml-20' : 'lg:ml-56'}`}>
                {/* Mobile topbar - enhanced */}
                <div className="lg:hidden flex items-center justify-between px-4 py-3 border-b border-white/[0.06] bg-[#0d0d15]/80 backdrop-blur-md sticky top-0 z-30">
                    <img
                        src="/images/Logo.png"
                        alt="Drakorlist Logo"
                        className="h-6 w-auto"
                    />
                    <button
                        onClick={() => setSidebarOpen(true)}
                        className="w-9 h-9 rounded-xl bg-white/[0.05] border border-white/[0.08] flex items-center justify-center hover:bg-white/[0.1] transition-all"
                    >
                        ☰
                    </button>
                </div>

                <div className="p-4 sm:p-6 lg:p-8">
                    {/* Header with greeting and date */}
                    <div className="mb-8">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                            <div>
                                <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent mb-1">
                                    Halo, {user?.name} 👋
                                </h1>
                                <p className="text-sm text-gray-400">Lagi mood nonton apa hari ini?</p>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                                <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                                <span className="text-gray-400">{formattedDate}</span>
                            </div>
                        </div>
                        <div className="mt-4 h-px bg-gradient-to-r from-purple-500/50 via-transparent to-pink-500/50"></div>
                    </div>

                    {/* Stats Cards - Glassmorphic with icons */}
                    <div className="grid grid-cols-3 gap-4 mb-8">
                        {[
                            { label: 'Watchlist', value: collectionCount, icon: '📋', color: 'from-purple-500 to-purple-600', textColor: 'text-purple-300' },
                            { label: 'Favorit',   value: favorites.length, icon: '❤️', color: 'from-pink-500 to-rose-600', textColor: 'text-pink-300' },
                            { label: 'Selesai',   value: completedCount, icon: '✅', color: 'from-emerald-500 to-teal-600', textColor: 'text-emerald-300' },
                        ].map((stat, idx) => (
                            <div
                                key={stat.label}
                                className="group relative bg-gradient-to-br from-white/[0.03] to-white/[0.01] backdrop-blur-sm border border-white/[0.08] rounded-2xl p-5 transition-all duration-300 hover:scale-105 hover:border-purple-500/30 hover:shadow-xl hover:shadow-purple-500/10 cursor-default"
                                style={{ animationDelay: `${idx * 100}ms` }}
                            >
                                <div className="relative z-10">
                                    <div className="flex items-center justify-between mb-3">
                                        <span className="text-3xl">{stat.icon}</span>
                    
                                    </div>
                                    <p className="text-sm text-gray-400 mb-1">{stat.label}</p>
                                    <p className={`text-2xl sm:text-3xl font-bold tracking-tight ${stat.textColor}`}>
                                        {stat.value}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Mood Recommendation Section (already enhanced inside) */}
                    <MoodRecommendSection moods={moods} />

                    {/* Watchlist Section - Enhanced */}
                    <div className="mb-8">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-sm font-semibold text-white flex items-center gap-2">
                                <span className="w-1 h-4 bg-gradient-to-b from-yellow-400 to-amber-400 rounded-full"></span>
                                Watchlist Kamu
                            </h2>
                            <Link href="/watchlist" className="text-xs text-purple-400 hover:text-purple-300 transition-colors flex items-center gap-1 group">
                                Lihat semua <span className="text-lg transition-transform group-hover:translate-x-0.5">→</span>
                            </Link>
                        </div>
                        {watchlist.length === 0 ? (
                            <div className="bg-gradient-to-br from-white/[0.03] to-white/[0.01] backdrop-blur-sm border border-white/[0.06] rounded-xl p-6 text-center">
                                <p className="text-sm text-gray-500 mb-3">Belum ada drama di watchlist kamu.</p>
                                <Link
                                    href="/dramas"
                                    className="inline-block px-4 py-2 bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 text-purple-300 text-xs rounded-lg hover:bg-purple-500/30 transition-all duration-200 hover:scale-105"
                                >
                                    + Tambah Drama
                                </Link>
                            </div>
                        ) : (
                            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
                                {watchlist.slice(0, 6).map((item) => (
                                    <Link
                                        key={item.id}
                                        href={`/dramas/${item.kdrama?.kdrama_id}`}
                                        className="group relative bg-gradient-to-br from-white/[0.03] to-white/[0.01] backdrop-blur-sm border border-white/[0.06] rounded-xl overflow-hidden hover:border-purple-500/30 hover:shadow-xl hover:shadow-purple-500/5 transition-all duration-300 hover:-translate-y-1 block"
                                    >
                                        <div className="h-24 bg-gradient-to-br from-violet-900/30 to-pink-900/20 overflow-hidden">
                                            {item.kdrama?.poster_url ? (
                                                <img
                                                    src={item.kdrama.poster_url}
                                                    alt={item.kdrama.kdrama_name}
                                                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-3xl">🎬</div>
                                            )}
                                        </div>
                                        <div className="p-2">
                                            <p className="text-xs font-medium text-white truncate mb-1 group-hover:text-purple-300 transition-colors">
                                                {item.kdrama?.kdrama_name}
                                            </p>
                                            <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${statusLabel[item.status]?.cls}`}>
                                                {statusLabel[item.status]?.text}
                                            </span>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Drama Terbaru - Enhanced */}
                    <div className="mb-8">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-sm font-semibold text-white flex items-center gap-2">
                                <span className="w-1 h-4 bg-gradient-to-b from-blue-400 to-cyan-400 rounded-full"></span>
                                Drama Terbaru
                            </h2>
                            <Link href="/dramas" className="text-xs text-purple-400 hover:text-purple-300 transition-colors flex items-center gap-1 group">
                                Lihat semua <span className="text-lg transition-transform group-hover:translate-x-0.5">→</span>
                            </Link>
                        </div>
                        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
                            {latestDramas.slice(0, 6).map((drama) => (
                                <Link
                                    key={drama.kdrama_id}
                                    href={`/dramas/${drama.kdrama_id}`}
                                    className="group relative bg-gradient-to-br from-white/[0.03] to-white/[0.01] backdrop-blur-sm border border-white/[0.06] rounded-xl overflow-hidden hover:border-purple-500/30 hover:shadow-xl hover:shadow-purple-500/5 transition-all duration-300 hover:-translate-y-1 block"
                                >
                                    <div className="h-24 bg-gradient-to-br from-violet-900/30 to-pink-900/20 overflow-hidden">
                                        {drama.poster_url ? (
                                            <img
                                                src={drama.poster_url}
                                                alt={drama.kdrama_name}
                                                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-3xl">🎬</div>
                                        )}
                                    </div>
                                    <div className="p-2">
                                        <p className="text-xs font-medium text-white truncate mb-1 group-hover:text-purple-300 transition-colors">
                                            {drama.kdrama_name}
                                        </p>
                                        <div className="flex justify-between items-center">
                                            <span className="text-[10px] text-gray-500">{drama.year}</span>
                                            <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                                                !drama.start_date || new Date(drama.start_date) > new Date()
                                                    ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                                                    : !drama.end_date
                                                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                                                        : 'bg-gray-500/20 text-gray-400 border border-gray-500/30'
                                            }`}>
                                                {!drama.start_date || new Date(drama.start_date) > new Date()
                                                    ? 'Akan Tayang'
                                                    : !drama.end_date
                                                        ? 'On-Going'
                                                        : 'Selesai'}
                                            </span>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Aktor Populer - Enhanced */}
                    <div className="mb-8">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-sm font-semibold text-white flex items-center gap-2">
                                <span className="w-1 h-4 bg-gradient-to-b from-orange-400 to-red-400 rounded-full"></span>
                                Aktor Populer
                            </h2>
                            <Link href="/actors" className="text-xs text-purple-400 hover:text-purple-300 transition-colors flex items-center gap-1 group">
                                Lihat semua <span className="text-lg transition-transform group-hover:translate-x-0.5">→</span>
                            </Link>
                        </div>
                        <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-3">
                            {popularActors.map((actor) => (
                                <Link
                                    key={actor.actor_name}
                                    href={`/actors/${encodeURIComponent(actor.actor_name)}`}
                                    className="group relative bg-gradient-to-br from-white/[0.03] to-white/[0.01] backdrop-blur-sm border border-white/[0.06] rounded-xl overflow-hidden hover:border-purple-500/30 hover:shadow-xl hover:shadow-purple-500/5 transition-all duration-300 hover:-translate-y-1 block"
                                >
                                    <div className="h-28 bg-gradient-to-br from-violet-900/30 to-pink-900/20 overflow-hidden">
                                        {actor.photo_url ? (
                                            <img
                                                src={actor.photo_url}
                                                alt={actor.actor_name}
                                                className="w-full h-full object-cover object-top transition-transform duration-300 group-hover:scale-105"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-xl font-medium bg-gradient-to-br from-purple-500/20 to-pink-500/20 text-purple-300">
                                                {actor.actor_name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()}
                                            </div>
                                        )}
                                    </div>
                                    <div className="p-2 text-center">
                                        <p className="text-xs font-medium text-white truncate group-hover:text-purple-300 transition-colors">
                                            {actor.actor_name}
                                        </p>
                                        <p className="text-[10px] text-gray-500 mt-0.5">#{actor.popularity}</p>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Aktivitas Terbaru - Enhanced */}
                    <div>
                        <h2 className="text-sm font-semibold text-white flex items-center gap-2 mb-4">
                            <span className="w-1 h-4 bg-gradient-to-b from-gray-400 to-gray-500 rounded-full"></span>
                            Aktivitas Terbaru
                        </h2>
                        {activities.length === 0 ? (
                            <div className="bg-gradient-to-br from-white/[0.03] to-white/[0.01] backdrop-blur-sm border border-white/[0.06] rounded-xl p-6 text-center">
                                <p className="text-sm text-gray-500">Belum ada aktivitas.</p>
                            </div>
                        ) : (
                            <div className="flex flex-col gap-2">
                                {activities.map((act) => (
                                    <div
                                        key={act.id}
                                        className="group flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-[#111118] to-[#0d0d14] border border-white/[0.06] rounded-xl transition-all duration-200 hover:border-purple-500/30 hover:shadow-md"
                                    >
                                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center text-sm flex-shrink-0 group-hover:scale-110 transition-transform">
                                            {activityIcon[act.type] ?? '📌'}
                                        </div>
                                        <p className="text-xs text-gray-300 flex-1 min-w-0">{act.description}</p>
                                        <p className="text-xs text-gray-600 flex-shrink-0">
                                            {new Date(act.created_at).toLocaleDateString('id-ID', {
                                                day: 'numeric',
                                                month: 'short',
                                            })}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}
