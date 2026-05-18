import { Link, router } from '@inertiajs/react';
import { useState } from 'react';

const statusOptions = [
    { value: 'plan_to_watch', label: 'Plan to Watch' },
    { value: 'watching', label: 'Watching' },
    { value: 'completed', label: 'Selesai' },
];

export default function KdramaShow({ drama, isLiked, watchlist }) {
    const [liked, setLiked] = useState(isLiked);
    const [watchStatus, setWatchStatus] = useState(watchlist?.status ?? '');
    const [loading, setLoading] = useState(false);

    const genres = Array.isArray(drama.genre) ? drama.genre : [];

    const handleLike = () => {
        setLiked(!liked);
        router.post('/dramas/like', { kdrama_id: drama.kdrama_id }, {
            preserveScroll: true,
            onError: () => setLiked(liked),
        });
    };

    const handleWatchlist = (status) => {
        if (loading) return;

        setLoading(true);
        setWatchStatus(status);

        router.post('/watchlist',
            {
                kdrama_id: drama.kdrama_id,
                status,
            },
            {
                preserveScroll: true,
                onFinish: () => setLoading(false),
            }
        );
    };

    const handleRemoveWatchlist = () => {
        if (loading) return;

        setLoading(true);
        setWatchStatus('');

        router.delete('/watchlist', {
            data: {
                kdrama_id: drama.kdrama_id,
            },
            preserveScroll: true,
            onFinish: () => setLoading(false),
        });
    };


    return (
        <div className="min-h-screen bg-[#0a0a0f] text-white">
            <nav className="flex justify-between items-center px-6 py-4 border-b border-white/[0.07] sticky top-0 bg-[#0a0a0f] z-10">
                <button onClick={() => history.back()} className="text-gray-500 hover:text-white text-sm transition">← Kembali</button>
                <span className="text-lg font-extrabold tracking-widest bg-gradient-to-r from-indigo-300 via-purple-300 to-pink-300 bg-clip-text text-transparent drop-shadow-lg">You(D)rama</span>
                <div className="w-16" />
            </nav>

            <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
                <div className="flex flex-col sm:flex-row gap-6">

                    {/* Poster */}
                    <div className="w-full sm:w-52 flex-shrink-0">
                        <div className="w-full sm:w-52 h-72 sm:h-80 rounded-2xl overflow-hidden bg-[#111118]">
                            {drama.poster_url ? (
                                <img src={drama.poster_url} alt={drama.kdrama_name}
                                    className="w-full h-full object-cover" />
                            ) : <div className="w-full h-full flex items-center justify-center text-5xl">🎬</div>}
                        </div>
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                        <h1 className="text-xl sm:text-2xl font-medium text-white mb-1">{drama.kdrama_name}</h1>
                        <p className="text-sm text-gray-500 mb-4">
                            {drama.year} · {drama.original_network ?? '—'} · {drama.country ?? 'South Korea'}
                        </p>

                        {/* Genre */}
                        <div className="flex flex-wrap gap-1.5 mb-5">
                            {genres.map((g) => (
                                <span key={g} className="text-xs px-2.5 py-1 rounded-full bg-violet-500/20 text-purple-300 border border-violet-500/20">
                                    {g}
                                </span>
                            ))}
                        </div>

                        {/* Stats */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
                            {[
                                { label: 'Episode', value: drama.total_episodes ?? '—' },
                                { label: 'Durasi', value: drama.duration ? `${drama.duration} mnt` : '—' },
                                { label: 'Popularitas', value: drama.popularity ? `#${drama.popularity}` : '—', color: 'text-yellow-300' },
                                { label: 'Rating', value: drama.content_rating ?? '—' },
                            ].map((s) => (
                                <div key={s.label} className="bg-[#111118] border border-white/[0.06] rounded-xl p-3">
                                    <p className="text-xs text-gray-600 mb-1">{s.label}</p>
                                    <p className={`text-sm font-medium ${s.color ?? 'text-white'}`}>{s.value}</p>
                                </div>
                            ))}
                        </div>

                        {/* Tayang */}
                        <div className="flex gap-4 mb-5 text-xs text-gray-500">
                            {drama.start_date && (
                                <span>Tayang: {new Date(drama.start_date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                            )}
                            {drama.end_date && (
                                <span>Selesai: {new Date(drama.end_date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                            )}
                            {drama.aired_on && <span>Hari tayang: {drama.aired_on}</span>}
                        </div>

                        {/* Actions */}
                        <div className="flex flex-wrap gap-3 mb-6">

                            {/* Like */}
                            <button onClick={handleLike}
                                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm border transition
                                    ${liked
                                        ? 'bg-pink-500/20 border-pink-500/40 text-pink-300'
                                        : 'border-white/10 text-gray-400 hover:border-pink-500/30 hover:text-pink-300'}`}>
                                {liked ? '♥' : '♡'} {liked ? 'Disukai' : 'Suka'}
                            </button>

                            {/* Watchlist dropdown */}
                            <div>
                                <div className="flex gap-2 flex-wrap">
                                    {statusOptions.map((opt) => (
                                        <button
                                            key={opt.value}
                                            onClick={() =>
                                                watchStatus === opt.value
                                                    ? handleRemoveWatchlist()
                                                    : handleWatchlist(opt.value)
                                            }
                                            disabled={loading}
                                            className={`px-4 py-2.5 rounded-xl text-xs border transition disabled:opacity-50
                                                ${watchStatus === opt.value
                                                    ? 'bg-violet-500/20 border-violet-500/40 text-purple-300'
                                                    : 'border-white/10 text-gray-500 hover:border-violet-500/30 hover:text-purple-300'
                                                }`}
                                        >
                                            {watchStatus === opt.value ? '✓ ' : ''}
                                            {opt.label}
                                        </button>
                                    ))}
                                </div>

                                {watchStatus && (
                                    <p className="text-xs text-violet-300 mt-2">
                                        Status: {statusOptions.find(s => s.value === watchStatus)?.label}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Sutradara & Penulis */}
                        <div className="flex gap-6 mb-5">
                            {drama.director && (
                                <div>
                                    <p className="text-xs text-gray-600 mb-1">Sutradara</p>
                                    <p className="text-sm text-white">{Array.isArray(drama.director) ? drama.director.join(', ') : drama.director.replace(/[\[\]']/g, '')}</p>
                                </div>
                            )}
                            {drama.screenwriter && (
                                <div>
                                    <p className="text-xs text-gray-600 mb-1">Penulis Skenario</p>
                                    <p className="text-sm text-white">{Array.isArray(drama.screenwriter) ? drama.screenwriter.join(', ') : drama.screenwriter.replace(/[\[\]']/g, '')}</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Sinopsis */}
                {drama.synopsis && (
                    <div className="mt-6 bg-[#111118] border border-white/[0.06] rounded-2xl p-5">
                        <h2 className="text-sm font-medium text-white mb-3">Sinopsis</h2>
                        <p className="text-sm text-gray-400 leading-relaxed">{drama.synopsis}</p>
                    </div>
                )}
            </div>
        </div>
    );
}
