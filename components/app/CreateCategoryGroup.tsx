"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/middleware/api";
import { toast } from "sonner";
import { useRefreshAllBudgets } from "@/hooks/use-budget-data";

interface CreateCategoryGroupProps {
  className: string;
  userId: string;
  onCreated?: () => void;
}
// STAYS in /app page
export default function CreateCategoryGroup({ className, userId, onCreated }: CreateCategoryGroupProps) {
  const [openDialog, setOpenDialog] = useState(false);
  const [name, setName] = useState("");
  const refresh = useRefreshAllBudgets(userId);

  const handleCreateGroup = async () => {
    try {
      await api.post("/category-groups", {
        user_id: userId,
        name,
      });

      toast.success("Category group created");
      setOpenDialog(false);
      setName("");
      onCreated?.();
      refresh();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Failed to create category group");
    }
  };

  return (
    <Dialog open={openDialog} onOpenChange={setOpenDialog}>
      <DialogTrigger asChild>
        <Button variant="default" className={`text-lg ${className}`}>Category Group +</Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[500px] bg-white">
        <DialogHeader>
          <DialogTitle>Create a Category Group</DialogTitle>
          <DialogDescription>Give your group a name to organize your budget.</DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid items-center gap-4">
            <Label htmlFor="group-name" className="text-right">Name</Label>
            <Input
              id="group-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="col-span-3"
              placeholder="e.g. Housing, Transportation"
            />
          </div>
        </div>

        <DialogFooter className="flex justify-between">
          <Button variant="outline" onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button onClick={handleCreateGroup}>Create</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}