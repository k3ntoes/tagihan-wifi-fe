"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
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
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { useTagihan } from "@/lib/hooks/tagihan-hook";
import { createUuid, formatRupiah, MONTHS } from "@/lib/utils";
import type { Tagihan } from "@/types/tagihan.types";
import { Edit, Loader2, Plus, Search, Trash2 } from "lucide-react";
import Link from "next/link";
import { memo, Suspense, useCallback, useMemo, useState } from "react";

// Optimasi: Error Boundary Component
const ErrorDisplay = memo(({ error }: { error: Error }) => (
	<Alert variant="destructive" className="mb-4">
		<AlertDescription>Error loading data: {error.message}</AlertDescription>
	</Alert>
));
ErrorDisplay.displayName = "ErrorDisplay";

// Optimasi: Search dengan loading indicator
const SearchInput = memo(
	({
		search,
		handleSearchChange,
		isLoading,
	}: {
		search: string;
		handleSearchChange: (value: string) => void;
		isLoading?: boolean;
	}) => {
		const [localValue, setLocalValue] = useState(search);

		const handleChange = useCallback(
			(e: React.ChangeEvent<HTMLInputElement>) => {
				const value = e.target.value;
				setLocalValue(value);
				handleSearchChange(value);
			},
			[handleSearchChange],
		);

		return (
			<div className="relative flex-1">
				<Search
					className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4"
					aria-hidden="true"
				/>
				<Input
					placeholder="Cari pelanggan atau paket..."
					value={localValue}
					onChange={handleChange}
					className="pl-10 bg-slate-800/50 border-slate-700/50 text-white placeholder:text-slate-400"
					aria-label="Cari tagihan"
					disabled={isLoading}
				/>
				{isLoading && (
					<Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 animate-spin text-slate-400" />
				)}
			</div>
		);
	},
);
SearchInput.displayName = "SearchInput";

// Optimasi: Filter components dengan disabled state
const MonthSelect = memo(
	({
		selectedMonth,
		updateFilter,
		disabled,
	}: {
		selectedMonth: string;
		updateFilter: (key: string, value: string) => void;
		disabled?: boolean;
	}) => {
		const handleValueChange = useCallback(
			(val: string) => {
				if (!disabled) {
					updateFilter("bulan", val);
				}
			},
			[updateFilter, disabled],
		);

		return (
			<Select
				value={selectedMonth}
				onValueChange={handleValueChange}
				disabled={disabled}
			>
				<SelectTrigger className="w-[120px] bg-slate-800/50 border-slate-700/50 text-white">
					<SelectValue placeholder="Bulan" />
				</SelectTrigger>
				<SelectContent className="bg-slate-800 text-slate-300 border-slate-700">
					{MONTHS.map((m) => (
						<SelectItem key={m.value} value={m.value}>
							{m.label}
						</SelectItem>
					))}
				</SelectContent>
			</Select>
		);
	},
);
MonthSelect.displayName = "MonthSelect";

const YearSelect = memo(
	({
		selectedYear,
		updateFilter,
		years,
		disabled,
	}: {
		selectedYear: string;
		updateFilter: (key: string, value: string) => void;
		years: string[];
		disabled?: boolean;
	}) => {
		const handleValueChange = useCallback(
			(val: string) => {
				if (!disabled) {
					updateFilter("tahun", val);
				}
			},
			[updateFilter, disabled],
		);

		return (
			<Select
				value={selectedYear}
				onValueChange={handleValueChange}
				disabled={disabled}
			>
				<SelectTrigger className="w-[100px] bg-slate-800/50 border-slate-700/50 text-white">
					<SelectValue placeholder="Tahun" />
				</SelectTrigger>
				<SelectContent className="bg-slate-800 text-slate-300 border-slate-700">
					{years.map((y) => (
						<SelectItem key={y} value={y}>
							{y}
						</SelectItem>
					))}
				</SelectContent>
			</Select>
		);
	},
);
YearSelect.displayName = "YearSelect";

