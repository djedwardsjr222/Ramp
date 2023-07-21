import { useCallback, useState } from "react";
import { PaginatedRequestParams, PaginatedResponse, Transaction } from "../utils/types";
import { PaginatedTransactionsResult } from "./types";
import { useCustomFetch } from "./useCustomFetch";

export function usePaginatedTransactions(): PaginatedTransactionsResult {
  const { fetchWithCache, loading } = useCustomFetch();
  const [paginatedTransactions, setPaginatedTransactions] = useState<PaginatedResponse<Transaction[]> | null>(null);

  const fetchAll = useCallback(async () => {
    const page = paginatedTransactions?.nextPage ?? 0; // Use the nextPage from state if available
    const response = await fetchWithCache<PaginatedResponse<Transaction[]>, PaginatedRequestParams>(
      "paginatedTransactions",
      {
        page,
      }
    );

    setPaginatedTransactions((previousResponse) => {
      if (response === null) {
        return previousResponse; // Return the previous response if there's no new data
      }

      // Append the new transactions to the existing ones or set the response if there were no previous transactions
      const newData = previousResponse ? [...previousResponse.data, ...response.data] : response.data;

      return { data: newData, nextPage: response.nextPage };
    });
  }, [fetchWithCache, paginatedTransactions]);

  const invalidateData = useCallback(() => {
    setPaginatedTransactions(null);
  }, []);

  return { data: paginatedTransactions, loading, fetchAll, invalidateData };
}