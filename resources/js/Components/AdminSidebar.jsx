import { Link, router } from '@inertiajs/react';

const menuItems = [
    { label: 'Dashboard',      icon: '📊', href: '/admin/dashboard' },
    { label: 'Kelola Drama',   icon: '🎬', href: '/admin/kdrama' },
    { label: 'Kelola Aktor',   icon: '🎭', href: '/admin/actors' },
    { label: 'Aktivitas User', icon: '📋', href: '/admin/activities' },
    { label: 'Drama Favorit',  icon: '❤️', href: '/admin/likes' },
];

export default function AdminSidebar({ active, sidebarOpen, setSidebarOpen, collapsed, setCollapsed }) {
    const logout = () => router.post('/logout');

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
            {/* Logo */}
            <div className={`flex items-center mb-6 ${collapsed ? 'justify-center' : 'justify-between'}`}>
                <div className={`flex items-center gap-2 ${collapsed ? 'justify-center w-full' : ''}`}>
                    <img
                        src="/images/logo.png"
                        alt="You(D)rama"
                        onClick={() => setCollapsed(!collapsed)}
                        className={`object-contain cursor-pointer transition-all duration-300 ${collapsed ? 'h-10 w-10' : 'h-8 w-auto'}`}
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

            {/* Nav */}
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
                        ${collapsed ? 'flex justify-center' : ''}`}
                >
                    {collapsed ? '🚪' : 'Logout'}
                </button>
            </div>
        </aside>
    );
}
