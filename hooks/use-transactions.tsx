import { useQuery, QueryKey, useQueryClient, useMutation } from "@tanstack/react-query";
import { api } from "@/lib/middleware/api";
import { TransactionTable } from "@/models/types";
import { useAccountsActions } from "./use-accounts";

// Stable cache key: ["transactions", <uid>, <aid>]
export const transactionsKey = (
  uid: string | null,
  aid: string | null
): QueryKey => ["transactions", uid ?? "anon", aid ?? "none"] as const;

export function useTransactions(
  userId: string | null,
  accountId: string | null
) {
  const enabled = Boolean(userId && accountId);

  return useQuery<TransactionTable[]>({
    queryKey: transactionsKey(userId, accountId),
    enabled,
    staleTime: 5 * 60 * 1000, // 5‑minute fresh window
    queryFn: () => api.get<TransactionTable[]>(`/transactions/account/${accountId}/user/${userId}`),
  });
}

export function useTransactionsActions(userId: string | null, accountId?: string | null) {
  const qc = useQueryClient();
  const acctKey = accountId ?? "all";
  const key = transactionsKey(userId ?? "anon", acctKey);
  const { refresh: refreshAccountsList } = useAccountsActions(userId);

  const refresh = () => qc.invalidateQueries({ queryKey: key });

  // Delete transaction mutation
  const {
    mutateAsync: deleteTransaction,
    isPending: isDeleting,
  } = useMutation({
    mutationFn: (txId: string) => api.delete<void>(`/transactions/${txId}`),
    onSuccess: () => {
      refresh();
      refreshAccountsList();
    },
  });

  // Check (update cleared status)
  const {
    mutateAsync: checkTransaction,
    isPending: isChecking,
  } = useMutation({
    mutationFn: (txId: string) => api.get(`/transactions/update/${txId}`),
    onSuccess: () => {
      refresh();
      refreshAccountsList();
    },
  });

  return {
    refresh,
    deleteTransaction,
    isDeleting,
    checkTransaction,
    isChecking,
  };
}