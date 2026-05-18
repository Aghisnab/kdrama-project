import { Link, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';

export default function AdminDashboard({
    totalDramas,
    totalUsers,
    totalLikes,
    totalWatchlist,
    latestDramas = [],
    mostLiked = [],
    mostWatchlisted = [],
}) {
    const formattedDate = new Date().toLocaleDateString('id-ID', {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
    });

    return (
        <AdminLayout>
            {/* Animated gradient orbs */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-600/20 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-pink-600/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl"></div>
            </div>

            <div className="relative z-10">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                        <div>
                            <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent mb-1">
                                Admin Dashboard
                            </h1>
                            <p className="text-sm text-gray-400">Overview konten dan aktivitas You(D)rama</p>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                            <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                            <span className="text-gray-400">{formattedDate}</span>
                        </div>
                    </div>
                    <div className="mt-4 h-px bg-gradient-to-r from-purple-500/50 via-transparent to-pink-500/50"></div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    {[
                        { label: 'Total Drama',    value: totalDramas,    icon: '🎬', textColor: 'text-purple-300' },
                        { label: 'Total User',     value: totalUsers,     icon: '👥', textColor: 'text-yellow-300' },
                        { label: 'Total Likes',    value: totalLikes,     icon: '❤️', textColor: 'text-pink-300' },
                        { label: 'Total Watchlist',value: totalWatchlist, icon: '⭐', textColor: 'text-emerald-300' },
                    ].map((stat, idx) => (
                        <div
                            key={stat.label}
                            className="group relative bg-gradient-to-br from-white/[0.03] to-white/[0.01] backdrop-blur-sm border border-white/[0.08] rounded-2xl p-5 transition-all duration-300 hover:scale-105 hover:border-purple-500/30 hover:shadow-xl hover:shadow-purple-500/10 cursor-default"
                            style={{ animationDelay: `${idx * 100}ms` }}
                        >
                            <div className="flex items-center justify-between mb-3">
                                <span className="text-3xl">{stat.icon}</span>
                            </div>
                            <p className="text-sm text-gray-400 mb-1">{stat.label}</p>
                            <p className={`text-2xl sm:text-3xl font-bold tracking-tight ${stat.textColor}`}>
                                {stat.value}
                            </p>
                        </div>
                    ))}
                </div>

                {/* 3 columns */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Drama Terbaru */}
                    <div className="group">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-sm font-semibold text-white flex items-center gap-2">
                                <span className="w-1 h-4 bg-gradient-to-b from-purple-400 to-pink-400 rounded-full"></span>
                                Drama Terbaru
                            </h2>
                            <Link href="/admin/kdrama" className="text-xs text-purple-400 hover:text-purple-300 transition-colors flex items-center gap-1">
                                Lihat semua →
                            </Link>
                        </div>
                        <div className="flex flex-col gap-3">
                            {latestDramas.map((drama) => (
                                <div key={drama.kdrama_id}
                                    className="bg-gradient-to-r from-[#111118] to-[#0d0d14] border border-white/[0.06] rounded-xl p-3 transition-all duration-300 hover:border-purple-500/30 hover:-translate-y-0.5">
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 rounded-xl overflow-hidden flex-shrink-0 border border-white/[0.05]">
                                            {drama.poster_url
                                                ? <img src={drama.poster_url} alt={drama.kdrama_name} className="w-full h-full object-cover" />
                                                : <div className="w-full h-full flex items-center justify-center text-xl bg-purple-900/30">🎬</div>}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-white truncate">{drama.kdrama_name}</p>
                                            <p className="text-xs text-gray-500">{drama.year}</p>
                                        </div>
                                        <span className={`text-xs px-2 py-1 rounded-full flex-shrink-0 ${
                                            !drama.start_date || new Date(drama.start_date) > new Date()
                                                ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                                                : !drama.end_date
                                                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                                                    : 'bg-gray-500/20 text-gray-400 border border-gray-500/30'
                                        }`}>
                                            {!drama.start_date ? 'Akan Tayang'
                                                : new Date(drama.start_date) > new Date()
                                                    ? new Date(drama.start_date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })
                                                    : !drama.end_date ? 'On-Going' : 'Selesai'}
                                        </span>
                                    </div>
                                </div>
                            ))}
                            {latestDramas.length === 0 && (
                                <div className="text-center py-8 text-gray-500 text-sm">Belum ada drama terbaru.</div>
                            )}
                        </div>
                    </div>

                    {/* Paling Disukai */}
                    <div className="group">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-sm font-semibold text-white flex items-center gap-2">
                                <span className="w-1 h-4 bg-gradient-to-b from-pink-400 to-rose-400 rounded-full"></span>
                                Paling Disukai
                            </h2>
                            <Link href="/admin/likes" className="text-xs text-purple-400 hover:text-purple-300 transition-colors">
                                Lihat semua →
                            </Link>
                        </div>
                        <div className="flex flex-col gap-3">
                            {mostLiked.length === 0 ? (
                                <div className="text-center py-8 text-gray-500 text-sm bg-[#111118] rounded-xl border border-white/[0.06]">Belum ada data.</div>
                            ) : mostLiked.map((item, i) => (
                                <div key={item.kdrama_id}
                                    className="bg-gradient-to-r from-[#111118] to-[#0d0d14] border border-white/[0.06] rounded-xl p-3 transition-all duration-300 hover:border-pink-500/30 hover:-translate-y-0.5">
                                    <div className="flex items-center gap-3">
                                        <div className="relative">
                                            <span className="absolute -top-2 -left-2 w-5 h-5 bg-gradient-to-br from-pink-500 to-rose-500 rounded-full flex items-center justify-center text-[10px] font-bold text-white z-10">
                                                {i + 1}
                                            </span>
                                            <div className="w-12 h-12 rounded-xl overflow-hidden flex-shrink-0 border border-white/[0.05] ml-1 bg-pink-900/30">
                                                {item.kdrama?.poster_url
                                                    ? <img src={item.kdrama.poster_url} alt={item.kdrama.kdrama_name} className="w-full h-full object-cover" />
                                                    : <div className="w-full h-full flex items-center justify-center text-xl">🎬</div>}
                                            </div>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-white truncate">{item.kdrama?.kdrama_name}</p>
                                        </div>
                                        <div className="flex items-center gap-1 text-pink-400 bg-pink-500/10 px-2 py-1 rounded-full flex-shrink-0">
                                            <span className="text-sm">❤️</span>
                                            <span className="text-xs font-semibold">{item.like_count}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Paling di-Watchlist */}
                    <div className="group">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-sm font-semibold text-white flex items-center gap-2">
                                <span className="w-1 h-4 bg-gradient-to-b from-emerald-400 to-teal-400 rounded-full"></span>
                                Paling di-Watchlist
                            </h2>
                            <Link href="/admin/activities" className="text-xs text-purple-400 hover:text-purple-300 transition-colors">
                                Lihat semua →
                            </Link>
                        </div>
                        <div className="flex flex-col gap-3">
                            {mostWatchlisted.length === 0 ? (
                                <div className="text-center py-8 text-gray-500 text-sm bg-[#111118] rounded-xl border border-white/[0.06]">Belum ada data.</div>
                            ) : mostWatchlisted.map((item, i) => (
                                <div key={item.kdrama_id}
                                    className="bg-gradient-to-r from-[#111118] to-[#0d0d14] border border-white/[0.06] rounded-xl p-3 transition-all duration-300 hover:border-emerald-500/30 hover:-translate-y-0.5">
                                    <div className="flex items-center gap-3">
                                        <div className="relative">
                                            <span className="absolute -top-2 -left-2 w-5 h-5 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-full flex items-center justify-center text-[10px] font-bold text-white z-10">
                                                {i + 1}
                                            </span>
                                            <div className="w-12 h-12 rounded-xl overflow-hidden flex-shrink-0 border border-white/[0.05] ml-1 bg-emerald-900/30">
                                                {item.kdrama?.poster_url
                                                    ? <img src={item.kdrama.poster_url} alt={item.kdrama.kdrama_name} className="w-full h-full object-cover" />
                                                    : <div className="w-full h-full flex items-center justify-center text-xl">🎬</div>}
                                            </div>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-white truncate">{item.kdrama?.kdrama_name}</p>
                                        </div>
                                        <div className="flex items-center gap-1 text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded-full flex-shrink-0">
                                            <span className="text-sm">⭐</span>
                                            <span className="text-xs font-semibold">{item.watchlist_count}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
