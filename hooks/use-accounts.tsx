import { useQuery, QueryKey, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/middleware/api";
import { Account } from "@/models/types";

export const accountsKey = (uid: string): QueryKey => ["accounts", uid] as const;

export function useAccounts(userId: string | null) {
  const enabled = Boolean(userId);

  return useQuery<Account[]>({
    queryKey: accountsKey(userId ?? "anon"),
    enabled,
    staleTime: 5 * 1000 * 60, // 5 min fresh
    queryFn: () =>
      api.get<Account[]>(`/accounts/user/${userId}`),
  });
}

export function useAccountsActions(userId: string | null) {
  const qc  = useQueryClient();
  const key = accountsKey(userId ?? "anon");

  // Force re-fetch of the accounts list from the server
  const refresh = () => qc.invalidateQueries({ queryKey: key });

  return { refresh };
}