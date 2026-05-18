import { useState, useRef } from 'react';
import { Link } from '@inertiajs/react';

const moods = [
    {
        label: 'Healing',
        emoji: '🌿',
        desc: 'Tenang & nyaman',
        genres: ['Kehidupan','Keluarga','Friendship','Culinary','Medis','Coming-of-age'],
        style: 'border-purple-500/30 bg-purple-500/8 text-purple-300 hover:border-purple-400/50 hover:bg-purple-500/15',
        activeStyle: 'border-purple-400 bg-purple-500/25 text-purple-200 shadow-lg shadow-purple-500/20',
    },
    {
        label: 'Mau Nangis',
        emoji: '🌧️',
        desc: 'Drama menguras hati',
        genres: ['Melodrama', 'Romansa', 'Keluarga', 'Drama'],
        style: 'border-pink-500/30 bg-pink-500/8 text-pink-300 hover:border-pink-400/50 hover:bg-pink-500/15',
        activeStyle: 'border-pink-400 bg-pink-500/25 text-pink-200 shadow-lg shadow-pink-500/20',
    },
    {
        label: 'Butuh Tawa',
        emoji: '☀️',
        desc: 'Ringan & seru',
        genres: ['Komedi', 'Romansa', 'Office', 'School Life', 'Friendship'],
        style: 'border-sky-500/30 bg-sky-500/8 text-sky-300 hover:border-sky-400/50 hover:bg-sky-500/15',
        activeStyle: 'border-sky-400 bg-sky-500/25 text-sky-200 shadow-lg shadow-sky-500/20',
    },
    {
        label: 'Pengen Romance',
        emoji: '🌸',
        desc: 'Bikin baper',
        genres: ['Romansa', 'Fantasi', 'Melodrama', 'Chaebol', 'Reinkarnasi', 'Time Travel'],
        style: 'border-rose-500/30 bg-rose-500/8 text-rose-300 hover:border-rose-400/50 hover:bg-rose-500/15',
        activeStyle: 'border-rose-400 bg-rose-500/25 text-rose-200 shadow-lg shadow-rose-500/20',
    },
    {
        label: 'Suka Thriller',
        emoji: '🔪',
        desc: 'Menegangkan',
        genres: ['Thriller', 'Misteri', 'Kriminal', 'Psychological', 'Detektif', 'Spionase'],
        style: 'border-amber-500/30 bg-amber-500/8 text-amber-300 hover:border-amber-400/50 hover:bg-amber-500/15',
        activeStyle: 'border-amber-400 bg-amber-500/25 text-amber-200 shadow-lg shadow-amber-500/20',
    },
];

