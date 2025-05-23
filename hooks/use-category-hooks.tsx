import {
  useMutation,
  useQueryClient,
  QueryKey,
  UseMutationResult,
} from "@tanstack/react-query";
import { api } from "@/lib/middleware/api";
import {
  Category,
  MasterCategoryRow,
  SubCategoryRow,
} from "@/models/types";
import { moneyLeftKey } from "./use-money-left";
import { useMoneyLeftActions } from "./use-money-left-actions";

/* ------------------------------------------------------------------ */
/* Types                                                               */
/* ------------------------------------------------------------------ */

export interface CategoryPatch {
  id: string;
  user_id: string;            // auth check
  name?: string;
  budgetedAmount?: string;
  activity?: string;
  available?: string;
}

interface Ctx {
  previous: MasterCategoryRow[] | undefined;
  delta?: number;
}

/* ------------------------------------------------------------------ */
/* Helper                                                        */
/* ------------------------------------------------------------------ */

function toNumber(v: string | undefined): number | undefined {
  return v !== undefined ? Number(v) : undefined;
}

function recalcTotals(rows: SubCategoryRow[]): {
  budgeted: number;
  activity: number;
  available: number;
} {
  return rows.reduce(
    (acc, cur) => ({
      budgeted: acc.budgeted + cur.budgeted,
      activity: acc.activity + cur.activity,
      available: acc.available + cur.available,
    }),
    { budgeted: 0, activity: 0, available: 0 },
  );
}

function patchCategory(
  groups: MasterCategoryRow[] | undefined,
  patch: CategoryPatch,
): MasterCategoryRow[] | undefined {
  if (!groups) return groups;

  return groups.map((g) => {
    const newSubs = g.subRows.map((s) =>
      s.id === patch.id
        ? {
            ...s,
            name: patch.name ?? s.name,
            budgeted:
              toNumber(patch.budgetedAmount) ?? s.budgeted,
            activity: toNumber(patch.activity) ?? s.activity,
            available: toNumber(patch.available) ?? s.available,
          }
        : s,
    );
    return { ...g, subRows: newSubs, totals: recalcTotals(newSubs) };
  });
}

function deleteCategory(
  groups: MasterCategoryRow[] | undefined,
  id: string,
): MasterCategoryRow[] | undefined {
  if (!groups) return groups;

  return groups.map((g) => {
    const newSubs = g.subRows.filter((s) => s.id !== id);
    return { ...g, subRows: newSubs, totals: recalcTotals(newSubs) };
  });
}

/* ------------------------------------------------------------------ */
/* Hook: update                                                        */
/* ------------------------------------------------------------------ */

export function useUpdateCategory(
  key: QueryKey,          // ["budget", user_id, m, y]
  userId: string,         // needed for money-left key
): UseMutationResult<Category, Error, CategoryPatch, Ctx> {
  const qc = useQueryClient();
  const { adjust } = useMoneyLeftActions(userId);

  return useMutation<Category, Error, CategoryPatch, Ctx>({
    /* PATCH endpoint */
    mutationFn: (body) =>
      api.patch<Category>(`/categories/${body.id}`, body),

    /* ---------- optimistic ---------- */
    onMutate: async (body) => {
      await qc.cancelQueries({ queryKey: key });

      /* grab current cache */
      const previous = qc.getQueryData<MasterCategoryRow[]>(key);

      /* find the old budgeted value to compute diff */
      const oldBudgeted = previous
        ?.flatMap((g) => g.subRows)
        .find((s) => s.id === body.id)?.budgeted ?? 0;

      const newBudgeted =
        body.budgetedAmount !== undefined
          ? Number(body.budgetedAmount)
          : oldBudgeted;

      const delta = newBudgeted - oldBudgeted; // + if more budgeted

      /* patch table cache */
      qc.setQueryData(key, (old: MasterCategoryRow[] | undefined) => patchCategory(old, body));

      /* adjust Ready-to-Assign (subtract delta) */
      adjust(-delta);

      return { previous, delta };
    },

    /* ---------- rollback on error ---------- */
    onError: (_e, _vars, ctx) => {
      if (ctx) {
        qc.setQueryData(key, ctx.previous);
        adjust(ctx.delta!); // undo the earlier subtraction
      }
    },

    /* ---------- always re-sync from server ---------- */
    onSettled: () => {
      qc.invalidateQueries({ queryKey: key });                 // refresh table
      qc.invalidateQueries({ queryKey: moneyLeftKey(userId) }); // refresh RTA
    },
  });
}

/* ------------------------------------------------------------------ */
/* Hook: delete                                                        */
/* ------------------------------------------------------------------ */

export function useDeleteCategory(
  key: QueryKey,
): UseMutationResult<void, Error, { id: string }, Ctx> {
  const qc = useQueryClient();

  return useMutation<void, Error, { id: string }, Ctx>({
    mutationFn: ({ id }) => api.delete(`/categories/${id}`),

    onMutate: async ({ id }) => {
      await qc.cancelQueries({ queryKey: key });
      const previous = qc.getQueryData<MasterCategoryRow[]>(key);
      qc.setQueryData(key, (old: MasterCategoryRow[] | undefined) =>
        deleteCategory(old, id),
      );
      return { previous };
    },

    onError: (_e, _v, ctx) => {
      qc.setQueryData(key, ctx?.previous);
    },

    onSettled: () => {
      qc.invalidateQueries({ queryKey: key });
    },
  });
}