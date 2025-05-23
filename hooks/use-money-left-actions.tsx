import { useQueryClient } from "@tanstack/react-query";
import { moneyLeftKey } from "@/hooks/use-money-left";

/* ------------------------------------------------------------------ */
export function useMoneyLeftActions(userId: string | null) {
  const qc = useQueryClient();
  const key = moneyLeftKey(userId ?? "anon");

  // ReactQuery refetch the amount from the server 
  const refresh = () => qc.invalidateQueries({ queryKey: key });

  // Replace with exact value
  const set = (value: number) => qc.setQueryData<number>(key, value);

  // Adjust by a delta (positive or negative)
  const adjust = (delta: number) =>
    qc.setQueryData<number>(key, (old) => (old ?? 0) + delta);

  return { refresh, set, adjust };
}