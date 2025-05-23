import { useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/middleware/api";
import {
    Category,
    CategoryGroup,
    MasterCategoryRow,
    SubCategoryRow,
} from "@/models/types";

type Params = { userId: string; month: number; year: number };

export function useRefreshAllBudgets(userId: string | null) {
  const qc  = useQueryClient();
  const key = ["budget", userId] as const;

  return () => qc.invalidateQueries({ queryKey: key, exact: false });
}

export function useBudgetData({ userId, month, year }: Params) {
    return useQuery<MasterCategoryRow[]>({
        queryKey: ["budget", userId, month, year],
        queryFn: async () => {
            // get both category groups and categories
            const [groups, categories] = await Promise.all([
                api.get<CategoryGroup[]>(`/category-groups/user/${userId}`),
                api.get<Category[]>(`/categories/user/${userId}`),
            ]);

            const scoped = categories.filter((c) => c.month === month && c.year === year);

            function toNumber(bd: string) {
                return Number(bd);
            }

            const byGroup: Record<string, SubCategoryRow[]> = {};

            for (const cat of scoped) {
                const subRow: SubCategoryRow = {
                    id: cat.id,
                    name: cat.name,
                    budgeted: toNumber(cat.budgetedAmount),
                    activity: toNumber(cat.activity),
                    available: toNumber(cat.available!),
                };

                if (!byGroup[cat.group_id]) byGroup[cat.group_id] = [];
                byGroup[cat.group_id].push(subRow);
            }

            return groups.map<MasterCategoryRow>((g) => {
                const subs = byGroup[g.id] ?? [];

                const totals = subs.reduce(
                    (acc, cur) => ({
                        budgeted: acc.budgeted + cur.budgeted,
                        activity: acc.activity + cur.activity,
                        available: acc.available + cur.available,
                    }),
                    { budgeted: 0, activity: 0, available: 0 },
                );

                return { id: g.id, name: g.name, totals, subRows: subs };
            });
        },
        staleTime: 5 * 60 * 1000, // 5 min cache
    });
}