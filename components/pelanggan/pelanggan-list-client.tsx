"use client";

import { Edit, Loader2, Search, Trash2 } from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useMemo } from "react";
import { useDebouncedCallback } from "use-debounce";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PaginationBuilder } from "@/components/ui/pagination-builder";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { deletePelanggan, getPelanggans } from "@/lib/actions/pelanggan";
import { usePagination } from "@/lib/hooks/use-pagination";
import { useServerList, useServerMutation } from "@/lib/hooks/use-server-query";
import { usePelangganStore } from "@/store/use-pelanggan-store";

export function PelangganListClient() {
	const { deleteId, setDeleteId, reset } = usePelangganStore();

	const { search, onSearchChange, queryString } = usePagination({
		searchParamName: "search",
		defaultSize: 10,
	});

	// Reset store on unmount
	useEffect(() => {
		return () => reset();
	}, [reset]);

	// Query data
	const { data, isLoading } = useServerList({
		queryKey: ["pelanggans", queryString],
		queryFn: () => getPelanggans(queryString),
	});

	const deleteMutation = useServerMutation({
		mutationFn: deletePelanggan,
		invalidateKeys: [["pelanggans"]],
		successMessage: "Pelanggan berhasil dihapus",
		onSuccess: () => setDeleteId(null),
	});

	// Handler untuk pencarian
	const handleSearchChange = useDebouncedCallback((value: string) => {
		onSearchChange(value);
	}, 500);

	// Handler untuk delete confirmation
	const handleDeleteConfirm = useCallback(() => {
		if (deleteId) {
			deleteMutation.mutate(deleteId);
		}
	}, [deleteId, deleteMutation]);

	// Handler untuk dialog close
	const handleDialogClose = useCallback(
		(open: boolean) => {
			if (!open) {
				setDeleteId(null);
			}
		},
		[setDeleteId],
	);

	const pelanggans = useMemo(() => data?.content || [], [data?.content]);

	// Render rows
	const renderTableRows = useMemo(
		() =>
			pelanggans.map((pelanggan) => (
				<TableRow
					key={pelanggan.id}
					className="border-slate-700/50 hover:bg-slate-800/50"
				>
					<TableCell className="font-medium text-white">
						{pelanggan.nama}
					</TableCell>
					<TableCell className="text-slate-300">{pelanggan.alamat}</TableCell>
					<TableCell className="text-slate-300">{pelanggan.no_hp}</TableCell>
					<TableCell className="text-slate-300">
						{pelanggan.paket?.nama || "-"}
					</TableCell>
					<TableCell className="text-right">
						<div className="flex justify-end gap-2">
							<Link href={`/pelanggan/${pelanggan.id}`}>
								<Button
									variant="ghost"
									size="icon"
									className="cursor-pointer text-green-400 hover:text-green-300 hover:bg-slate-700/50"
									aria-label={`Edit pelanggan ${pelanggan.nama}`}
								>
									<Edit className="h-4 w-4" />
								</Button>
							</Link>
							<Button
								variant="ghost"
								size="icon"
								className="cursor-pointer text-red-400 hover:text-red-300 hover:bg-slate-700/50"
								onClick={() => setDeleteId(pelanggan.id)}
								aria-label={`Hapus pelanggan ${pelanggan.nama}`}
							>
								<Trash2 className="h-4 w-4" />
							</Button>
						</div>
					</TableCell>
				</TableRow>
			)),
		[pelanggans, setDeleteId],
	);

	return (
		<>
			{/* Search */}
			<div className="mb-6">
				<div className="relative">
					<Search
						className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4"
						aria-hidden="true"
					/>
					<Input
						placeholder="Cari pelanggan..."
						value={search}
						onChange={(e) => handleSearchChange(e.target.value)}
						className="pl-10 bg-slate-800/50 border-slate-700/50 text-white placeholder:text-slate-400"
						aria-label="Cari pelanggan"
					/>
				</div>
			</div>

			{/* Table */}
			{isLoading && !data ? (
				<div
					className="flex justify-center items-center py-12"
					aria-live="polite"
					aria-busy="true"
				>
					<Loader2
						className="h-8 w-8 animate-spin text-white"
						aria-hidden="true"
					/>
					<span className="sr-only">Memuat data...</span>
				</div>
			) : pelanggans.length > 0 ? (
				<>
					<div className="rounded-lg border border-slate-700/50 overflow-hidden relative">
						{isLoading && (
							<div className="absolute inset-0 bg-slate-900/20 backdrop-blur-[1px] flex justify-center items-center z-10">
								<Loader2 className="h-6 w-6 animate-spin text-white" />
							</div>
						)}
						<Table>
							<TableHeader>
								<TableRow className="border-slate-700/50 hover:bg-slate-800/50">
									<TableHead className="text-slate-300">Nama</TableHead>
									<TableHead className="text-slate-300">Alamat</TableHead>
									<TableHead className="text-slate-300">No. HP</TableHead>
									<TableHead className="text-slate-300">Paket</TableHead>
									<TableHead className="text-slate-300 text-right">
										Aksi
									</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>{renderTableRows}</TableBody>
						</Table>
					</div>

					{data && <PaginationBuilder data={data} />}
				</>
			) : (
				<div className="text-center py-12">
					<p className="text-slate-400">
						{search
							? "Tidak ada pelanggan yang sesuai dengan pencarian"
							: "Tidak ada data pelanggan"}
					</p>
				</div>
			)}

			{/* Delete Confirmation Dialog */}
			<AlertDialog open={!!deleteId} onOpenChange={handleDialogClose}>
				<AlertDialogContent className="glass-card border-slate-700/50">
					<AlertDialogHeader>
						<AlertDialogTitle className="text-white">
							Hapus Pelanggan?
						</AlertDialogTitle>
						<AlertDialogDescription className="text-slate-300">
							Apakah Anda yakin ingin menghapus pelanggan ini? Tindakan ini
							tidak dapat dibatalkan.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel className="bg-slate-800/50 border-slate-700/50 text-white hover:bg-slate-700/50">
							Batal
						</AlertDialogCancel>
						<AlertDialogAction
							onClick={handleDeleteConfirm}
							disabled={deleteMutation.isPending}
							className="bg-red-500 text-white hover:bg-red-600"
						>
							{deleteMutation.isPending ? (
								<>
									<Loader2
										className="mr-2 h-4 w-4 animate-spin"
										aria-hidden="true"
									/>
									Menghapus...
									<span className="sr-only">Sedang menghapus pelanggan</span>
								</>
							) : (
								"Hapus"
							)}
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</>
	);
}
