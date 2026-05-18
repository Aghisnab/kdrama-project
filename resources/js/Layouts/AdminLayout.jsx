import { useState } from 'react';
import { usePage } from '@inertiajs/react';
import AdminSidebar from '@/Components/AdminSidebar';

export default function AdminLayout({ children }) {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [collapsed, setCollapsed] = useState(false);
    const { url } = usePage();

    return (
        <div className="min-h-screen bg-[#0a0a0f] text-white flex">
            {sidebarOpen && (
                <div
                    onClick={() => setSidebarOpen(false)}
                    className="fixed inset-0 bg-black/60 z-40 lg:hidden"
                />
            )}

            <AdminSidebar
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
                        <span className="text-sm font-medium text-violet-300 tracking-widest">DRAKORLIST</span>
                    </div>
                    <button
                        onClick={() => setSidebarOpen(true)}
                        className="w-9 h-9 rounded-xl bg-white/[0.05] border border-white/[0.08] flex items-center justify-center"
                    >
                        ☰
                    </button>
                </div>

                <div className="p-4 sm:p-6 lg:p-8">
                    {children}
                </div>
            </main>
        </div>
    );
}
