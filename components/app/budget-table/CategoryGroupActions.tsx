"use client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import { useState } from "react";
import EditCategoryGroupModal from "@/components/app/budget-table/EditCategoryGroup";
import { useDeleteGroup } from "@/hooks/use-category-group-hooks";

export default function CategoryGroupActions({
  groupId,
  groupName,
  rqKey,
}: {
  groupId: string;
  groupName: string;
  rqKey: unknown[];
}) {
  const [open, setOpen] = useState(false);
  const del = useDeleteGroup(rqKey);

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
            onClick={() => del.mutate({ id: groupId })}
            className="text-destructive"
          >
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {open && (
        <EditCategoryGroupModal
          id={groupId}
          initialName={groupName}
          onClose={() => setOpen(false)}
          rqKey={rqKey}
        />
      )}
    </>
  );
}
