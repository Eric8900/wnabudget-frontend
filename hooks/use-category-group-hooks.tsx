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
  key: QueryKey,
): UseMutationResult<void, Error, { id: string }, Ctx> {
  const qc = useQueryClient();

  return useMutation<void, Error, { id: string }, Ctx>({
    mutationFn: ({ id }) => api.delete(`/category-groups/${id}`),

    onMutate: async ({ id }) => {
      await qc.cancelQueries({ queryKey: key });

      const previous = qc.getQueryData<MasterCategoryRow[]>(key);
      qc.setQueryData(key, (old: MasterCategoryRow[] | undefined) => deleteGroup(old, id));

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