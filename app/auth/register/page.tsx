import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { UserPlus } from 'lucide-react';
import { RegisterForm } from './register-form';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Daftar - Tagihan WiFi',
    description: 'Buat akun baru untuk mengakses sistem',
};

export default function RegisterPage() {
    return (
        <div className="min-h-screen flex items-center justify-center p-4 gradient-primary">
            <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:60px_60px]" />

            <Card className="w-full max-w-md glass-card border-white/20 animate-scale-in relative z-10">
                <CardHeader className="space-y-3 text-center">
                    <div className="mx-auto w-16 h-16 rounded-full gradient-success flex items-center justify-center mb-2">
                        <UserPlus className="w-8 h-8 text-white" />
                    </div>
                    <CardTitle className="text-3xl font-bold text-white">Daftar Akun</CardTitle>
                    <CardDescription className="text-gray-200">
                        Buat akun baru untuk mengakses sistem
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <RegisterForm />
                </CardContent>
            </Card>
        </div>
    );
}