const CreateButton = memo(
	({ isAdmin, disabled }: { isAdmin: boolean; disabled?: boolean }) => {
		if (!isAdmin) return null;

		return (
			<Link href="/tagihan/new" prefetch={true}>
				<Button
					className="gradient-primary text-white hover:opacity-90 transition-opacity"
					disabled={disabled}
				>
					<Plus className="mr-2 h-4 w-4" />
					Buat Tagihan
				</Button>
			</Link>
		);
	},
);
CreateButton.displayName = "CreateButton";

const TagihanFilter = memo(() => {
	const {
		updateFilter,
		selectedMonth,
		selectedYear,
		search,
		handleSearchChange,
		years,
		isAdmin,
		isLoading,
		isPending,
	} = useTagihan();

	const isDisabled = isLoading || isPending;

	return (
		<div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
			<SearchInput
				search={search}
				handleSearchChange={handleSearchChange}
				isLoading={isLoading}
			/>

			<div className="flex gap-2">
				<MonthSelect
					selectedMonth={selectedMonth}
					updateFilter={updateFilter}
					disabled={isDisabled}
				/>
				<YearSelect
					selectedYear={selectedYear}
					updateFilter={updateFilter}
					years={years}
					disabled={isDisabled}
				/>
				<CreateButton isAdmin={isAdmin} disabled={isDisabled} />
			</div>
		</div>
	);
});
TagihanFilter.displayName = "TagihanFilter";

// Optimasi: Virtualisasi untuk tabel besar (opsional)
const StatusCell = memo(({ tagihan }: { tagihan: Tagihan }) => {
	const statusText = useMemo(() => {
		return tagihan.tanggal_bayar
			? `Lunas (${tagihan.tanggal_bayar})`
			: "Belum Bayar";
	}, [tagihan.tanggal_bayar]);

	const statusColor = useMemo(() => {
		return tagihan.tanggal_bayar ? "text-green-400" : "text-red-400";
	}, [tagihan.tanggal_bayar]);

	return (
		<TableCell className="text-slate-300">
			<span className={statusColor}>{statusText}</span>
		</TableCell>
	);
});
StatusCell.displayName = "StatusCell";

const MonthCell = memo(({ bulan, tahun }: { bulan: number; tahun: number }) => {
	const monthLabel = useMemo(() => {
		return MONTHS.find((m) => m.value === bulan.toString())?.label || "";
	}, [bulan]);

	return (
		<TableCell className="text-slate-300">
			{monthLabel} {tahun}
		</TableCell>
	);
});
MonthCell.displayName = "MonthCell";

const AdminActions = memo(
	({
		tagihan,
		setDeleteId,
		disabled,
	}: {
		tagihan: Tagihan;
		setDeleteId: (id: string) => void;
		disabled?: boolean;
	}) => {
		const handleDelete = useCallback(() => {
			if (!disabled) {
				setDeleteId(tagihan.id);
			}
		}, [tagihan.id, setDeleteId, disabled]);

		return (
			<TableCell className="text-right">
				<div className="flex justify-end gap-2">
					<Link
						href={`/tagihan/${tagihan.id}`}
						prefetch={false}
						aria-disabled={disabled}
					>
						<Button
							variant="ghost"
							size="icon"
							className="cursor-pointer text-green-400 hover:text-green-300 hover:bg-slate-700/50"
							aria-label={`Edit tagihan ${tagihan.pelanggan.nama}`}
							disabled={disabled}
						>
							<Edit className="h-4 w-4" />
						</Button>
					</Link>
					<Button
						variant="ghost"
						size="icon"
						className="cursor-pointer text-red-400 hover:text-red-300 hover:bg-slate-700/50"
						onClick={handleDelete}
						aria-label={`Hapus tagihan ${tagihan.pelanggan.nama}`}
						disabled={disabled}
					>
						<Trash2 className="h-4 w-4" />
					</Button>
				</div>
			</TableCell>
		);
	},
);
AdminActions.displayName = "AdminActions";

