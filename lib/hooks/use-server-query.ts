import {
    useQuery,
    useMutation,
    useQueryClient,
    type UseQueryOptions,
    type UseMutationOptions,
    type QueryKey,
} from '@tanstack/react-query';
import { toast } from 'sonner';

/**
 * Generic hook for server queries with React Query
 * Follows Next.js 16.0.10 best practices
 */
export function useServerQuery<TData = unknown, TError = Error>(
    queryKey: QueryKey,
    queryFn: () => Promise<TData>,
    options?: Omit<UseQueryOptions<TData, TError>, 'queryKey' | 'queryFn'>
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
        'mutationFn' | 'onSuccess' | 'onError'
    >;
}

export function useServerMutation<TData = unknown, TVariables = void, TError = Error>({
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
        onSuccess: (data, variables, context) => {
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
        onError: (error, variables, context) => {
            // Show error message
            const message = errorMessage || (error as any)?.message || 'Terjadi kesalahan';
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
    queryFn: (params?: any) => Promise<TData>;
    initialData?: TData;
    enabled?: boolean;
}

export function useServerList<TData = unknown>({
    queryKey,
    queryFn,
    initialData,
    enabled = true,
}: UseServerListOptions<TData>) {
    return useQuery({
        queryKey,
        queryFn,
        initialData,
        enabled,
        staleTime: 30 * 1000, // 30 seconds for lists
    });
}

/**
 * Hook for optimistic updates
 * Useful for instant UI feedback before server confirmation
 */
export function useOptimisticMutation<TData, TVariables, TError = Error>({
    mutationFn,
    queryKey,
    updateFn,
    successMessage,
    onSuccess,
}: {
    mutationFn: (variables: TVariables) => Promise<TData>;
    queryKey: QueryKey;
    updateFn: (oldData: any, variables: TVariables) => any;
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
            queryClient.setQueryData(queryKey, (old: any) => updateFn(old, variables));

            return { previousData };
        },
        onError: (err, variables, context) => {
            // Rollback on error
            if (context?.previousData) {
                queryClient.setQueryData(queryKey, context.previousData);
            }
            toast.error('Terjadi kesalahan, perubahan dibatalkan');
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
