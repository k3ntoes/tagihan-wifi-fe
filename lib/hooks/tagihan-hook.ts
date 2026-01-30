import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useTransition } from "react";
import { useDebouncedCallback } from "use-debounce";
import { useTagihanStore } from "@/store/use-tagihan-store";
import { deleteTagihan, getTagihans } from "../actions/tagihan";
import { usePagination } from "../hooks/use-pagination";
import { useServerList, useServerMutation } from "../hooks/use-server-query";
import { useUser } from "../providers/session-provider";

// Optimasi: Buat constant untuk mengurangi recalculation
const CURRENT_YEAR = new Date().getFullYear().toString();
const CURRENT_MONTH = (new Date().getMonth() + 1).toString();

export const useTagihan = () => {
	const { user } = useUser();
	const isAdmin = user?.role === "ADMIN";

	// Gunakan useTransition untuk navigasi yang smooth
	const [isPending, startTransition] = useTransition();

	const { deleteId, setDeleteId, reset } = useTagihanStore();
	const router = useRouter();
	const pathname = usePathname();
	const searchParams = useSearchParams();

	// Optimasi: Gunakan useMemo untuk computed values
	const params = useMemo(() => {
		return {
			selectedYear: searchParams.get("tahun") || CURRENT_YEAR,
			selectedMonth: searchParams.get("bulan") || CURRENT_MONTH,
			search: searchParams.get("search") || "",
			page: searchParams.get("page") || "1",
		};
	}, [searchParams]);

	// Optimasi: Debounced search dengan cancel
	const { onSearchChange, queryString } = usePagination({
		searchParamName: "search",
	});

	// Optimasi: Handle filter changes dengan useTransition
	const updateFilter = useCallback(
		(key: string, value: string) => {
			startTransition(() => {
				const newParams = new URLSearchParams(searchParams.toString());

				if (value) {
					newParams.set(key, value);
				} else {
					newParams.delete(key);
				}

				// Reset pagination hanya jika filter utama berubah
				if (key === "tahun" || key === "bulan") {
					newParams.set("page", "1");
				}

				router.replace(`${pathname}?${newParams.toString()}`);
			});
		},
		[pathname, router, searchParams],
	);

	// Optimasi: Efek untuk default filters dengan dependency yang tepat
	useEffect(() => {
		const params = new URLSearchParams(searchParams.toString());
		let needsUpdate = false;

		if (!params.has("tahun")) {
			params.set("tahun", CURRENT_YEAR);
			needsUpdate = true;
		}
		if (!params.has("bulan")) {
			params.set("bulan", CURRENT_MONTH);
			needsUpdate = true;
		}

		if (needsUpdate) {
			// Gunakan push untuk initial load, replace untuk perubahan
			const isInitialLoad = searchParams.toString() === "";
			const method = isInitialLoad ? router.push : router.replace;

			startTransition(() => {
				method(`${pathname}?${params.toString()}`);
			});
		}
	}, [pathname, router, searchParams]);

	// Reset store on unmount
	useEffect(() => {
		return () => reset();
	}, [reset]);

	// Optimasi: Query data dengan enabled yang tepat
	const isFiltersValid = useMemo(() => {
		return !!params.selectedYear && !!params.selectedMonth;
	}, [params.selectedYear, params.selectedMonth]);

	const { data, isLoading, isFetching, isError, error } = useServerList({
		queryKey: ["tagihans", queryString],
		queryFn: () => getTagihans(queryString),
		enabled: isFiltersValid,
		staleTime: 5 * 60 * 1000, // 5 menit cache
		gcTime: 10 * 60 * 1000, // 10 menit garbage collection
		refetchOnWindowFocus: false,
		retry: 1,
	});

	const deleteMutation = useServerMutation({
		mutationFn: deleteTagihan,
		invalidateKeys: [["tagihans"]],
		successMessage: "Tagihan berhasil dihapus",
		onSuccess: () => setDeleteId(null),
		onError: (error) => {
			console.error("Delete error:", error);
			// Bisa tambahkan toast error di sini
		},
	});

	// Optimasi: Debounced search dengan cancel
	const handleSearchChange = useDebouncedCallback(
		(value: string) => {
			onSearchChange(value);
		},
		300,
		{ leading: false, trailing: true, maxWait: 1000 },
	);

	const handleDeleteConfirm = useCallback(() => {
		if (deleteId && !deleteMutation.isPending) {
			deleteMutation.mutate(deleteId);
		}
	}, [deleteId, deleteMutation]);

	const handleDialogClose = useCallback(
		(open: boolean) => {
			if (!open && !deleteMutation.isPending) {
				setDeleteId(null);
			}
		},
		[setDeleteId, deleteMutation.isPending],
	);

	// Optimasi: Gunakan data yang sudah tersedia
	const tagihans = useMemo(() => {
		if (!data) return [];

		// Jika ada filter search di client side, tambahkan di sini
		if (params.search && data.content) {
			const searchLower = params.search.toLowerCase();
			return data.content.filter(
				(tagihan) =>
					tagihan.pelanggan.nama.toLowerCase().includes(searchLower) ||
					tagihan.paket.nama.toLowerCase().includes(searchLower),
			);
		}

		return data.content || [];
	}, [data, params.search]);

	// Optimasi: Generate years dengan cache
	const years = useMemo(() => {
		const curr = new Date().getFullYear();
		return Array.from({ length: 4 }, (_, i) => (curr - 2 + i).toString());
	}, []);

	// Optimasi: Loading state yang lebih detail
	const isLoadingState = useMemo(() => {
		return isLoading || isPending;
	}, [isLoading, isPending]);

	const hasData = useMemo(() => {
		return tagihans.length > 0;
	}, [tagihans.length]);

	return {
		// User & Auth
		isAdmin,
		user,

		// State Management
		deleteId,
		setDeleteId,
		reset,

		// Filters & Search
		updateFilter,
		selectedYear: params.selectedYear,
		selectedMonth: params.selectedMonth,
		search: params.search,
		onSearchChange,
		handleSearchChange,
		queryString,
		years,

		// Data
		tagihans,
		data,
		isLoading: isLoadingState,
		isFetching,
		isError,
		error,
		hasData,

		// Mutations
		deleteMutation,
		handleDeleteConfirm,
		handleDialogClose,

		// UI States
		isPending,
	};
};
