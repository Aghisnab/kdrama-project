import { useState } from 'react';
import { router, Link } from '@inertiajs/react';
import SearchableSelect from '@/Components/SearchableSelect';
import SearchableActorSelect from '@/Components/SearchableActorSelect';

const ROLE_OPTIONS = ['Main Role', 'Support Role', 'Guest Role', 'Guest', 'Bit Part', 'Unknown'];

export default function ActorForm({ actor, kdrama_name }) {
    const isEdit = !!actor;
    const [form, setForm] = useState({
        actor_name: actor?.actor_name ?? '',
        kdrama_id: actor?.kdrama_id ?? '',
        character_name: actor?.character_name ?? '',
        role: actor?.role ?? 'Unknown',
        photo_url: actor?.photo_url ?? '',      // tambah
        popularity: actor?.popularity ?? '',    // tambah
    });
    const [errors, setErrors] = useState({});
    const [processing, setProcessing] = useState(false);

    const set = (key, val) => setForm(prev => ({ ...prev, [key]: val }));

    const submit = (e) => {
        e.preventDefault();
        setProcessing(true);
        const options = {
            onError: (errs) => { setErrors(errs); setProcessing(false); },
            onSuccess: () => setProcessing(false),
        };
        if (isEdit) {
            router.put(`/admin/actors/${actor.actor_id}`, form, options);
        } else {
            router.post('/admin/actors', form, options);
        }
    };

    const inputCls = "w-full px-4 py-2.5 bg-[#0d0d14] border border-white/[0.08] rounded-xl text-sm text-white placeholder-gray-600 focus:outline-none focus:border-purple-500/50";
    const labelCls = "block text-xs text-gray-500 mb-1.5";
    const errorCls = "text-xs text-red-400 mt-1";

    return (
        <div className="min-h-screen bg-[#0a0a0f] text-white flex">
            <Sidebar active="/admin/actors" />

            <main className="flex-1 overflow-y-auto">
                <div className="max-w-3xl mx-auto p-4 sm:p-6 lg:p-8">
                    <div className="mb-8">
                        <h1 className="text-2xl sm:text-3xl font-semibold">
                            {isEdit ? 'Edit Peran Aktor' : 'Tambah Peran Aktor'}
                        </h1>
                        <p className="text-sm text-gray-500 mt-1">
                            {isEdit
                                ? `Mengedit: ${actor.actor_name} sebagai ${actor.character_name || '(karakter)'}`
                                : 'Isi data di bawah untuk menambahkan peran aktor baru'}
                        </p>
                    </div>

                    <form onSubmit={submit} className="bg-[#111118] border border-white/[0.06] rounded-3xl p-5 sm:p-8 space-y-6">
                        {/* Nama Aktor dengan pencarian */}
                        <div>
                            <label className={labelCls}>Nama Aktor *</label>
                            <SearchableActorSelect
                                value={form.actor_name}
                                onChange={(name) => set('actor_name', name)}
                                placeholder="Cari atau ketik nama aktor..."
                                url="/admin/actors/search-actor"
                                initialLabel={form.actor_name} // optional
                            />
                            {errors.actor_name && <p className={errorCls}>{errors.actor_name}</p>}
                        </div>

                        {/* Pencarian Drama */}
                        <div>
                            <label className={labelCls}>Drama *</label>
                            <SearchableSelect
                                value={form.kdrama_id}
                                onChange={(id) => set('kdrama_id', id)}
                                placeholder="Cari judul drama..."
                                url="/admin/actors/search-kdrama"
                                initialLabel={kdrama_name}
                            />
                            {errors.kdrama_id && <p className={errorCls}>{errors.kdrama_id}</p>}
                        </div>

                        {/* Nama Karakter */}
                        <div>
                            <label className={labelCls}>Nama Karakter</label>
                            <input
                                type="text"
                                value={form.character_name}
                                onChange={e => set('character_name', e.target.value)}
                                placeholder="Contoh: Eun Dan-oh"
                                className={inputCls}
                            />
                        </div>

                        {/* Role */}
                        <div>
                            <label className={labelCls}>Role</label>
                            <select
                                value={form.role}
                                onChange={e => set('role', e.target.value)}
                                className={inputCls}
                            >
                                {ROLE_OPTIONS.map(role => (
                                    <option key={role}>{role}</option>
                                ))}
                            </select>
                        </div>

                        {/* Photo URL */}
                        <div>
                            <label className={labelCls}>Photo URL (opsional)</label>
                            <input
                                type="url"
                                value={form.photo_url}
                                onChange={e => set('photo_url', e.target.value)}
                                placeholder="https://image.tmdb.org/t/p/w500/xxxx.jpg"
                                className={inputCls}
                            />
                            {form.photo_url && (
                                <div className="mt-3 flex justify-center">
                                    <img
                                        src={form.photo_url}
                                        alt="Preview foto aktor"
                                        className="w-28 h-36 object-cover rounded-lg border border-white/20 shadow-md"
                                        onError={(e) => e.target.style.display = 'none'}
                                    />
                                </div>
                            )}
                        </div>

                        {/* Popularity */}
                        <div>
                            <label className={labelCls}>Popularity (angka, opsional)</label>
                            <input
                                type="number"
                                value={form.popularity}
                                onChange={e => set('popularity', e.target.value)}
                                placeholder="Misal: 4"
                                className={inputCls}
                            />
                        </div>

                        <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-white/[0.06]">
                            <button
                                type="submit"
                                disabled={processing}
                                className="px-6 py-3 bg-violet-600 hover:bg-violet-700 disabled:opacity-50 rounded-2xl text-sm font-medium transition"
                            >
                                {processing ? 'Menyimpan...' : (isEdit ? 'Update' : 'Tambah')}
                            </button>
                            <button
                                type="button"
                                onClick={() => router.get('/admin/actors')}
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
        { label: 'Dashboard', icon: '⊞', href: '/admin/dashboard' },
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
