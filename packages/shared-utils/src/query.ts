import {
  QueryClient,
  UseQueryOptions,
  UseInfiniteQueryOptions,
  UseMutationOptions,
  QueryKey,
} from "@tanstack/react-query";

/**
 * TanStack Query utilities and configurations
 */

export interface QueryConfig {
  defaultStaleTime?: number;
  defaultGcTime?: number; // Updated from defaultCacheTime
  defaultRetry?: number | boolean;
  defaultRefetchOnWindowFocus?: boolean;
  defaultRefetchOnReconnect?: boolean;
}

export const createQueryClient = (config?: QueryConfig): QueryClient => {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: config?.defaultStaleTime || 1000 * 60 * 5, // 5 minutes
        gcTime: config?.defaultGcTime || 1000 * 60 * 30, // 30 minutes
        retry: config?.defaultRetry !== undefined ? config.defaultRetry : 3,
        refetchOnWindowFocus: config?.defaultRefetchOnWindowFocus ?? true,
        refetchOnReconnect: config?.defaultRefetchOnReconnect ?? true,
      },
      mutations: {
        retry: false,
      },
    },
  });
};

// Query helpers
export const createQuery = <
  TQueryFnData = unknown,
  TError = Error,
  TData = TQueryFnData
>(
  queryKey: QueryKey,
  queryFn: () => Promise<TQueryFnData>,
  options?: Omit<
    UseQueryOptions<TQueryFnData, TError, TData>,
    "queryKey" | "queryFn"
  >
): UseQueryOptions<TQueryFnData, TError, TData> => {
  return {
    queryKey,
    queryFn,
    ...options,
  };
};

export const createInfiniteQuery = <
  TQueryFnData = unknown,
  TError = Error,
  TData = TQueryFnData,
  TQueryKey extends QueryKey = QueryKey,
  TPageParam = unknown
>(
  queryKey: TQueryKey,
  queryFn: (context: { pageParam: TPageParam }) => Promise<TQueryFnData>,
  options: Omit<
    UseInfiniteQueryOptions<TQueryFnData, TError, TData, TQueryKey, TPageParam>,
    "queryKey" | "queryFn"
  > & {
    initialPageParam: TPageParam;
    getNextPageParam: (
      lastPage: TQueryFnData,
      pages: TQueryFnData[],
      lastPageParam: TPageParam,
      allPageParams: TPageParam[]
    ) => TPageParam | undefined | null;
  }
): UseInfiniteQueryOptions<
  TQueryFnData,
  TError,
  TData,
  TQueryKey,
  TPageParam
> => {
  return {
    queryKey,
    queryFn: (context) =>
      queryFn({ pageParam: context.pageParam as TPageParam }),
    ...options,
  };
};

export const createMutation = <
  TData = unknown,
  TError = Error,
  TVariables = void,
  TContext = unknown
>(
  mutationFn: (variables: TVariables) => Promise<TData>,
  options?: Omit<
    UseMutationOptions<TData, TError, TVariables, TContext>,
    "mutationFn"
  >
): UseMutationOptions<TData, TError, TVariables, TContext> => {
  return {
    mutationFn,
    ...options,
  };
};

// Common query patterns
export const createEntityQuery = <T>(
  entityType: string,
  id: string | number,
  fetcher: (id: string | number) => Promise<T>,
  options?: Omit<UseQueryOptions<T>, "queryKey" | "queryFn">
) => {
  return createQuery([entityType, id], () => fetcher(id), {
    enabled: !!id,
    ...options,
  });
};

export const createListQuery = <T>(
  entityType: string,
  params: Record<string, unknown> = {},
  fetcher: (params: Record<string, unknown>) => Promise<T>,
  options?: Omit<UseQueryOptions<T>, "queryKey" | "queryFn">
) => {
  return createQuery(
    [entityType, "list", params],
    () => fetcher(params),
    options
  );
};

