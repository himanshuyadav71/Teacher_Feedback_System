"use client"
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import {
    LayoutDashboard,
    FileText,
    User,
    LogOut,
    Menu,
    X,
} from 'lucide-react';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/Popover';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const router = useRouter();
    const pathname = usePathname();
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [user, setUser] = useState<{ name: string; email: string; enrollment: string } | null>(null);

    useEffect(() => {
        // Check auth
        if (typeof window !== 'undefined') {
            const session = localStorage.getItem('session_key');
            if (!session) {
                router.push('/');
            } else {
                setUser({
                    name: localStorage.getItem('fullName') || 'Student',
                    email: localStorage.getItem('email') || '',
                    enrollment: localStorage.getItem('enrollment') || '',
                });
            }
        }
    }, [router]);

    const handleLogout = () => {
        localStorage.clear();
        router.push('/');
    };

    const navItems = [
        { icon: LayoutDashboard, label: 'Overview', href: '/dashboard' },
        { icon: FileText, label: 'My Feedback', href: '/dashboard/feedback' },
    ];

    return (
        <div className="min-h-screen bg-gray-50 flex">
            {/* Sidebar */}
            <aside
                className={cn(
                    "fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transform transition-transform duration-200 ease-in-out lg:relative lg:translate-x-0",
                    !isSidebarOpen && "-translate-x-full lg:hidden" // Simple mobile toggle logic
                )}
            >
                <div className="h-16 flex items-center justify-between px-6 border-b border-gray-100">
                    <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                        Feedback Sys
                    </span>
                    <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden text-gray-500">
                        <X size={20} />
                    </button>
                </div>

                <div className="p-4 space-y-1">
                    {navItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                                pathname === item.href
                                    ? "bg-blue-50 text-blue-700"
                                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                            )}
                        >
                            <item.icon size={18} />
                            {item.label}
                        </Link>
                    ))}
                </div>

                <div className="absolute bottom-0 w-full p-4 border-t border-gray-100">
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 px-3 py-2 w-full text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                        <LogOut size={18} />
                        Sign Out
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">

                {/* Top Header */}
                <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 lg:px-8">
                    <div className="flex items-center gap-4">
                        <button title="Toggle Sidebar" onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg lg:hidden">
                            <Menu size={20} />
                        </button>
                        <h1 className="text-lg font-semibold text-gray-800">
                            {navItems.find(i => i.href === pathname)?.label || 'Dashboard'}
                        </h1>
                    </div>

                    <div className="flex items-center gap-4">
                        <Popover>
                            <PopoverTrigger asChild>
                                <button className="h-9 w-9 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-sm hover:bg-blue-200 transition-colors">
                                    {user?.name?.[0] || 'U'}
                                </button>
                            </PopoverTrigger>
                            <PopoverContent align="end" className="w-64 p-4 space-y-4">
                                <div className="space-y-1">
                                    <p className="text-sm font-bold text-gray-900">{user?.name}</p>
                                    <p className="text-xs text-gray-500">{user?.email}</p>
                                    <p className="text-[10px] font-medium text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full inline-block">
                                        ID: {user?.enrollment}
                                    </p>
                                </div>
                                <div className="pt-2 border-t border-gray-100">
                                    <button
                                        onClick={handleLogout}
                                        className="flex items-center gap-2 text-sm font-medium text-red-600 hover:text-red-700 transition-colors w-full"
                                    >
                                        <LogOut size={16} />
                                        Log Out
                                    </button>
                                </div>
                            </PopoverContent>
                        </Popover>
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 overflow-y-auto p-4 lg:p-8">
                    {children}
                </main>
            </div>

            {/* Mobile Overlay */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/20 z-40 lg:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}
        </div>
    );
}
