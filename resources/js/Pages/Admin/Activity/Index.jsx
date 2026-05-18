import { useState } from 'react';
import { Link, router, usePage } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';

export default function ActivitiesIndex({ users }) {
    const { data, links, meta } = users;
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [collapsed, setCollapsed] = useState(false);
    const { url } = usePage();
    const logout = () => router.post('/logout');

    const menuItems = [
        { label: 'Dashboard', icon: '📊', href: '/admin/dashboard' },
        { label: 'Kelola Drama', icon: '🎬', href: '/admin/kdrama' },
        { label: 'Kelola Aktor', icon: '🎭', href: '/admin/actors' },
        { label: 'Aktivitas User', icon: '📋', href: '/admin/activities' },
        { label: 'Drama Favorit', icon: '❤️', href: '/admin/likes' },
    ];

    return (
        <AdminLayout>

            {/* Main Content */}
                <div className="max-w-5xl mx-auto">
                    <div className="mb-6">
                        <h1 className="text-lg font-semibold text-white mt-5">User Activities</h1>
                        <p className="text-sm text-gray-500 mt-0.5">Ringkasan aktivitas seluruh pengguna</p>
                    </div>

                    {/* Stats bar */}
                    <div className="grid grid-cols-3 gap-3 mb-6">
                        {[
                            { label: 'Total User', value: meta?.total ?? data.length },
                            { label: 'Total Likes', value: data.reduce((s, u) => s + u.total_likes, 0) },
                            { label: 'Total Ditonton', value: data.reduce((s, u) => s + u.total_watched, 0) },
                        ].map(({ label, value }) => (
                            <div key={label} className="bg-[#0e0e18] border border-white/[0.06] rounded-xl p-4">
                                <p className="text-xs text-gray-600 uppercase tracking-widest mb-1">{label}</p>
                                <p className="text-2xl font-bold text-white">{value.toLocaleString()}</p>
                            </div>
                        ))}
                    </div>

                    {/* Table */}
                    <div className="bg-[#0e0e18] border border-white/[0.06] rounded-2xl overflow-hidden">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-white/[0.06]">
                                    {['Pengguna', 'Email', 'Bergabung', 'Disukai', 'Ditonton', ''].map((h) => (
                                        <th key={h} className="text-left text-[10px] uppercase tracking-widest text-gray-600 px-5 py-3 font-medium">
                                            {h}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {data.map((user) => (
                                    <tr key={user.id} className="border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors">
                                        <td className="px-5 py-3.5">
                                            <div className="flex items-center gap-2.5">
                                                <div className="w-8 h-8 rounded-full bg-violet-500/20 border border-violet-500/30 flex items-center justify-center text-xs font-bold text-violet-300">
                                                    {user.name.charAt(0).toUpperCase()}
                                                </div>
                                                <span className="text-white font-medium">{user.name}</span>
                                            </div>
                                        </td>
                                        <td className="px-5 py-3.5 text-gray-500">{user.email}</td>
                                        <td className="px-5 py-3.5 text-gray-600 text-xs">{user.joined_at}</td>
                                        <td className="px-5 py-3.5">
                                            <span className="inline-flex items-center gap-1 text-pink-400 font-semibold">
                                                <span className="text-base">♥</span> {user.total_likes}
                                            </span>
                                        </td>
                                        <td className="px-5 py-3.5">
                                            <span className="inline-flex items-center gap-1 text-violet-400 font-semibold">
                                                <span className="text-base">▶</span> {user.total_watched}
                                            </span>
                                        </td>
                                        <td className="px-5 py-3.5 text-right">
                                            <Link
                                                href={`/admin/activities/${user.id}`}
                                                className="text-xs px-3 py-1.5 rounded-lg bg-violet-500/15 text-violet-300 border border-violet-500/25 hover:bg-violet-500/25 transition-all"
                                            >
                                                Detail →
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        {data.length === 0 && (
                            <div className="text-center py-16 text-gray-600 text-sm">Belum ada data user.</div>
                        )}
                    </div>

                    {/* Pagination */}
                    {links && links.length > 3 && (
                        <div className="flex justify-center gap-1 mt-5">
                            {links.map((link, i) => (
                                <Link
                                    key={i}
                                    href={link.url ?? '#'}
                                    preserveScroll
                                    className={`px-3 py-1.5 rounded-lg text-xs transition-all ${
                                        link.active
                                            ? 'bg-violet-600 text-white'
                                            : link.url
                                            ? 'text-gray-500 hover:text-white hover:bg-white/[0.05]'
                                            : 'text-gray-700 cursor-not-allowed'
                                    }`}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                />
                            ))}
                        </div>
                    )}
                </div>
        </AdminLayout>
    );
}
