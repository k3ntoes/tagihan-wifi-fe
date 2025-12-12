'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useUser } from '@/lib/providers/session-provider';
import {
    LayoutDashboard,
    Package,
    Users,
    Receipt,
    BarChart3,
    Wifi,
} from 'lucide-react';

const menuItems = [
    {
        title: 'Dashboard',
        href: '/dashboard',
        icon: LayoutDashboard,
        roles: ['ADMIN', 'USER'],
    },
    {
        title: 'Paket WiFi',
        href: '/paket',
        icon: Package,
        roles: ['ADMIN'],
    },
    {
        title: 'Pelanggan',
        href: '/pelanggan',
        icon: Users,
        roles: ['ADMIN'],
    },
    {
        title: 'Tagihan',
        href: '/tagihan',
        icon: Receipt,
        roles: ['ADMIN', 'USER'],
    },
    {
        title: 'Laporan',
        href: '/tagihan/summary',
        icon: BarChart3,
        roles: ['ADMIN', 'USER'],
    },
];

export function Sidebar() {
    const pathname = usePathname();
    const { user } = useUser();

    const filteredMenuItems = menuItems.filter((item) =>
        item.roles.includes(user?.role || '')
    );

    return (
        <div className="flex h-full w-64 flex-col fixed left-0 top-0 bg-slate-900/95 backdrop-blur-xl border-r border-slate-700/50 shadow-2xl">
            {/* Logo */}
            <div className="flex h-16 items-center border-b border-slate-700/50 px-6 bg-slate-800/50">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg gradient-primary flex items-center justify-center shadow-lg">
                        <Wifi className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold text-white">Tagihan WiFi</h1>
                        <p className="text-xs text-slate-400">Sistem Manajemen</p>
                    </div>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 space-y-1 px-3 py-4 overflow-y-auto">
                {filteredMenuItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href || pathname?.startsWith(`${item.href}/`);

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all',
                                'hover:bg-slate-700/50 hover:shadow-md',
                                isActive
                                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-500/30'
                                    : 'text-slate-300 hover:text-white'
                            )}
                        >
                            <Icon className="h-5 w-5" />
                            {item.title}
                        </Link>
                    );
                })}
            </nav>

            {/* User Info */}
            {user && (
                <div className="border-t border-slate-700/50 p-4 bg-slate-800/50">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full gradient-secondary flex items-center justify-center text-white font-semibold shadow-lg">
                            {user.username.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-white truncate">{user.username}</p>
                            <p className="text-xs text-slate-400">{user.role}</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