export const createPaginatedQuery = <T>(
  entityType: string,
  params: Record<string, unknown> = {},
  fetcher: ({
    pageParam,
    ...params
  }: { pageParam?: number } & Record<string, unknown>) => Promise<T>,
  options?: Omit<
    UseInfiniteQueryOptions<T, Error, T, QueryKey, number>,
    "queryKey" | "queryFn" | "getNextPageParam" | "initialPageParam"
  >
) => {
  return createInfiniteQuery(
    [entityType, "paginated", params],
    ({ pageParam }: { pageParam: number }) => fetcher({ pageParam, ...params }),
    {
      initialPageParam: 1,
      getNextPageParam: (lastPage: any) => {
        if (lastPage?.pagination?.hasNext) {
          return lastPage.pagination.page + 1;
        }
        return undefined;
      },
      ...options,
    }
  );
};

// Mutation patterns
export const createCreateMutation = <TData, TVariables>(
  entityType: string,
  createFn: (data: TVariables) => Promise<TData>,
  options?: Omit<UseMutationOptions<TData, Error, TVariables>, "mutationFn">
) => {
  return createMutation(createFn, {
    ...options,
    mutationKey: [entityType, "create"],
  });
};

export const createUpdateMutation = <
  TData,
  TVariables extends { id: string | number }
>(
  entityType: string,
  updateFn: (data: TVariables) => Promise<TData>,
  options?: Omit<UseMutationOptions<TData, Error, TVariables>, "mutationFn">
) => {
  return createMutation(updateFn, {
    ...options,
    mutationKey: [entityType, "update"],
  });
};

export const createDeleteMutation = <TData = void>(
  entityType: string,
  deleteFn: (id: string | number) => Promise<TData>,
  options?: Omit<
    UseMutationOptions<TData, Error, string | number>,
    "mutationFn"
  >
) => {
  return createMutation(deleteFn, {
    ...options,
    mutationKey: [entityType, "delete"],
  });
};

// Cache invalidation helpers
export const createInvalidator = (queryClient: QueryClient) => {
  return {
    invalidateEntity: (entityType: string, id?: string | number) => {
      if (id) {
        return queryClient.invalidateQueries({ queryKey: [entityType, id] });
      }
      return queryClient.invalidateQueries({ queryKey: [entityType] });
    },

    invalidateList: (entityType: string) => {
      return queryClient.invalidateQueries({ queryKey: [entityType, "list"] });
    },

    invalidatePaginated: (entityType: string) => {
      return queryClient.invalidateQueries({
        queryKey: [entityType, "paginated"],
      });
    },

    invalidateAll: () => {
      return queryClient.invalidateQueries();
    },

    removeEntity: (entityType: string, id: string | number) => {
      return queryClient.removeQueries({ queryKey: [entityType, id] });
    },

    setEntityData: <T>(entityType: string, id: string | number, data: T) => {
      return queryClient.setQueryData([entityType, id], data);
    },

    updateEntityData: <T>(
      entityType: string,
      id: string | number,
      updater: (oldData: T | undefined) => T
    ) => {
      return queryClient.setQueryData([entityType, id], updater);
    },
  };
};

// Optimistic updates helper
export const createOptimisticUpdate = <TData, TVariables>(
  queryClient: QueryClient,
  queryKey: QueryKey,
  optimisticUpdater: (
    oldData: TData | undefined,
    variables: TVariables
  ) => TData,
  rollbackUpdater?: (
    oldData: TData | undefined,
    error: Error,
    variables: TVariables
  ) => TData
) => {
  return {
    onMutate: async (variables: TVariables) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey });

      // Snapshot the previous value
      const previousData = queryClient.getQueryData<TData>(queryKey);

      // Optimistically update to the new value
      queryClient.setQueryData(queryKey, (old: TData | undefined) =>
        optimisticUpdater(old, variables)
      );

      // Return a context object with the snapshotted value
      return { previousData };
    },

    onError: (
      error: Error,
      variables: TVariables,
      context?: { previousData?: TData }
    ) => {
      // If the mutation fails, use the context to roll back
      if (context?.previousData) {
        if (rollbackUpdater) {
          queryClient.setQueryData(
            queryKey,
            rollbackUpdater(context.previousData, error, variables)
          );
        } else {
          queryClient.setQueryData(queryKey, context.previousData);
        }
      }
    },

    onSettled: () => {
      // Always refetch after error or success
      queryClient.invalidateQueries({ queryKey });
    },
  };
};
