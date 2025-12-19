"use client"
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
    Database,
    LogOut,
    Shield,
    ChevronDown,
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const router = useRouter();
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const [admin, setAdmin] = useState<{ username: string } | null>(null);

    useEffect(() => {
        // Check admin auth
        if (typeof window !== 'undefined') {
            const isAdmin = localStorage.getItem('is_admin');
            const username = localStorage.getItem('admin_username');

            if (!isAdmin || isAdmin !== 'true') {
                router.push('/');
            } else {
                setAdmin({ username: username || 'Admin' });
            }
        }
    }, [router]);

    // Close user menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as HTMLElement;
            if (!target.closest('.user-menu-container')) {
                setIsUserMenuOpen(false);
            }
        };

        if (isUserMenuOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isUserMenuOpen]);

    const handleLogout = () => {
        localStorage.clear();
        router.push('/');
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900/20 to-slate-900">
            {/* Top Navbar */}
            <nav className="sticky top-0 z-50 bg-slate-900/80 backdrop-blur-xl border-b border-red-500/30 shadow-lg shadow-red-500/10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        {/* Logo and Brand */}
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 bg-gradient-to-br from-red-600 to-orange-600 rounded-xl flex items-center justify-center shadow-lg shadow-red-600/30">
                                <Shield className="h-6 w-6 text-white" />
                            </div>
                            <div>
                                <h1 className="text-lg font-bold bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">
                                    Admin Panel
                                </h1>
                                <p className="text-xs text-gray-400 font-medium">Database Management</p>
                            </div>
                        </div>

                        {/* Admin Menu */}
                        <div className="relative user-menu-container">
                            <button
                                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                                className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-white/5 transition-colors"
                            >
                                <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-red-600 to-orange-600 text-white flex items-center justify-center font-bold text-sm shadow-lg shadow-red-600/20">
                                    <Shield className="h-5 w-5" />
                                </div>
                                <div className="hidden sm:block text-left">
                                    <p className="text-sm font-bold text-white leading-none">{admin?.username}</p>
                                    <p className="text-xs text-gray-400 mt-0.5">Administrator</p>
                                </div>
                                <ChevronDown className={cn(
                                    "h-4 w-4 text-gray-400 transition-transform hidden sm:block",
                                    isUserMenuOpen && "rotate-180"
                                )} />
                            </button>

                            {/* Dropdown Menu */}
                            {isUserMenuOpen && (
                                <div className="absolute right-0 mt-2 w-64 bg-slate-800 rounded-2xl shadow-2xl border border-red-500/20 overflow-hidden animate-in fade-in-0 zoom-in-95">
                                    <div className="p-4 bg-gradient-to-br from-red-600 to-orange-600 border-b border-red-500">
                                        <div className="flex items-center gap-3">
                                            <div className="h-12 w-12 rounded-xl bg-white/20 backdrop-blur-sm text-white flex items-center justify-center shadow-lg border-2 border-white/30">
                                                <Shield className="h-6 w-6" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-white">{admin?.username}</p>
                                                <p className="text-xs text-red-100">System Administrator</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="p-2">
                                        <button
                                            onClick={handleLogout}
                                            className="flex items-center gap-3 px-3 py-2.5 w-full text-sm font-semibold text-red-400 hover:bg-red-500/10 rounded-xl transition-colors"
                                        >
                                            <LogOut size={18} />
                                            Sign Out
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {children}
            </main>
        </div>
    );
}
