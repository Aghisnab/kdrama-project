import { useState } from 'react';
import { Link, router, usePage } from '@inertiajs/react';

export default function Show({ actor }) {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [collapsed, setCollapsed] = useState(false);
    const { url } = usePage();

    if (!actor) return null;

    const initials = actor.actor_name
        ? actor.actor_name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
        : '??';

    const handleDelete = (actorId, actorName, characterName) => {
        if (confirm(`Hapus peran "${characterName}" dari ${actorName}?`)) {
            router.delete(`/admin/actors/${actorId}`);
        }
    };

    return (
        <div className="min-h-screen bg-[#0a0a0f] text-white flex">
            {/* Overlay mobile */}
            {sidebarOpen && (
                <div
                    onClick={() => setSidebarOpen(false)}
                    className="fixed inset-0 bg-black/60 z-40 lg:hidden"
                />
            )}

            <Sidebar
                active={url}
                sidebarOpen={sidebarOpen}
                setSidebarOpen={setSidebarOpen}
                collapsed={collapsed}
                setCollapsed={setCollapsed}
            />

            <main className={`flex-1 min-w-0 overflow-y-auto transition-all duration-300 ${collapsed ? 'lg:ml-20' : 'lg:ml-56'}`}>
                {/* Mobile topbar */}
                <div className="lg:hidden flex items-center justify-between px-4 py-3 border-b border-white/[0.06] bg-[#0d0d15] sticky top-0 z-30">
                    <div className="flex items-center gap-2">
                        <img src="/images/logo.png" alt="You(D)rama" className="h-6 w-auto" />
                        <span className="text-sm font-medium text-violet-300 tracking-widest">You(D)rama</span>
                    </div>
                    <button
                        onClick={() => setSidebarOpen(true)}
                        className="w-9 h-9 rounded-xl bg-white/[0.05] border border-white/[0.08] flex items-center justify-center"
                    >
                        ☰
                    </button>
                </div>

                <div className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8">
                    {/* Tombol kembali ke index */}
                    <div className="mb-4">
                        <button
                            onClick={() => router.get('/admin/actors')}
                            className="text-gray-500 hover:text-white text-sm transition flex items-center gap-1"
                        >
                            ← Kembali ke daftar aktor
                        </button>
                    </div>

                    {/* Header Aktor */}
                    <div className="flex items-center gap-4 mb-8">
                        <div className="w-16 h-16 rounded-full overflow-hidden bg-violet-500/20 flex items-center justify-center">
                            {actor.photo_url ? (
                                <img src={actor.photo_url} alt={actor.actor_name} className="w-full h-full object-cover" />
                            ) : (
                                <span className="text-xl font-medium text-purple-300">{initials}</span>
                            )}
                        </div>
                        <div>
                            <h1 className="text-2xl font-medium">{actor.actor_name}</h1>
                            <p className="text-gray-500">{actor.dramas?.length ?? 0} drama</p>
                            {actor.popularity && <p className="text-yellow-300 text-sm">Popularity #{actor.popularity}</p>}
                        </div>
                    </div>

                    {/* Grid Drama */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                        {actor.dramas?.map((item) => (
                            <div key={item.actor_id} className="relative group bg-[#111118] border border-white/[0.06] rounded-xl overflow-hidden hover:border-purple-500/30 transition">
                                <Link href={`/dramas/${item.kdrama?.kdrama_id}`} className="block">
                                    <div className="h-36 bg-gradient-to-br from-violet-900/30 to-pink-900/20 overflow-hidden">
                                        {item.kdrama?.poster_url ? (
                                            <img src={item.kdrama.poster_url} alt={item.kdrama.kdrama_name} className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-3xl">🎬</div>
                                        )}
                                    </div>
                                    <div className="p-3">
                                        <p className="text-sm font-medium text-white truncate">{item.kdrama?.kdrama_name}</p>
                                        <p className="text-xs text-gray-400 truncate">{item.character_name}</p>
                                        <span className="text-xs text-purple-400">{item.role}</span>
                                    </div>
                                </Link>
                                {/* Tombol Edit & Hapus */}
                                <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition">
                                    <Link
                                        href={`/admin/actors/${item.actor_id}/edit`}
                                        className="bg-black/60 hover:bg-violet-600 rounded-full p-1.5 text-xs"
                                    >
                                        ✏️
                                    </Link>
                                    <button
                                        onClick={() => handleDelete(item.actor_id, actor.actor_name, item.character_name)}
                                        className="bg-black/60 hover:bg-red-600 rounded-full p-1.5 text-xs"
                                    >
                                        🗑️
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {(!actor.dramas || actor.dramas.length === 0) && (
                        <div className="text-center text-gray-500 py-12">Tidak ada data drama.</div>
                    )}
                </div>
            </main>
        </div>
    );
}

function Sidebar({ active, sidebarOpen, setSidebarOpen, collapsed, setCollapsed }) {
    const logout = () => router.post('/logout');
    const menuItems = [
        { label: 'Dashboard', icon: '📊', href: '/admin/dashboard' },
        { label: 'Kelola Drama', icon: '🎬', href: '/admin/kdrama' },
        { label: 'Kelola Aktor', icon: '🎭', href: '/admin/actors' },
        { label: 'Aktivitas User', icon: '📋', href: '/admin/activities' },
        { label: 'Drama Disukai', icon: '❤️', href: '/admin/likes' },
        { label: 'Drama Favorit', icon: '⭐', href: '/admin/favorites' },
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
