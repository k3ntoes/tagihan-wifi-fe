import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart3 } from 'lucide-react';

export default function TagihanSummaryPage() {
    return (
        <div className="space-y-6">
            <Card className="glass-card border-slate-700/50 animate-slide-up">
                <CardHeader className="text-center">
                    <div className="mx-auto w-16 h-16 rounded-full gradient-primary flex items-center justify-center mb-4">
                        <BarChart3 className="h-8 w-8 text-white" />
                    </div>
                    <CardTitle className="text-2xl text-white">Laporan & Summary</CardTitle>
                    <CardDescription className="text-slate-300">
                        Halaman ini akan menampilkan summary dan chart pendapatan
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="p-8 text-center">
                        <p className="text-slate-400 mb-4">
                            Fitur yang tersedia:
                        </p>
                        <ul className="text-slate-300 space-y-2">
                            <li>✓ Filter per tahun</li>
                            <li>✓ Tabel summary per bulan</li>
                            <li>✓ Chart pendapatan bulanan (menggunakan Recharts)</li>
                            <li>✓ Total pendapatan tahunan</li>
                        </ul>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
