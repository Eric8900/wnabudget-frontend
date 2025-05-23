"use client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import { useState } from "react";
import EditCategoryModal from "@/components/app/budget-table/EditCategory";
import { useDeleteCategory } from "@/hooks/use-category-hooks";

export default function CategoryActions({
  cat,
  rqKey,
  moneyLeftToAssign
}: {
  cat: { id: string; name: string; budgeted: number };
  rqKey: unknown[];
  moneyLeftToAssign: number;
}) {
  const [open, setOpen] = useState(false);
  const del = useDeleteCategory(rqKey);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="px-2">
            <MoreHorizontal className="h-5 w-5" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => setOpen(true)}>
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => del.mutate({ id: cat.id })}
            className="text-destructive"
          >
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {open && (
        <EditCategoryModal
          id={cat.id}
          initial={{ name: cat.name, budgeted: cat.budgeted }}
          onClose={() => setOpen(false)}
          rqKey={rqKey}
          moneyLeftToAssign={moneyLeftToAssign}
        />
      )}
    </>
  );
}