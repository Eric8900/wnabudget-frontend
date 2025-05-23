"use client";

import { useEffect, useState } from "react";
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CategoryGroup } from "@/models/types";
import { Slider } from "../ui/slider";
import { useMoneyLeftActions } from "@/hooks/use-money-left-actions";
import { useRefreshAllBudgets } from "@/hooks/use-budget-data";

interface CreateCategoryProps {
  userId: string;
  moneyLeftToAssign: number;
  onCreated?: () => void;
}
// STAYS in /app page
export default function CreateCategory({ userId, onCreated, moneyLeftToAssign }: CreateCategoryProps) {
  const [openDialog, setOpenDialog] = useState(false);
  const [groups, setGroups] = useState<CategoryGroup[]>([]);
  const [groupId, setGroupId] = useState<string>("");
  const [name, setName] = useState("");
  const [budgetedAmount, setBudgetedAmount] = useState<number>(0);
  const {refresh} = useMoneyLeftActions(userId);
  const refreshAllBudgets = useRefreshAllBudgets(userId);

  useEffect(() => {
    if (openDialog) {
      api.get<CategoryGroup[]>(`/category-groups/user/${userId}`)
        .then(setGroups)
        .catch(() => toast.error("Failed to load category groups"));
    }
  }, [openDialog, userId]);

  const handleCreateCategory = async () => {
    if (!groupId || !name) {
      toast.error("Please fill all fields");
      return;
    }

    const now = new Date();
    const month = now.getMonth() + 1; // 1 is jan
    const year = now.getFullYear();

    try {
      await api.post("/categories", {
        user_id: userId,
        group_id: groupId,
        name,
        month,
        year,
        budgetedAmount: budgetedAmount,
      });

      toast.success("Category created");
      setOpenDialog(false);
      setName("");
      setGroupId("");
      setBudgetedAmount(0);
      refresh();
      refreshAllBudgets();
      onCreated?.();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Failed to create category");
    }
  };

  return (
    <Dialog open={openDialog} onOpenChange={setOpenDialog}>
      <DialogTrigger asChild>
        <Button variant="default" className="text-lg" disabled={moneyLeftToAssign <= 0}>Assign Now</Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[500px] bg-white">
        <DialogHeader>
          <DialogTitle>Create a Category</DialogTitle>
          <DialogDescription>Define a budget category for monthly expenditures.</DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid items-center gap-4">
            <Label className="text-right">Group</Label>
            <Select value={groupId} onValueChange={setGroupId}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select a group" />
              </SelectTrigger>
              <SelectContent>
                {groups.map((group) => (
                  <SelectItem key={group.id} value={group.id}>{group.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid items-center gap-4">
            <Label className="text-right">Name</Label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="col-span-3"
              placeholder="e.g. Groceries"
            />
          </div>

          <div className="grid gap-2">
            <Label className="">Monthly Budgeted Amount: ${budgetedAmount}</Label>
            <Slider
              value={[budgetedAmount]}
              onValueChange={([val]: [number]) => setBudgetedAmount(val)}
              min={0}
              max={moneyLeftToAssign}
              step={1}
            />
            <div className="text-sm text-muted-foreground">
              Available: ${moneyLeftToAssign}
            </div>
          </div>
        </div>

        <DialogFooter className="flex justify-between">
          <Button variant="outline" onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button onClick={handleCreateCategory} disabled={budgetedAmount > moneyLeftToAssign}>
            Create
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}