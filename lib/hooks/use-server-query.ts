import {
	type QueryKey,
	type UseMutationOptions,
	type UseQueryOptions,
	useMutation,
	useQuery,
	useQueryClient,
} from "@tanstack/react-query";
import { toast } from "sonner";

/**
 * Generic hook for server queries with React Query
 * Follows Next.js 16.0.10 best practices
 */
export function useServerQuery<TData = unknown, TError = Error>(
	queryKey: QueryKey,
	queryFn: () => Promise<TData>,
	options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">,
) {
	return useQuery({
		queryKey,
		queryFn,
		...options,
	});
}

/**
 * Generic hook for server mutations with React Query
 * Includes automatic error handling and toast notifications
 */
interface UseServerMutationOptions<TData, TVariables, TError = Error> {
	mutationFn: (variables: TVariables) => Promise<TData>;
	/** Query keys to invalidate after successful mutation */
	invalidateKeys?: QueryKey[];
	/** Success message to display */
	successMessage?: string;
	/** Error message to display (default: error from server) */
	errorMessage?: string;
	/** Callback after successful mutation */
	onSuccess?: (data: TData, variables: TVariables) => void;
	/** Callback after failed mutation */
	onError?: (error: TError, variables: TVariables) => void;
	/** Additional mutation options */
	mutationOptions?: Omit<
		UseMutationOptions<TData, TError, TVariables>,
		"mutationFn" | "onSuccess" | "onError"
	>;
}

export function useServerMutation<
	TData = unknown,
	TVariables = void,
	TError = Error,
>({
	mutationFn,
	invalidateKeys = [],
	successMessage,
	errorMessage,
	onSuccess,
	onError,
	mutationOptions,
}: UseServerMutationOptions<TData, TVariables, TError>) {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn,
		onSuccess: (data, variables, _context) => {
			// Invalidate queries
			if (invalidateKeys.length > 0) {
				invalidateKeys.forEach((key) => {
					queryClient.invalidateQueries({ queryKey: key });
				});
			}

			// Show success message
			if (successMessage) {
				toast.success(successMessage);
			}

			// Call custom onSuccess
			onSuccess?.(data, variables);
		},
		onError: (error, variables, _context) => {
			// Show error message
			const message =
				errorMessage ||
				(error as unknown as Error)?.message ||
				"Terjadi kesalahan";
			toast.error(message);

			// Call custom onError
			onError?.(error, variables);
		},
		...mutationOptions,
	});
}

/**
 * Generic hook for paginated server lists
 * Follows Next.js 16.0.10 patterns for server data
 */
interface UseServerListOptions<TData> {
	queryKey: QueryKey;
	queryFn: (params?: unknown) => Promise<TData>;
	initialData?: TData;
	enabled?: boolean;
	placeholderData?: UseQueryOptions<TData>["placeholderData"];
	staleTime?: number;
	gcTime?: number;
	refetchOnWindowFocus?: boolean;
	refetchOnMount?: boolean;
	refetchInterval?: number;
	retry?: number;
}

export function useServerList<TData = unknown>({
	queryKey,
	queryFn,
	initialData,
	enabled = true,
	placeholderData,
	staleTime = 30 * 1000,
	gcTime = 5 * 60 * 1000,
	refetchOnWindowFocus,
	refetchOnMount,
	refetchInterval,
	retry,
}: UseServerListOptions<TData>) {
	return useQuery({
		queryKey,
		queryFn,
		initialData,
		enabled,
		staleTime,
		placeholderData,
		gcTime,
		refetchOnWindowFocus,
		refetchOnMount,
		refetchInterval,
		retry,
	});
}

/**
 * Hook for optimistic updates
 * Useful for instant UI feedback before server confirmation
 */
export function useOptimisticMutation<TData, TVariables, _TError = Error>({
	mutationFn,
	queryKey,
	updateFn,
	successMessage,
	onSuccess,
}: {
	mutationFn: (variables: TVariables) => Promise<TData>;
	queryKey: QueryKey;
	updateFn: (oldData: TData, variables: TVariables) => TData;
	successMessage?: string;
	onSuccess?: (data: TData, variables: TVariables) => void;
}) {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn,
		onMutate: async (variables) => {
			// Cancel outgoing refetches
			await queryClient.cancelQueries({ queryKey });

			// Snapshot previous value
			const previousData = queryClient.getQueryData(queryKey);

			// Optimistically update
			queryClient.setQueryData(queryKey, (old: TData) =>
				updateFn(old, variables),
			);

			return { previousData };
		},
		onError: (_err, _variables, context) => {
			// Rollback on error
			if (context?.previousData) {
				queryClient.setQueryData(queryKey, context.previousData);
			}
			toast.error("Terjadi kesalahan, perubahan dibatalkan");
		},
		onSuccess: (data, variables) => {
			if (successMessage) {
				toast.success(successMessage);
			}
			onSuccess?.(data, variables);
		},
		onSettled: () => {
			// Refetch after mutation
			queryClient.invalidateQueries({ queryKey });
		},
	});
}
