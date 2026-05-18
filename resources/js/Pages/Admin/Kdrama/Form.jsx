import { useState } from 'react';
import { Link, router } from '@inertiajs/react';

const GENRE_OPTIONS = [
    'Romansa', 'Drama', 'Komedi', 'Laga', 'Misteri', 'Horor', 'Fantasi', 'Sejarah',
    'Thriller', 'Kehidupan', 'Remaja', 'Keluarga', 'Supernatural', 'Kriminal',
    'Medis', 'Hukum', 'Fiksi Ilmiah', 'Musik', 'Olahraga', 'BL', 'LGBTQ+', 'Coming-of-age', 'Office', 'Psychological', 'Time Travel', 'Melodrama', 'Political', 'Balas Dendam', 'Adaptasi', 'Friendship', 'Teknologi', 'Petualangan',
    'Zombie', 'Reinkarnasi', 'Spionase', 'Culinary', 'Detektif', 'School Life', 'Military', 'Chaebol', 'Webtoon'
];

export default function KdramaForm({ drama }) {
    const isEdit = !!drama;

    const [form, setForm] = useState({
        kdrama_name:      drama?.kdrama_name      ?? '',
        year:             drama?.year             ?? '',
        director:         drama?.director         ?? '',
        screenwriter:     drama?.screenwriter     ?? '',
        country:          drama?.country          ?? 'South Korea',
        genre:            drama?.genre            ?? [],
        total_episodes:   drama?.total_episodes   ?? '',
        duration:         drama?.duration         ?? '',
        start_date:       drama?.start_date       ?? '',
        end_date:         drama?.end_date         ?? '',
        aired_on:         drama?.aired_on         ?? '',
        original_network: drama?.original_network ?? '',
        content_rating:   drama?.content_rating   ?? '',
        synopsis:         drama?.synopsis         ?? '',
        rank:             drama?.rank             ?? '',
        popularity:       drama?.popularity       ?? '',
        poster_url:       drama?.poster_url       ?? '',
    });

    const [errors, setErrors] = useState({});
    const [processing, setProcessing] = useState(false);

    const set = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

    const toggleGenre = (genre) => {
        setForm((prev) => ({
            ...prev,
            genre: prev.genre.includes(genre)
                ? prev.genre.filter((g) => g !== genre)
                : [...prev.genre, genre],
        }));
    };

    const submit = (e) => {
        e.preventDefault();
        setProcessing(true);

        const options = {
            onError: (errs) => { setErrors(errs); setProcessing(false); },
            onSuccess: () => setProcessing(false),
        };

        if (isEdit) {
            router.put(`/admin/kdrama/${drama.kdrama_id}`, form, options);
        } else {
            router.post('/admin/kdrama', form, options);
        }
    };

    const inputCls = "w-full px-4 py-2.5 bg-[#0d0d14] border border-white/[0.08] rounded-xl text-sm text-white placeholder-gray-600 focus:outline-none focus:border-purple-500/50";
    const labelCls = "block text-xs text-gray-500 mb-1.5";
    const errorCls = "text-xs text-red-400 mt-1";

    return (
        <div className="min-h-screen bg-[#0a0a0f] text-white flex">
            <Sidebar active="/admin/kdrama" />

            <main className="flex-1 overflow-y-auto">
                <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">

                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="text-2xl sm:text-3xl font-semibold text-white">
                            {isEdit ? 'Edit Drama' : 'Tambah Drama'}
                        </h1>

                        <p className="text-sm text-gray-500 mt-1">
                            {isEdit
                                ? `Mengedit: ${drama.kdrama_name}`
                                : 'Tambah drama baru ke database'}
                        </p>
                    </div>

                    {/* Form Container */}
                    <form
                        onSubmit={submit}
                        className="bg-[#111118] border border-white/[0.06] rounded-3xl p-5 sm:p-8"
                    >

                        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">

                            {/* LEFT */}
                            <div className="space-y-5">

                                <div>
                                    <label className={labelCls}>Judul Drama *</label>

                                    <input
                                        type="text"
                                        value={form.kdrama_name}
                                        onChange={(e) => set('kdrama_name', e.target.value)}
                                        placeholder="Goblin"
                                        className={inputCls}
                                    />

                                    {errors.kdrama_name && (
                                        <p className={errorCls}>
                                            {errors.kdrama_name}
                                        </p>
                                    )}
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className={labelCls}>Tahun</label>

                                        <input
                                            type="number"
                                            value={form.year}
                                            onChange={(e) => set('year', e.target.value)}
                                            placeholder="2024"
                                            className={inputCls}
                                        />
                                    </div>

                                    <div>
                                        <label className={labelCls}>Negara</label>

                                        <input
                                            type="text"
                                            value={form.country}
                                            onChange={(e) => set('country', e.target.value)}
                                            className={inputCls}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className={labelCls}>Sutradara</label>

                                    <input
                                        type="text"
                                        value={form.director}
                                        onChange={(e) => set('director', e.target.value)}
                                        placeholder="Nama sutradara"
                                        className={inputCls}
                                    />
                                </div>

                                <div>
                                    <label className={labelCls}>Penulis Skenario</label>

                                    <input
                                        type="text"
                                        value={form.screenwriter}
                                        onChange={(e) => set('screenwriter', e.target.value)}
                                        placeholder="Nama penulis"
                                        className={inputCls}
                                    />
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className={labelCls}>Total Episode</label>

                                        <input
                                            type="number"
                                            value={form.total_episodes}
                                            onChange={(e) => set('total_episodes', e.target.value)}
                                            placeholder="16"
                                            className={inputCls}
                                        />
                                    </div>

                                    <div>
                                        <label className={labelCls}>Durasi (menit)</label>

                                        <input
                                            type="number"
                                            value={form.duration}
                                            onChange={(e) => set('duration', e.target.value)}
                                            placeholder="60"
                                            className={inputCls}
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className={labelCls}>Tanggal Mulai</label>

                                        <input
                                            type="date"
                                            value={form.start_date}
                                            onChange={(e) => set('start_date', e.target.value)}
                                            className={inputCls}
                                        />
                                    </div>

                                    <div>
                                        <label className={labelCls}>Tanggal Selesai</label>

                                        <input
                                            type="date"
                                            value={form.end_date}
                                            onChange={(e) => set('end_date', e.target.value)}
                                            className={inputCls}
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className={labelCls}>Network</label>

                                        <input
                                            type="text"
                                            value={form.original_network}
                                            onChange={(e) => set('original_network', e.target.value)}
                                            placeholder="tvN, Netflix..."
                                            className={inputCls}
                                        />
                                    </div>

                                    <div>
                                        <label className={labelCls}>Tayang Hari</label>

                                        <input
                                            type="text"
                                            value={form.aired_on}
                                            onChange={(e) => set('aired_on', e.target.value)}
                                            placeholder="Sabtu, Minggu"
                                            className={inputCls}
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                    <div>
                                        <label className={labelCls}>Rating</label>

                                        <input
                                            type="text"
                                            value={form.content_rating}
                                            onChange={(e) => set('content_rating', e.target.value)}
                                            placeholder="15+"
                                            className={inputCls}
                                        />
                                    </div>

                                    <div>
                                        <label className={labelCls}>Popularity</label>

                                        <input
                                            type="number"
                                            value={form.popularity}
                                            onChange={(e) => set('popularity', e.target.value)}
                                            placeholder="15000000"
                                            className={inputCls}
                                        />
                                    </div>

                                    <div>
                                        <label className={labelCls}>Rank</label>

                                        <input
                                            type="number"
                                            value={form.rank}
                                            onChange={(e) => set('rank', e.target.value)}
                                            placeholder="1"
                                            className={inputCls}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* RIGHT */}
                            <div className="space-y-5">

                                <div>
                                    <label className={labelCls}>Poster URL</label>

                                    <input
                                        type="url"
                                        value={form.poster_url}
                                        onChange={(e) => set('poster_url', e.target.value)}
                                        placeholder="https://image.tmdb.org/..."
                                        className={inputCls}
                                    />

                                    {form.poster_url && (
                                        <div className="mt-4 flex justify-center">
                                            <img
                                                src={form.poster_url}
                                                alt="preview"
                                                className="w-40 rounded-2xl object-cover border border-white/10 shadow-lg"
                                                onError={(e) => e.target.style.display = 'none'}
                                            />
                                        </div>
                                    )}
                                </div>

                                <div>
                                    <label className={labelCls}>Genre</label>

                                    <div className="flex flex-wrap gap-2">
                                        {GENRE_OPTIONS.map((genre) => (
                                            <button
                                                key={genre}
                                                type="button"
                                                onClick={() => toggleGenre(genre)}
                                                className={`px-3 py-2 rounded-full text-xs border transition
                                                ${
                                                    form.genre.includes(genre)
                                                        ? 'bg-violet-500/20 border-violet-500/40 text-purple-300'
                                                        : 'border-white/10 text-gray-500 hover:border-white/20 hover:text-gray-300'
                                                }`}
                                            >
                                                {genre}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <label className={labelCls}>Sinopsis</label>

                                    <textarea
                                        value={form.synopsis}
                                        onChange={(e) => set('synopsis', e.target.value)}
                                        rows={12}
                                        placeholder="Cerita singkat drama..."
                                        className={`${inputCls} resize-none`}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* BUTTONS */}
                        <div className="flex flex-col sm:flex-row gap-3 mt-10 pt-6 border-t border-white/[0.06]">
                            <button
                                type="submit"
                                disabled={processing}
                                className="px-6 py-3 bg-violet-600 hover:bg-violet-700 disabled:opacity-50 rounded-2xl text-sm font-medium transition"
                            >
                                {processing
                                    ? 'Menyimpan...'
                                    : isEdit
                                        ? 'Update Drama'
                                        : 'Tambah Drama'}
                            </button>

                            <button
                                type="button"
                                onClick={() => router.get('/admin/kdrama')}
                                className="px-6 py-3 border border-white/10 rounded-2xl text-sm text-gray-400 hover:text-white hover:border-white/20 transition"
                            >
                                Batal
                            </button>
                        </div>
                    </form>
                </div>
            </main>
        </div>
    );
}

function Sidebar({ active }) {
    const logout = () => router.post('/logout');
    const menuItems = [
        { label: 'Dashboard', icon: '📊', href: '/admin/dashboard' },
        { label: 'Kelola Drama', icon: '🎬', href: '/admin/kdrama' },
        { label: 'Kelola Aktor', icon: '👤', href: '/admin/actors' },
        { label: 'Aktivitas User', icon: '📋', href: '/admin/activities' },
        { label: 'Drama Disukai', icon: '♡', href: '/admin/likes' },
        { label: 'Drama Favorit', icon: '⭐', href: '/admin/favorites' },
    ];
    return (
        <aside className="w-56 flex-shrink-0 bg-[#0d0d15] border-r border-white/[0.07] flex flex-col py-6 px-3">
            <div className="text-purple-400 font-medium tracking-widest text-sm px-3 mb-3">DRAKORLIST</div>
            <div className="px-3 mb-5">
                <span className="text-xs bg-violet-500/20 text-purple-300 px-2 py-1 rounded-full border border-violet-500/30">Admin Panel</span>
            </div>
            <nav className="flex flex-col gap-1 flex-1">
                {menuItems.map((item) => (
                    <Link key={item.href} href={item.href}
                        className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition
                            ${active === item.href ? 'bg-violet-500/15 text-purple-300' : 'text-gray-600 hover:text-gray-300 hover:bg-white/[0.04]'}`}>
                        <span>{item.icon}</span>{item.label}
                    </Link>
                ))}
            </nav>
            <div className="border-t border-white/[0.07] pt-4 px-2">
                <button onClick={logout} className="w-full text-left px-3 py-2 text-xs text-gray-600 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition">
                    Logout
                </button>
            </div>
        </aside>
    );
}
