import { useQuery, QueryKey } from "@tanstack/react-query";
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