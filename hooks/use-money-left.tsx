import { useQuery, useQueryClient, QueryKey } from "@tanstack/react-query";
import { api } from "@/lib/middleware/api";

export const moneyLeftKey = (uid: string): QueryKey => ["moneyLeft", uid] as const;

export function useMoneyLeft(userId: string | null) {
  const enabled = Boolean(userId);

  return useQuery<number>({
    queryKey: moneyLeftKey(userId ?? "anon"),
    enabled,
    staleTime: 1000 * 60, // 1 min 
    queryFn: () =>
      api.get<number>(`/categories/left-to-assign/${userId}`),
  });
}

export function useBumpMoneyLeft(userId: string | null) {
  const qc = useQueryClient();
  return () => qc.invalidateQueries({ queryKey: moneyLeftKey(userId ?? "anon") });
}