const TableRowBuilder = memo(() => {
	const { tagihans, isAdmin, setDeleteId, isPending } = useTagihan();

	return (
		<>
			{tagihans.map((tagihan) => (
				<TableRow
					key={`${tagihan.id}-${tagihan.updated_at || ""}`}
					className="border-slate-700/50 hover:bg-slate-800/50 transition-colors"
				>
					<TableCell className="font-medium text-white">
						{tagihan.pelanggan.nama}
					</TableCell>
					<TableCell className="text-slate-300">{tagihan.paket.nama}</TableCell>
					<MonthCell bulan={tagihan.bulan} tahun={tagihan.tahun} />
					<TableCell className="text-slate-300">
						{formatRupiah(tagihan.paket.harga)}
					</TableCell>
					<StatusCell tagihan={tagihan} />
					{isAdmin && (
						<AdminActions
							tagihan={tagihan}
							setDeleteId={setDeleteId}
							disabled={isPending}
						/>
					)}
				</TableRow>
			))}
		</>
	);
});
TableRowBuilder.displayName = "TableRowBuilder";

const DeleteDialog = memo(() => {
	const { deleteId, handleDialogClose, handleDeleteConfirm, deleteMutation } =
		useTagihan();

	if (!deleteId) return null;

	return (
		<AlertDialog open={!!deleteId} onOpenChange={handleDialogClose}>
			<AlertDialogContent className="glass-card border-slate-700/50">
				<AlertDialogHeader>
					<AlertDialogTitle className="text-white">
						Hapus Tagihan?
					</AlertDialogTitle>
					<AlertDialogDescription className="text-slate-300">
						Apakah Anda yakin ingin menghapus tagihan ini? Tindakan ini tidak
						dapat dibatalkan.
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel
						className="bg-slate-800/50 border-slate-700/50 text-white hover:bg-slate-700/50"
						disabled={deleteMutation.isPending}
					>
						Batal
					</AlertDialogCancel>
					<AlertDialogAction
						onClick={handleDeleteConfirm}
						disabled={deleteMutation.isPending}
						className="bg-red-500 text-white hover:bg-red-600 disabled:opacity-50"
					>
						{deleteMutation.isPending ? (
							<>
								<Loader2 className="mr-2 h-4 w-4 animate-spin" />
								Menghapus...
							</>
						) : (
							"Hapus"
						)}
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
});
DeleteDialog.displayName = "DeleteDialog";

const TableSkeleton = memo(() => (
	<div className="space-y-3">
		{[...Array(5)].map((_) => (
			<div key={createUuid()} className="flex items-center space-x-4">
				<Skeleton className="h-12 w-full bg-slate-800/50" />
			</div>
		))}
	</div>
));
TableSkeleton.displayName = "TableSkeleton";

const TagihanListContent = memo(() => {
	const { isAdmin, isLoading, data, isError, error, hasData, isFetching } =
		useTagihan();

	if (isError) {
		return <ErrorDisplay error={error as Error} />;
	}

	if (isLoading && !data) {
		return <TableSkeleton />;
	}

	if (!hasData) {
		return (
			<div className="text-center py-12">
				<p className="text-slate-400">Tidak ada data tagihan</p>
			</div>
		);
	}

	return (
		<>
			<div className="rounded-lg border border-slate-700/50 overflow-hidden relative">
				{isFetching && (
					<div className="absolute inset-0 bg-slate-900/20 backdrop-blur-[1px] flex justify-center items-center z-10">
						<Loader2 className="h-6 w-6 animate-spin text-white" />
					</div>
				)}
				<Table>
					<TableHeader>
						<TableRow className="border-slate-700/50 hover:bg-slate-800/50">
							<TableHead className="text-slate-300">Pelanggan</TableHead>
							<TableHead className="text-slate-300">Paket</TableHead>
							<TableHead className="text-slate-300">Periode</TableHead>
							<TableHead className="text-slate-300">Nominal</TableHead>
							<TableHead className="text-slate-300">Status</TableHead>
							{isAdmin && (
								<TableHead className="text-slate-300 text-right">
									Aksi
								</TableHead>
							)}
						</TableRow>
					</TableHeader>
					<TableBody>
						<TableRowBuilder />
					</TableBody>
				</Table>
			</div>

			{data && data.total_elements > 1 && (
				<div className="mt-4">
					<PaginationBuilder data={data} />
				</div>
			)}
		</>
	);
});
TagihanListContent.displayName = "TagihanListContent";

const TagihanListClient = () => {
	return (
		<>
			<TagihanFilter />
			<Suspense fallback={<TableSkeleton />}>
				<TagihanListContent />
			</Suspense>
			<DeleteDialog />
		</>
	);
};

export default memo(TagihanListClient);

// const router = useRouter();
// const pathname = usePathname();
// const searchParams = useSearchParams();

// Default Filters
// const currentYear = new Date().getFullYear().toString();
// const currentMonth = (new Date().getMonth() + 1).toString();

// const selectedYear = searchParams.get("tahun") || currentYear;
// const selectedMonth = searchParams.get("bulan") || currentMonth;

// const { search, onSearchChange, queryString } = usePagination({
// 	searchParamName: "search",
// });

// // Handle filter changes
// const updateFilter = useCallback(
// 	(key: string, value: string) => {
// 		const params = new URLSearchParams(searchParams.toString());
// 		params.set(key, value);
// 		params.set("page", "1"); // Reset pagination
// 		router.replace(`${pathname}?${params.toString()}`);
// 	},
// 	[pathname, router, searchParams],
// );

// // Ensure default filters are in URL if missing
// useEffect(() => {
// 	const params = new URLSearchParams(searchParams.toString());
// 	let updated = false;
// 	if (!params.has("tahun")) {
// 		params.set("tahun", currentYear);
// 		updated = true;
// 	}
// 	if (!params.has("bulan")) {
// 		params.set("bulan", currentMonth);
// 		updated = true;
// 	}
// 	if (updated) {
// 		router.replace(`${pathname}?${params.toString()}`);
// 	}
// }, [currentYear, currentMonth, pathname, router, searchParams]);

// // Reset store on unmount
// useEffect(() => {
// 	return () => reset();
// }, [reset]);

// // Query data
// const { data, isLoading } = useServerList({
// 	queryKey: ["tagihans", queryString],
// 	queryFn: () => getTagihans(queryString),
// 	enabled: !!selectedYear && !!selectedMonth, // Only fetch if filters are present
// });

// const deleteMutation = useServerMutation({
// 	mutationFn: deleteTagihan,
// 	invalidateKeys: [["tagihans"]],
// 	successMessage: "Tagihan berhasil dihapus",
// 	onSuccess: () => setDeleteId(null),
// });

// const handleSearchChange = useDebouncedCallback((value: string) => {
// 	onSearchChange(value);
// }, 500);

// const handleDeleteConfirm = useCallback(() => {
// 	if (deleteId) {
// 		deleteMutation.mutate(deleteId);
// 	}
// }, [deleteId, deleteMutation]);

// const handleDialogClose = useCallback(
// 	(open: boolean) => {
// 		if (!open) {
// 			setDeleteId(null);
// 		}
// 	},
// 	[setDeleteId],
// );

// const tagihans = useMemo(() => data?.content || [], [data?.content]);

// // Generate years for select (e.g. current year - 2 to current year + 1)
// const years = useMemo(() => {
// 	const curr = new Date().getFullYear();
// 	return Array.from({ length: 4 }, (_, i) => (curr - 2 + i).toString());
// }, []);
