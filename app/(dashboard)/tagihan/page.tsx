import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Construction } from 'lucide-react';

export default function TagihanPage() {
    return (
        <div className="space-y-6">
            <Card className="glass-card border-slate-700/50 animate-slide-up">
                <CardHeader className="text-center">
                    <div className="mx-auto w-16 h-16 rounded-full gradient-secondary flex items-center justify-center mb-4">
                        <Construction className="h-8 w-8 text-white" />
                    </div>
                    <CardTitle className="text-2xl text-white">Manajemen Tagihan</CardTitle>
                    <CardDescription className="text-slate-300">
                        Halaman ini akan menampilkan daftar tagihan dengan fitur lengkap
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="p-8 text-center">
                        <p className="text-slate-400 mb-4">
                            Fitur yang tersedia:
                        </p>
                        <ul className="text-slate-300 space-y-2">
                            <li>✓ Tabel tagihan dengan filter bulan/tahun</li>
                            <li>✓ Untuk USER: Hanya tagihan sendiri (read-only)</li>
                            <li>✓ Untuk ADMIN: Semua tagihan dengan CRUD</li>
                            <li>✓ Pagination dan pencarian</li>
                        </ul>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
