'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { paketFormSchema, type PaketFormValues } from '@/lib/schemas/paket';
import { useServerMutation } from '@/lib/hooks/use-server-query';
import { createPaket, updatePaket } from '@/lib/actions/paket';
import { Loader2, Save } from 'lucide-react';
import Link from 'next/link';

interface PaketFormProps {
    initialData?: PaketFormValues;
    paketId?: string;
    mode: 'create' | 'edit';
}

export function PaketForm({ initialData, paketId, mode }: PaketFormProps) {
    const router = useRouter();

    const form = useForm<PaketFormValues>({
        resolver: zodResolver(paketFormSchema),
        defaultValues: initialData || {
            nama: '',
            kecepatan: '',
            harga: 0,
        },
    });

    // Using generic mutation hook
    const mutation = useServerMutation({
        mutationFn: async (data: PaketFormValues) => {
            if (mode === 'create') {
                return createPaket(data);
            } else if (paketId) {
                return updatePaket(paketId, data);
            }
            throw new Error('Invalid operation');
        },
        invalidateKeys: [['pakets']],
        successMessage: `Paket berhasil ${mode === 'create' ? 'ditambahkan' : 'diperbarui'}`,
        onSuccess: () => {
            router.push('/paket');
        },
    });

    const onSubmit = (data: PaketFormValues) => {
        mutation.mutate(data);
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                    control={form.control}
                    name="nama"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="text-white">Nama Paket</FormLabel>
                            <FormControl>
                                <Input
                                    placeholder="Contoh: Paket Premium"
                                    {...field}
                                    className="bg-slate-800/50 border-slate-700/50 text-white placeholder:text-slate-400 focus:border-blue-500"
                                />
                            </FormControl>
                            <FormDescription className="text-slate-400">
                                Nama paket WiFi yang akan ditampilkan kepada pelanggan
                            </FormDescription>
                            <FormMessage className="text-red-400" />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="kecepatan"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="text-white">Kecepatan</FormLabel>
                            <FormControl>
                                <Input
                                    placeholder="Contoh: 100 Mbps"
                                    {...field}
                                    className="bg-slate-800/50 border-slate-700/50 text-white placeholder:text-slate-400 focus:border-blue-500"
                                />
                            </FormControl>
                            <FormDescription className="text-slate-400">
                                Kecepatan internet yang ditawarkan (misal: 100 Mbps, 50 Mbps)
                            </FormDescription>
                            <FormMessage className="text-red-400" />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="harga"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="text-white">Harga (Rp)</FormLabel>
                            <FormControl>
                                <Input
                                    type="number"
                                    placeholder="Contoh: 300000"
                                    {...field}
                                    onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                                    className="bg-slate-800/50 border-slate-700/50 text-white placeholder:text-slate-400 focus:border-blue-500"
                                />
                            </FormControl>
                            <FormDescription className="text-slate-400">
                                Harga paket per bulan dalam Rupiah
                            </FormDescription>
                            <FormMessage className="text-red-400" />
                        </FormItem>
                    )}
                />

                <div className="flex gap-3 pt-4">
                    <Button
                        type="submit"
                        disabled={mutation.isPending}
                        className="flex-1 gradient-primary text-white hover:opacity-90"
                    >
                        {mutation.isPending ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Menyimpan...
                            </>
                        ) : (
                            <>
                                <Save className="mr-2 h-4 w-4" />
                                {mode === 'create' ? 'Simpan Paket' : 'Perbarui Paket'}
                            </>
                        )}
                    </Button>
                    <Link href="/paket" className="flex-1">
                        <Button
                            type="button"
                            variant="outline"
                            className="w-full bg-slate-800/50 border-slate-700/50 text-white hover:bg-slate-700/50"
                        >
                            Batal
                        </Button>
                    </Link>
                </div>
            </form>
        </Form>
    );
}
