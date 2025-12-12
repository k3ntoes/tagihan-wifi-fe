import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PaketForm } from '@/components/forms/paket-form';
import { ArrowLeft } from 'lucide-react';

export default function NewPaketPage() {
    return (
        <div className="max-w-2xl">
            <div className="mb-6">
                <Link href="/paket">
                    <Button variant="ghost" className="text-slate-300 hover:text-white hover:bg-slate-700/50">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Kembali
                    </Button>
                </Link>
            </div>

            <Card className="glass-card border-slate-700/50">
                <CardHeader>
                    <CardTitle className="text-2xl text-white">Tambah Paket WiFi</CardTitle>
                    <CardDescription className="text-slate-300">
                        Buat paket WiFi baru dengan mengisi form di bawah ini
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <PaketForm mode="create" />
                </CardContent>
            </Card>
        </div>
    );
}
