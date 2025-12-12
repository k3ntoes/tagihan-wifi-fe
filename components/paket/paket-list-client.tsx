'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useServerList, useServerMutation } from '@/lib/hooks/use-server-query';
import { getPakets, deletePaket } from '@/lib/actions/paket';
import type { Paket } from '@/types/paket.types';
import type { PaginationResponse } from '@/types/api.types';
import { Search, Edit, Trash2, Loader2 } from 'lucide-react';

interface PaketListClientProps {
    initialData: PaginationResponse<Paket>;
}

export function PaketListClient({ initialData }: PaketListClientProps) {
    const [searchQuery, setSearchQuery] = useState('');
    const [deleteId, setDeleteId] = useState<string | null>(null);

    const { data, isLoading } = useServerList({
        queryKey: ['pakets', searchQuery],
        queryFn: () => getPakets(),
        initialData,
    });

    const deleteMutation = useServerMutation({
        mutationFn: deletePaket,
        invalidateKeys: [['pakets']],
        successMessage: 'Paket berhasil dihapus',
        onSuccess: () => setDeleteId(null),
    });

    const formatRupiah = (amount: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(amount);
    };

    const pakets = data?.content || [];

    return (
        <>
            {/* Search */}
            <div className="mb-6">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                    <Input
                        placeholder="Cari paket..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 bg-slate-800/50 border-slate-700/50 text-white placeholder:text-slate-400"
                    />
                </div>
            </div>

            {/* Table */}
            {isLoading ? (
                <div className="flex justify-center items-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-white" />
                </div>
            ) : pakets.length > 0 ? (
                <>
                    <div className="rounded-lg border border-slate-700/50 overflow-hidden">
                        <Table>
                            <TableHeader>
                                <TableRow className="border-slate-700/50 hover:bg-slate-800/50">
                                    <TableHead className="text-slate-300">Nama Paket</TableHead>
                                    <TableHead className="text-slate-300">Kecepatan</TableHead>
                                    <TableHead className="text-slate-300">Harga</TableHead>
                                    <TableHead className="text-slate-300 text-right">Aksi</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {pakets.map((paket) => (
                                    <TableRow key={paket.id} className="border-slate-700/50 hover:bg-slate-800/50">
                                        <TableCell className="font-medium text-white">{paket.nama}</TableCell>
                                        <TableCell className="text-slate-300">{paket.kecepatan}</TableCell>
                                        <TableCell className="text-slate-300">{formatRupiah(paket.harga)}</TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-2">
                                                <Link href={`/paket/${paket.id}`}>
                                                    <Button variant="ghost" size="icon" className="text-green-400 hover:text-green-300 hover:bg-slate-700/50">
                                                        <Edit className="h-4 w-4" />
                                                    </Button>
                                                </Link>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="text-red-400 hover:text-red-300 hover:bg-slate-700/50"
                                                    onClick={() => setDeleteId(paket.id)}
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>

                    {/* Pagination Info */}
                    {data && (
                        <div className="flex items-center justify-between mt-4">
                            <p className="text-sm text-slate-300">
                                Menampilkan {data.number_of_elements} dari {data.total_elements} paket
                            </p>
                        </div>
                    )}
                </>
            ) : (
                <div className="text-center py-12">
                    <p className="text-slate-400">Tidak ada data paket</p>
                </div>
            )}

            {/* Delete Confirmation Dialog */}
            <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
                <AlertDialogContent className="glass-card border-slate-700/50">
                    <AlertDialogHeader>
                        <AlertDialogTitle className="text-white">Hapus Paket?</AlertDialogTitle>
                        <AlertDialogDescription className="text-slate-300">
                            Apakah Anda yakin ingin menghapus paket ini? Tindakan ini tidak dapat dibatalkan.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel className="bg-slate-800/50 border-slate-700/50 text-white hover:bg-slate-700/50">
                            Batal
                        </AlertDialogCancel>
                        <AlertDialogAction
                            onClick={() => deleteId && deleteMutation.mutate(deleteId)}
                            disabled={deleteMutation.isPending}
                            className="bg-red-500 text-white hover:bg-red-600"
                        >
                            {deleteMutation.isPending ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Menghapus...
                                </>
                            ) : (
                                'Hapus'
                            )}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}