export default function Home({ dramas = [] }) {
    const [selected, setSelected] = useState(null);
    const [selectedExplore, setSelectedExplore] = useState(null);
    const [showExplore, setShowExplore] = useState(false);
    const [exploreList, setExploreList] = useState([]);
    const [loadingExplore, setLoadingExplore] = useState(false);

    // Mood state
    const [activeMood, setActiveMood] = useState(null);
    const [moodDramas, setMoodDramas] = useState([]);
    const [loadingMood, setLoadingMood] = useState(false);

    const dramaRef = useRef(null);

    const displayedDramas = activeMood ? moodDramas : dramas;

    const handleMoodClick = async (label) => {
        if (activeMood === label) {
            setActiveMood(null);
            setMoodDramas([]);
            return;
        }

        setActiveMood(label);
        setLoadingMood(true);
        setMoodDramas([]);

        try {
            const res = await fetch(`/api/mood?mood=${encodeURIComponent(label)}`);
            const data = await res.json();
            setMoodDramas(Array.isArray(data) ? data : []);
        } catch (e) {
            console.error(e);
            setMoodDramas([]);
        } finally {
            setLoadingMood(false);
            setTimeout(() => dramaRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 50);
        }
    };

    const handleResetMood = () => {
        setActiveMood(null);
        setMoodDramas([]);
    };

    const openExplore = async () => {
        setShowExplore(true);
        if (exploreList.length > 0) return;
        setLoadingExplore(true);
        try {
            const res = await fetch('/api/dramas');
            const data = await res.json();
            setExploreList(data);
        } catch (e) {
            console.error(e);
        } finally {
            setLoadingExplore(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#07070d] text-white">

            {/* Ambient blobs */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
                <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-violet-600/6 blur-3xl" />
                <div className="absolute top-1/3 -right-32 w-80 h-80 rounded-full bg-indigo-600/5 blur-3xl" />
                <div className="absolute bottom-0 left-1/3 w-72 h-72 rounded-full bg-pink-600/4 blur-3xl" />
            </div>

            {/* Navbar */}
            <nav className="relative z-10 flex justify-between items-center px-6 md:px-10 py-4 border-b border-white/[0.06] backdrop-blur-sm bg-[#07070d]/80">
                <div className="flex items-center gap-3">
                    <img src="/images/Logo-2.png" alt="You(D)rama" className="h-12 w-auto object-contain" />
                    <span className="text-lg font-extrabold tracking-widest bg-gradient-to-r from-indigo-300 via-purple-300 to-pink-300 bg-clip-text text-transparent">
                        You(D)rama
                    </span>
                </div>
                <div className="flex items-center gap-2">
                    <Link href="/login" className="px-4 py-2 text-sm text-gray-400 hover:text-white transition-colors">Login</Link>
                    <Link href="/register" className="px-4 py-2 bg-violet-600 hover:bg-violet-500 rounded-lg text-sm font-medium transition-all duration-200 shadow-lg shadow-violet-900/30">
                        Daftar Gratis
                    </Link>
                </div>
            </nav>

            {/* Hero */}
            <div className="relative z-10 text-center px-6 pt-24 pb-16">
                <div className="inline-flex items-center gap-2 bg-violet-500/10 border border-violet-500/25 text-purple-300 text-xs px-4 py-1.5 rounded-full mb-8">
                    <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse" />
                    Mood-based K-Drama Recommendation
                </div>
                <h1 className="text-4xl md:text-5xl font-bold leading-[1.15] mb-5 tracking-tight">
                    Temukan Drakor<br />
                    yang{' '}
                    <span className="bg-gradient-to-r from-violet-400 via-purple-300 to-pink-400 bg-clip-text text-transparent">
                        Pas Sama Mood
                    </span>{' '}
                    Kamu
                </h1>
                <p className="text-gray-500 text-base max-w-sm mx-auto mb-10 leading-relaxed">
                    Track, review, dan temukan Korean drama favorit berdasarkan suasana hati dari healing vibes sampai mau nangis brutal.
                </p>
                <div className="flex gap-3 justify-center">
                    <Link href="/register" className="px-7 py-3 bg-violet-600 hover:bg-violet-500 rounded-xl text-sm font-semibold transition-all duration-200 shadow-xl shadow-violet-900/40">
                        Mulai Sekarang
                    </Link>
                    <button onClick={openExplore} className="px-7 py-3 border border-white/15 rounded-xl text-sm text-gray-300 hover:bg-white/5 hover:border-white/25 transition-all duration-200">
                        Explore Drakor
                    </button>
                </div>
            </div>

            {/* Mood Section */}
            <div className="relative z-10 px-6 md:px-10 mb-20">
                <div className="text-center mb-6">
                    <p className="text-xs font-medium text-gray-600 uppercase tracking-widest">Pilih mood kamu hari ini</p>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-3 max-w-3xl mx-auto">
                    {moods.map((mood) => {
                        const isActive = activeMood === mood.label;
                        return (
                            <button
                                key={mood.label}
                                onClick={() => handleMoodClick(mood.label)}
                                disabled={loadingMood}
                                className={`group flex flex-col items-center gap-1.5 px-4 py-4 rounded-2xl border transition-all duration-200 disabled:opacity-60 disabled:cursor-wait ${
                                    isActive ? mood.activeStyle : mood.style
                                }`}
                            >
                                <span className={`text-2xl transition-transform duration-200 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`}>
                                    {mood.emoji}
                                </span>
                                <span className="text-xs font-semibold">{mood.label}</span>
                                <span className="text-[10px] opacity-60">{mood.desc}</span>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Drama List */}
            <div ref={dramaRef} className="relative z-10 px-6 md:px-10 mb-20">
                <div className="text-center mb-8">
                    <h2 className="text-xl font-bold text-white mb-1">
                        {activeMood ? `Drakor untuk Mood "${activeMood}"` : 'Drama Populer'}
                    </h2>
                    <p className="text-sm text-gray-600">
                        {activeMood && !loadingMood ? (
                            <>
                                {moodDramas.length} drama ditemukan ·{' '}
                                <button onClick={handleResetMood} className="text-violet-400 hover:text-violet-300 transition-colors underline underline-offset-2">
                                    reset filter
                                </button>
                            </>
                        ) : (
                            !activeMood && 'Berdasarkan popularitas tertinggi'
                        )}
                    </p>
                </div>

                {loadingMood ? (
                    <div className="flex flex-col items-center justify-center py-20 gap-3">
                        <div className="w-8 h-8 rounded-full border-2 border-violet-500/30 border-t-violet-400 animate-spin" />
                        <p className="text-gray-600 text-sm">Mencari drakor...</p>
                    </div>
                ) : displayedDramas.length === 0 ? (
                    <div className="text-center py-16">
                        <p className="text-3xl mb-3">🎬</p>
                        <p className="text-gray-500 text-sm">Tidak ada drama untuk mood ini.</p>
                        <button onClick={handleResetMood} className="mt-3 text-xs text-violet-400 hover:text-violet-300 transition-colors">
                            Lihat semua drama
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {displayedDramas.map((drama) => {
                            const genres = Array.isArray(drama.genre) ? drama.genre : [];
                            const isOngoing = !drama.end_date;
                            return (
                                <button
                                    key={drama.kdrama_id}
                                    onClick={() => setSelected(drama)}
                                    className="group bg-[#0e0e18] border border-white/[0.06] rounded-2xl overflow-hidden hover:border-purple-500/30 hover:bg-[#12121e] transition-all duration-200 text-left w-full shadow-lg hover:shadow-violet-900/20"
                                >
                                    <div className="h-48 overflow-hidden bg-[#0a0a12] relative">
                                        {drama.poster_url ? (
                                            <img
                                                src={drama.poster_url}
                                                alt={drama.kdrama_name}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                                onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }}
                                            />
                                        ) : null}
                                        <div
                                            className="w-full h-full bg-gradient-to-br from-violet-900/30 to-pink-900/20 flex flex-col items-center justify-center gap-2"
                                            style={{ display: drama.poster_url ? 'none' : 'flex' }}
                                        >
                                            <span className="text-4xl">🎬</span>
                                            {drama.year && <span className="text-xs text-gray-600">{drama.year}</span>}
                                        </div>
                                        {isOngoing && (
                                            <div className="absolute top-2 right-2">
                                                <span className="flex items-center gap-1 bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-[10px] px-2 py-0.5 rounded-full">
                                                    <span className="w-1 h-1 rounded-full bg-emerald-400 animate-pulse" />
                                                    On-going
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                    <div className="p-3.5">
                                        <p className="text-sm font-semibold text-white mb-2 truncate" title={drama.kdrama_name}>
                                            {drama.kdrama_name}
                                        </p>
                                        <div className="flex gap-1 flex-wrap mb-3">
                                            {genres.slice(0, 2).map((g) => (
                                                <span key={g} className="text-[10px] px-2 py-0.5 rounded-full bg-violet-500/15 text-purple-300 border border-purple-500/20">{g}</span>
                                            ))}
                                            {genres.length === 0 && <span className="text-xs text-gray-700">—</span>}
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-amber-400 text-xs font-bold">#{drama.popularity}</span>
                                            {!isOngoing && <span className="text-xs text-gray-600">Tamat</span>}
                                        </div>
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Footer CTA */}
            <div className="relative z-10 text-center py-14 border-t border-white/[0.06]">
                <p className="text-gray-600 text-sm mb-5">Udah punya akun? Langsung masuk dan mulai tracking.</p>
                <Link href="/login" className="px-7 py-3 bg-violet-600 hover:bg-violet-500 rounded-xl text-sm font-semibold transition-all duration-200 shadow-lg shadow-violet-900/30">
                    Login Sekarang
                </Link>
            </div>

            {/* ── Modal: Explore Drakor ── */}
            {showExplore && (
                <div className="fixed inset-0 z-40 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.88)' }} onClick={() => setShowExplore(false)}>
                    <div className="bg-[#0e0e18] border border-white/[0.08] rounded-2xl w-full max-w-4xl max-h-[85vh] flex flex-col shadow-2xl" onClick={(e) => e.stopPropagation()}>
                        <div className="flex justify-between items-center px-6 py-4 border-b border-white/[0.06]">
                            <div>
                                <h2 className="text-sm font-semibold text-white">Explore Drakor</h2>
                                <p className="text-xs text-gray-600 mt-0.5">Drama Korea Terbaru</p>
                            </div>
                            <button onClick={() => setShowExplore(false)} className="text-gray-600 hover:text-white text-lg transition-colors">✕</button>
                        </div>
                        <div className="overflow-y-auto flex-1 p-5">
                            {loadingExplore ? (
                                <div className="flex items-center justify-center py-16">
                                    <p className="text-gray-600 text-sm">Memuat drakor...</p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
                                    {exploreList.map((drama) => (
                                        <button
                                            key={drama.kdrama_id}
                                            onClick={() => { setShowExplore(false); setSelectedExplore(drama); }}
                                            className="group bg-[#0a0a12] border border-white/[0.05] rounded-xl overflow-hidden hover:border-purple-500/30 transition-all duration-200 text-left"
                                        >
                                            <div className="h-32 overflow-hidden bg-[#07070d]">
                                                {drama.poster_url ? (
                                                    <img src={drama.poster_url} alt={drama.kdrama_name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }} />
                                                ) : null}
                                                <div className="w-full h-full bg-gradient-to-br from-violet-900/20 to-pink-900/10 flex items-center justify-center text-2xl" style={{ display: drama.poster_url ? 'none' : 'flex' }}>🎬</div>
                                            </div>
                                            <div className="p-2.5">
                                                <p className="text-xs font-semibold text-white truncate mb-1">{drama.kdrama_name}</p>
                                                <span className="text-amber-400 text-[10px] font-bold">#{drama.popularity}</span>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                        <div className="px-6 py-4 border-t border-white/[0.06] flex justify-between items-center">
                            <p className="text-xs text-gray-600">Klik drama untuk lihat detail</p>
                            <Link href="/login" className="px-5 py-2 bg-violet-600 hover:bg-violet-500 rounded-lg text-xs font-semibold transition-all duration-200">
                                Login untuk lihat semua →
                            </Link>
                        </div>
                    </div>
                </div>
            )}

            {/* ── Modal: Detail dari Explore ── */}
            {selectedExplore && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.88)' }} onClick={() => setSelectedExplore(null)}>
                    <div className="bg-[#0e0e18] border border-white/[0.08] rounded-2xl w-full max-w-xl overflow-hidden shadow-2xl" onClick={(e) => e.stopPropagation()}>
                        <div className="flex">
                            <div className="w-44 flex-shrink-0 bg-[#07070d]" style={{ minHeight: '320px' }}>
                                {selectedExplore.poster_url ? (
                                    <img src={selectedExplore.poster_url} alt={selectedExplore.kdrama_name} className="w-full h-full object-cover" onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }} />
                                ) : null}
                                <div className="w-full h-full bg-gradient-to-br from-violet-900/30 to-pink-900/20 flex items-center justify-center text-4xl" style={{ display: selectedExplore.poster_url ? 'none' : 'flex', minHeight: '320px' }}>🎬</div>
                            </div>
                            <div className="flex-1 p-5 flex flex-col">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h2 className="text-sm font-bold text-white leading-snug">{selectedExplore.kdrama_name}</h2>
                                        <p className="text-xs text-gray-500 mt-0.5">{selectedExplore.year ?? '—'}</p>
                                    </div>
                                    <button onClick={() => setSelectedExplore(null)} className="text-gray-600 hover:text-white text-lg leading-none ml-3 flex-shrink-0 transition-colors">✕</button>
                                </div>
                                <div className="mb-4">
                                <p className="text-[10px] text-gray-600 uppercase tracking-widest mb-1">Status</p>
                                <div className="flex items-center gap-1.5">
                                    {(() => {
                                    const today = new Date();
                                    today.setHours(0, 0, 0, 0);

                                    let startDate = null;
                                    if (selectedExplore.start_date) {
                                        const d = new Date(selectedExplore.start_date);
                                        if (!isNaN(d)) startDate = new Date(d.getFullYear(), d.getMonth(), d.getDate());
                                    }

                                    let endDate = null;
                                    if (selectedExplore.end_date) {
                                        const d = new Date(selectedExplore.end_date);
                                        if (!isNaN(d)) endDate = new Date(d.getFullYear(), d.getMonth(), d.getDate());
                                    }

                                    let status = '';
                                    let color = '';
                                    let showPulse = false;

                                    // Prioritas: jika start_date tersedia dan masih akan datang
                                    if (startDate && startDate > today) {
                                        status = 'Akan Tayang';
                                        color = 'text-blue-400';
                                    }
                                    // Jika start_date <= hari ini atau start_date tidak ada, cek end_date
                                    else if (!endDate || endDate >= today) {
                                        status = 'On-Going';
                                        color = 'text-emerald-400';
                                        showPulse = true;
                                    }
                                    else {
                                        status = 'Selesai';
                                        color = 'text-gray-500';
                                    }

                                    return (
                                        <>
                                        {showPulse && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />}
                                        <span className={`text-sm font-semibold ${color}`}>{status}</span>
                                        </>
                                    );
                                    })()}
                                </div>
                                </div>
                                <div className="flex-1">
                                    <p className="text-[10px] text-gray-600 uppercase tracking-widest mb-1.5">Sinopsis</p>
                                    <p className="text-xs text-gray-400 leading-relaxed line-clamp-8">{selectedExplore.synopsis ?? 'Sinopsis belum tersedia.'}</p>
                                </div>
                                <div className="mt-5 pt-4 border-t border-white/[0.06]">
                                    <Link href="/register" className="block w-full text-center py-2.5 bg-violet-600 hover:bg-violet-500 rounded-xl text-xs font-semibold transition-all duration-200 shadow-lg shadow-violet-900/30">
                                        Login untuk tambah ke Watchlist
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* ── Modal: Detail dari Drama Populer ── */}
            {selected && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.88)' }} onClick={() => setSelected(null)}>
                    <div className="bg-[#0e0e18] border border-white/[0.08] rounded-2xl w-full max-w-3xl overflow-hidden shadow-2xl" onClick={(e) => e.stopPropagation()}>
                        <div className="flex">
                            <div className="w-60 flex-shrink-0 bg-[#07070d] overflow-hidden flex items-start" style={{ minHeight: '440px' }}>
                                {selected.poster_url ? (
                                    <img src={selected.poster_url} alt={selected.kdrama_name} className="w-full h-auto object-contain" onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }} />
                                ) : null}
                                <div className="w-full bg-gradient-to-br from-violet-900/30 to-pink-900/20 flex items-center justify-center text-5xl" style={{ display: selected.poster_url ? 'none' : 'flex', minHeight: '440px' }}>🎬</div>
                            </div>
                            <div className="flex-1 p-6 overflow-y-auto max-h-[85vh]">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h2 className="text-base font-bold text-white leading-tight">{selected.kdrama_name}</h2>
                                        <p className="text-xs text-gray-500 mt-1">{selected.year} · {selected.original_network ?? '—'}</p>
                                    </div>
                                    <button onClick={() => setSelected(null)} className="text-gray-600 hover:text-white text-xl leading-none ml-4 flex-shrink-0 transition-colors">✕</button>
                                </div>
                                <div className="flex gap-1 flex-wrap mb-5">
                                    {(Array.isArray(selected.genre) ? selected.genre : []).map((g) => (
                                        <span key={g} className="text-[10px] px-2.5 py-0.5 rounded-full bg-violet-500/15 text-purple-300 border border-purple-500/20">{g}</span>
                                    ))}
                                </div>
                                <div className="grid grid-cols-2 gap-2 mb-5">
                                    {[
                                        { label: 'Popularitas', value: selected.popularity ? `#${selected.popularity}` : '—', accent: 'text-amber-400' },
                                        { label: 'Status', value: !selected.end_date ? 'On-going' : 'Tamat', accent: !selected.end_date ? 'text-emerald-400' : 'text-gray-400' },
                                        { label: 'Total Episode', value: selected.total_episodes ?? '—' },
                                        { label: 'Durasi / Episode', value: selected.duration ? `${Math.floor(selected.duration / 60)} Jam` : '—' },
                                        { label: 'Tayang', value: selected.start_date ? new Date(selected.start_date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) : '—' },
                                        { label: 'Rating Konten', value: selected.content_rating ?? '—' },
                                    ].map(({ label, value, accent }) => (
                                        <div key={label} className="bg-white/[0.03] rounded-xl p-3 border border-white/[0.04]">
                                            <p className="text-[10px] text-gray-600 uppercase tracking-widest mb-1">{label}</p>
                                            <p className={`text-sm font-semibold ${accent ?? 'text-white'}`}>{value}</p>
                                        </div>
                                    ))}
                                </div>
                                {selected.director && (
                                    <div className="mb-2.5">
                                        <p className="text-[10px] text-gray-600 uppercase tracking-widest mb-0.5">Sutradara</p>
                                        <p className="text-sm text-white">
                                            {Array.isArray(selected.director) ? selected.director.join(', ') : selected.director.replace(/[\[\]']/g, '')}
                                        </p>
                                    </div>
                                )}
                                {selected.screenwriter && (
                                    <div className="mb-5">
                                        <p className="text-[10px] text-gray-600 uppercase tracking-widest mb-0.5">Penulis Skenario</p>
                                        <p className="text-sm text-white">
                                            {Array.isArray(selected.screenwriter) ? selected.screenwriter.join(', ') : selected.screenwriter.replace(/[\[\]']/g, '')}
                                        </p>
                                    </div>
                                )}
                                {selected.synopsis && (
                                    <div>
                                        <p className="text-[10px] text-gray-600 uppercase tracking-widest mb-1.5">Sinopsis</p>
                                        <p className="text-sm text-gray-400 leading-relaxed">{selected.synopsis}</p>
                                    </div>
                                )}
                                <div className="mt-6 pt-4 border-t border-white/[0.06]">
                                    <Link href="/register" className="block w-full text-center py-3 bg-violet-600 hover:bg-violet-500 rounded-xl text-sm font-semibold transition-all duration-200 shadow-xl shadow-violet-900/40">
                                        Login untuk tambah ke Watchlist
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
