'use client';

import { Sidebar } from '@/components/sidebar';
import { Header } from '@/components/header';

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex h-screen bg-slate-950">
            <Sidebar />
            <div className="flex-1 flex flex-col ml-64">
                <Header />
                <main className="flex-1 overflow-y-auto p-6 mt-16 bg-slate-950">
                    <div className="max-w-7xl mx-auto space-y-6">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}
