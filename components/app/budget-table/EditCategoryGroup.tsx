"use client";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useUpdateGroup } from "@/hooks/use-category-group-hooks";
// STAYS IN /app PAGE
export default function EditCategoryGroupModal({
  id,
  initialName,
  onClose,
  rqKey,
}: {
  id: string;
  initialName: string;
  onClose: () => void;
  rqKey: unknown[];
}) {
  const [name, setName] = useState(initialName);
  const mut = useUpdateGroup(rqKey);

  const save = () => {
    mut.mutate({
        id, name,
        user_id: rqKey[1] as string,
    }, { onSuccess: onClose });
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="bg-white">
        <DialogHeader>
            <DialogTitle>Edit Category Group</DialogTitle>
            <DialogDescription>
              Update the name of the category group.
            </DialogDescription>
            </DialogHeader>
        <Input value={name} onChange={(e) => setName(e.target.value)} />
        <div className="flex justify-end gap-2 pt-4">
          <Button onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={save} disabled={mut.isPending}>
            Save
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}