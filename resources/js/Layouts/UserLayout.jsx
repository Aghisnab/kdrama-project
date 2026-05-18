import { useState } from 'react';
import { usePage } from '@inertiajs/react';
import UserNavbar from '@/Components/UserNavbar';

export default function UserLayout({ children }) {
    return (
        <div className="min-h-screen bg-[#0a0a0f] text-white">
            <UserNavbar />
            <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
                {children}
            </div>
        </div>
    );
}
