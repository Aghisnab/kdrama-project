import { useState } from 'react';
import { Link, router, usePage } from '@inertiajs/react';

const menuItems = [
    { label: 'Dashboard', href: '/dashboard', icon: '🏠' },
    { label: 'Drama',     href: '/dramas',   icon: '🎬' },
    { label: 'Aktor',     href: '/actors',   icon: '⭐' },
    { label: 'Watchlist', href: '/watchlist', icon: '📺' },
];

export default function UserNavbar() {
    const [menuOpen, setMenuOpen] = useState(false);
    const { url, props } = usePage();
    const user = props.auth?.user;

    const logout = () => router.post('/logout');

    const isActive = (href) => {
        if (href === '/dashboard') return url === href;
        return url.startsWith(href);
    };

    // Inisial untuk avatar (ambil huruf pertama dari nama)
    const userInitial = user?.name?.charAt(0)?.toUpperCase() || 'U';

    return (
        <>
            <nav className="sticky top-0 z-50 bg-black/40 backdrop-blur-xl border-b border-white/10 shadow-lg shadow-black/5">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        {/* Logo with glow */}
                        <Link
                            href="/dashboard"
                            className="group relative text-xl font-black tracking-tighter bg-gradient-to-r from-indigo-300 via-purple-300 to-pink-300 bg-clip-text text-transparent drop-shadow-md transition-all duration-300 hover:scale-[1.02]"
                        >
                            You(D)rama
                            <span className="absolute -bottom-0.5 left-0 w-0 h-[2px] bg-gradient-to-r from-indigo-400 to-pink-400 transition-all duration-300 group-hover:w-full" />
                        </Link>

                        {/* Desktop menu */}
                        <div className="hidden sm:flex items-center gap-0.5 bg-white/5 rounded-full p-1 backdrop-blur-sm">
                            {menuItems.map((item) => (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={`relative flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                                        isActive(item.href)
                                            ? 'text-white bg-gradient-to-r from-purple-500/30 to-indigo-500/30 shadow-[0_0_10px_rgba(168,85,247,0.3)]'
                                            : 'text-gray-400 hover:text-white hover:bg-white/10'
                                    }`}
                                >
                                    <span className="text-base">{item.icon}</span>
                                    <span>{item.label}</span>
                                    {isActive(item.href) && (
                                        <span className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-500/20 to-indigo-500/20 -z-10" />
                                    )}
                                </Link>
                            ))}
                        </div>

                        {/* Desktop user area */}
                        <div className="hidden sm:flex items-center gap-4">
                            {/* Avatar + Name */}
                            {user && (
                                <div className="flex items-center gap-2 pl-2">
                                    <div className="relative">
                                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-sm font-semibold shadow-md ring-2 ring-white/20">
                                            {userInitial}
                                        </div>
                                        <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full ring-1 ring-black" />
                                    </div>
                                    <span className="text-sm text-gray-300 font-medium">{user.name}</span>
                                </div>
                            )}
                            {/* Logout button */}
                            <button
                                onClick={logout}
                                className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-full transition-all duration-200"
                            >
                                <span>🚪</span>
                                <span>Logout</span>
                            </button>
                        </div>

                        {/* Mobile hamburger button */}
                        <button
                            onClick={() => setMenuOpen(!menuOpen)}
                            className="sm:hidden relative w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-300 hover:text-white hover:bg-white/10 transition-all duration-200 focus:outline-none"
                        >
                            <span className="absolute text-xl transform transition-transform duration-200">
                                {menuOpen ? '✕' : '☰'}
                            </span>
                        </button>
                    </div>
                </div>

                {/* Mobile menu dropdown - smooth animation */}
                <div
                    className={`sm:hidden overflow-hidden transition-all duration-300 ease-in-out ${
                        menuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                    }`}
                >
                    <div className="border-t border-white/10 bg-black/60 backdrop-blur-xl px-4 py-4 flex flex-col gap-1">
                        {menuItems.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                onClick={() => setMenuOpen(false)}
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-base transition-all duration-200 ${
                                    isActive(item.href)
                                        ? 'bg-gradient-to-r from-purple-500/20 to-indigo-500/20 text-white'
                                        : 'text-gray-400 hover:text-white hover:bg-white/10'
                                }`}
                            >
                                <span className="text-xl">{item.icon}</span>
                                <span className="font-medium">{item.label}</span>
                                {isActive(item.href) && (
                                    <span className="ml-auto w-1.5 h-1.5 rounded-full bg-purple-400" />
                                )}
                            </Link>
                        ))}
                        <div className="border-t border-white/10 my-2 pt-2">
                            {user && (
                                <div className="flex items-center gap-3 px-4 py-2">
                                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-sm font-semibold">
                                        {userInitial}
                                    </div>
                                    <span className="text-sm text-gray-300">{user.name}</span>
                                </div>
                            )}
                            <button
                                onClick={logout}
                                className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-base text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-all duration-200"
                            >
                                <span>🚪</span>
                                <span>Logout</span>
                            </button>
                        </div>
                    </div>
                </div>
            </nav>
        </>
    );
}
