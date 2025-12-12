'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { loginAction } from '@/lib/actions/auth'; // We will use this via useServerMutation
import { loginSchema, type LoginValues } from '@/lib/schemas/auth';
import { useServerMutation } from '@/lib/hooks/use-server-query';
import { Loader2 } from 'lucide-react';
import Link from 'next/link';

export function LoginForm() {
    const router = useRouter();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginValues>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            username: '',
            password: '',
        },
    });

    const mutation = useServerMutation({
        mutationFn: loginAction,
        successMessage: 'Login berhasil!',
        onSuccess: () => {
            router.push('/');
        },
    });

    const onSubmit = (data: LoginValues) => {
        mutation.mutate(data);
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="username" className="text-white">Username</Label>
                <Input
                    id="username"
                    type="text"
                    placeholder="Masukkan username"
                    {...register('username')}
                    className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                />
                {errors.username && (
                    <p className="text-red-400 text-sm">{errors.username.message}</p>
                )}
            </div>
            <div className="space-y-2">
                <Label htmlFor="password" className="text-white">Password</Label>
                <Input
                    id="password"
                    type="password"
                    placeholder="Masukkan password"
                    {...register('password')}
                    className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                />
                {errors.password && (
                    <p className="text-red-400 text-sm">{errors.password.message}</p>
                )}
            </div>

            <div className="flex items-center justify-between">
                <Link
                    href="/auth/forgot-password"
                    className="text-sm text-gray-200 hover:text-white transition-colors"
                >
                    Lupa password?
                </Link>
            </div>

            <Button
                type="submit"
                className="w-full bg-white text-purple-600 hover:bg-gray-100 font-semibold"
                disabled={mutation.isPending}
            >
                {mutation.isPending ? (
                    <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Memproses...
                    </>
                ) : (
                    'Masuk'
                )}
            </Button>

            <div className="text-center text-sm text-gray-200">
                Belum punya akun?{' '}
                <Link href="/auth/register" className="text-white font-semibold hover:underline">
                    Daftar disini
                </Link>
            </div>
        </form>
    );
}
