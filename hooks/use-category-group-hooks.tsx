import {
  useMutation,
  useQueryClient,
  QueryKey,
  UseMutationResult,
} from "@tanstack/react-query";
import { api } from "@/lib/middleware/api";
import {
  CategoryGroup,
  MasterCategoryRow,
} from "@/models/types";
import { useMoneyLeftActions } from "./use-money-left-actions";

/* ------------------------------------------------------------------ */
/* Types                                                               */
/* ------------------------------------------------------------------ */

export interface CategoryGroupPatch {
  id: string;
  user_id: string;
  name?: string;
}

interface Ctx {
  previous: MasterCategoryRow[] | undefined;
}

/* ------------------------------------------------------------------ */
/* Pure helpers                                                        */
/* ------------------------------------------------------------------ */

function patchGroup(
  groups: MasterCategoryRow[] | undefined,
  p: CategoryGroupPatch,
): MasterCategoryRow[] | undefined {
  return groups?.map((g) =>
    g.id === p.id && p.name ? { ...g, name: p.name } : g,
  );
}

function deleteGroup(
  groups: MasterCategoryRow[] | undefined,
  id: string,
): MasterCategoryRow[] | undefined {
  return groups?.filter((g) => g.id !== id);
}

/* ------------------------------------------------------------------ */
/* Hook: update                                                        */
/* ------------------------------------------------------------------ */

export function useUpdateGroup(
  key: QueryKey,
): UseMutationResult<CategoryGroup, Error, CategoryGroupPatch, Ctx> {
  const qc = useQueryClient();

  return useMutation<CategoryGroup, Error, CategoryGroupPatch, Ctx>({
    mutationFn: (body) =>
      api.patch<CategoryGroup>(`/category-groups/${body.id}`, body),

    onMutate: async (body) => {
      await qc.cancelQueries({ queryKey: key });

      const previous = qc.getQueryData<MasterCategoryRow[]>(key);
      qc.setQueryData(key, (old: MasterCategoryRow[] | undefined) => patchGroup(old, body));

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

/* ------------------------------------------------------------------ */
/* Hook: delete                                                        */
/* ------------------------------------------------------------------ */

export function useDeleteGroup(
  key: QueryKey,            // ["budget", user_id, m, y]
  userId: string,
): UseMutationResult<void, Error, { id: string }, Ctx> {
  const qc = useQueryClient();
  const { refresh } = useMoneyLeftActions(userId);

  return useMutation<void, Error, { id: string }, Ctx>({
    /* ---------- server call ---------- */
    mutationFn: ({ id }) => api.delete(`/category-groups/${id}`),

    /* ---------- optimistic table update ---------- */
    onMutate: async ({ id }) => {
      await qc.cancelQueries({ queryKey: key });

      const previous = qc.getQueryData<MasterCategoryRow[]>(key);
      qc.setQueryData(key, (old: MasterCategoryRow[] | undefined) =>
        deleteGroup(old, id),
      );

      return { previous };
    },

    /* ---------- rollback on error ---------- */
    onError: (_e, _vars, ctx) => {
      qc.setQueryData(key, ctx?.previous);
      /* no need to touch Ready-to-Assign; we never changed it */
    },

    /* ---------- always re-sync ---------- */
    onSettled: () => {
      qc.invalidateQueries({ queryKey: key });  // refresh the table
      refresh();                                // refetch Ready-to-Assign
    },
  });
}