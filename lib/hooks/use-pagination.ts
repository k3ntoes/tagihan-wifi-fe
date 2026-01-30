import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";

interface UsePaginationOptions {
	defaultPage?: number;
	defaultSize?: number;
	searchDebounce?: number;
	searchParamName?: string;
	debounceMs?: number;
}

export function usePagination(options: UsePaginationOptions = {}) {
	const { searchParamName = "search" } = options;

	const router = useRouter();
	const pathname = usePathname();
	const searchParams = useSearchParams();

	// Get current search value for binding
	const search = searchParams.get(searchParamName) || "";

	// Helper to create new URLSearchParams based on current state
	const createQueryString = useCallback(
		(callback: (params: URLSearchParams) => void) => {
			const params = new URLSearchParams(searchParams.toString());
			callback(params);
			return params.toString();
		},
		[searchParams],
	);

	const pushRouter = useCallback(
		(queryString: string) => {
			router.replace(`${pathname}?${queryString}`);
		},
		[pathname, router],
	);

	// Handlers
	const onPageChange = useCallback(
		(newPage: number) => {
			const queryString = createQueryString((params) => {
				params.set("page", newPage.toString());
			});
			pushRouter(queryString);
		},
		[createQueryString, pushRouter],
	);

	const onSizeChange = useCallback(
		(newSize: number) => {
			const queryString = createQueryString((params) => {
				params.set("size", newSize.toString());
				params.delete("page"); // Reset page when size changes
			});
			pushRouter(queryString);
		},
		[createQueryString, pushRouter],
	);

	const onSearchChange = useCallback(
		(newSearch: string) => {
			const queryString = createQueryString((params) => {
				if (newSearch) {
					params.set(searchParamName, newSearch);
				} else {
					params.delete(searchParamName);
				}
				// params.delete('page'); // Reset page logic
				params.delete("size"); // Reset size logic
			});
			pushRouter(queryString);
		},
		[createQueryString, pushRouter, searchParamName],
	);

	return {
		search,
		onPageChange,
		onSizeChange,
		onSearchChange,
		queryString: searchParams.toString(),
	};
}
