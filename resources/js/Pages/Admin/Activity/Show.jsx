import { Link, router } from '@inertiajs/react';
import { useState } from 'react';

const StarRating = ({ rating }) => {
    if (!rating) return <span className="text-gray-700 text-xs">Belum dirating</span>;
    return (
        <span className="flex items-center gap-0.5">
            {[1, 2, 3, 4, 5].map((s) => (
                <span key={s} className={`text-sm ${s <= rating ? 'text-amber-400' : 'text-gray-700'}`}>★</span>
            ))}
            <span className="text-xs text-gray-500 ml-1">{rating}/5</span>
        </span>
    );
};

const StatusBadge = ({ status }) => {
    const map = {
        watching:  'bg-sky-500/15 text-sky-400 border-sky-500/25',
        completed: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/25',
    };
    const label = { watching: 'Watching', completed: 'Selesai' };
    return (
        <span className={`text-[10px] px-2 py-0.5 rounded-full border font-medium ${map[status] ?? 'bg-gray-500/15 text-gray-400 border-gray-500/25'}`}>
            {label[status] ?? status}
        </span>
    );
};

const DramaCard = ({ drama, showRating = false }) => {
    const genres = Array.isArray(drama.genre) ? drama.genre : [];
    return (
        <div className="bg-[#0a0a12] border border-white/[0.05] rounded-xl overflow-hidden flex gap-3 p-3 hover:border-purple-500/20 transition-colors">
            <div className="w-12 h-16 flex-shrink-0 rounded-lg overflow-hidden bg-[#07070d]">
                {drama.poster_url ? (
                    <img src={drama.poster_url} alt={drama.kdrama_name} className="w-full h-full object-cover" onError={(e) => { e.target.style.display = 'none'; }} />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-lg">🎬</div>
                )}
            </div>
            <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-white truncate">{drama.kdrama_name}</p>
                <p className="text-xs text-gray-600 mb-1.5">{drama.year ?? '—'}</p>
                <div className="flex gap-1 flex-wrap mb-1.5">
                    {genres.slice(0, 2).map((g) => (
                        <span key={g} className="text-[10px] px-1.5 py-0.5 rounded bg-violet-500/15 text-purple-400">{g}</span>
                    ))}
                </div>
                {showRating ? (
                    <div className="flex items-center gap-2 flex-wrap">
                        <StatusBadge status={drama.status} />
                        <StarRating rating={drama.rating} />
                    </div>
                ) : (
                    <p className="text-[10px] text-gray-700">{drama.liked_at}</p>
                )}
            </div>
        </div>
    );
};

export default function ActivityShow({ user, likes, watchlist }) {
    const [tab, setTab] = useState('watchlist');

    const watching  = watchlist.filter((w) => w.status === 'watching');
    const completed = watchlist.filter((w) => w.status === 'completed');

    return (
        <div className="min-h-screen bg-[#0a0a0f] text-white">
            {/* Main Content - tanpa sidebar */}
            <main className="max-w-5xl mx-auto p-4 sm:p-6 lg:p-8">
                {/* Back button */}
                <Link
                    href="/admin/activities"
                    className="inline-flex items-center gap-1.5 text-xs text-gray-600 hover:text-gray-400 transition-colors mb-6"
                >
                    ← Kembali ke daftar
                </Link>

                {/* User header */}
                <div className="bg-[#0e0e18] border border-white/[0.06] rounded-2xl p-5 mb-6 flex flex-wrap items-center gap-4">
                    <div className="w-14 h-14 rounded-full bg-violet-500/20 border border-violet-500/30 flex items-center justify-center text-xl font-bold text-violet-300 flex-shrink-0">
                        {user.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                        <h2 className="text-base font-bold text-white">{user.name}</h2>
                        <p className="text-sm text-gray-500">{user.email}</p>
                        <p className="text-xs text-gray-700 mt-0.5">Bergabung {user.joined_at}</p>
                    </div>
                    <div className="flex gap-3 flex-wrap">
                        {[
                            { label: 'Disukai', value: user.total_likes, color: 'text-pink-400', icon: '♥' },
                            { label: 'Ditonton', value: user.total_watched, color: 'text-violet-400', icon: '▶' },
                        ].map(({ label, value, color, icon }) => (
                            <div key={label} className="bg-[#07070d] border border-white/[0.05] rounded-xl px-4 py-3 text-center min-w-[80px]">
                                <p className={`text-xl font-bold ${color}`}>{icon} {value}</p>
                                <p className="text-[10px] text-gray-600 uppercase tracking-widest mt-0.5">{label}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex gap-1 mb-5 bg-[#0e0e18] border border-white/[0.06] rounded-xl p-1 w-fit">
                    {[
                        { key: 'watchlist', label: `Ditonton (${watchlist.length})` },
                        { key: 'likes',     label: `Disukai (${likes.length})` },
                    ].map(({ key, label }) => (
                        <button
                            key={key}
                            onClick={() => setTab(key)}
                            className={`px-4 py-2 rounded-lg text-xs font-medium transition-all duration-200 ${
                                tab === key
                                    ? 'bg-violet-600 text-white shadow-lg shadow-violet-900/30'
                                    : 'text-gray-500 hover:text-gray-300'
                            }`}
                        >
                            {label}
                        </button>
                    ))}
                </div>

                {/* Tab: Watchlist */}
                {tab === 'watchlist' && (
                    <div className="space-y-6">
                        {/* Watching */}
                        <div>
                            <div className="flex items-center gap-2 mb-3">
                                <span className="w-2 h-2 rounded-full bg-sky-400 animate-pulse" />
                                <h3 className="text-sm font-semibold text-white">Sedang Ditonton</h3>
                                <span className="text-xs text-gray-600">({watching.length})</span>
                            </div>
                            {watching.length === 0 ? (
                                <p className="text-sm text-gray-700 py-4">Tidak ada drama yang sedang ditonton.</p>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                    {watching.map((d) => <DramaCard key={d.kdrama_id} drama={d} showRating />)}
                                </div>
                            )}
                        </div>

                        {/* Completed */}
                        <div>
                            <div className="flex items-center gap-2 mb-3">
                                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                                <h3 className="text-sm font-semibold text-white">Selesai Ditonton</h3>
                                <span className="text-xs text-gray-600">({completed.length})</span>
                            </div>
                            {completed.length === 0 ? (
                                <p className="text-sm text-gray-700 py-4">Belum ada drama yang selesai.</p>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                    {completed.map((d) => <DramaCard key={d.kdrama_id} drama={d} showRating />)}
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Tab: Likes */}
                {tab === 'likes' && (
                    <div>
                        {likes.length === 0 ? (
                            <p className="text-sm text-gray-700 py-4">Belum ada drama yang disukai.</p>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                {likes.map((d) => <DramaCard key={d.kdrama_id} drama={d} showRating={false} />)}
                            </div>
                        )}
                    </div>
                )}
            </main>
        </div>
    );
}
