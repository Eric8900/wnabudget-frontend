"use client";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useUpdateCategory } from "@/hooks/use-category-hooks";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";

// STAYS IN /app PAGE
export default function EditCategoryModal({
    id,
    initial,
    onClose,
    rqKey,
    moneyLeftToAssign,
}: {
    id: string;
    initial: { name: string; budgeted: number };
    onClose: () => void;
    rqKey: unknown[];
    moneyLeftToAssign: number;
}) {
    const [name, setName] = useState(initial.name);
    const [budgeted, setBudgeted] = useState(initial.budgeted);
    const mut = useUpdateCategory(rqKey, rqKey[1] as string);

    const save = () => {
        mut.mutate(
            {
                id, name, budgetedAmount: budgeted.toString(),
                user_id: rqKey[1] as string,
            },
            { onSuccess: onClose },
        );
    };

    return (
        <Dialog open onOpenChange={onClose}>
            <DialogContent className="bg-white">
                <DialogHeader>
                    <DialogTitle>Edit Category</DialogTitle>
                    <DialogDescription>
                        Update the category name and budgeted amount.
                    </DialogDescription>
                </DialogHeader>

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
                    <Label className="">Monthly Budgeted Amount: ${budgeted}</Label>
                    <Slider
                        value={[budgeted]}
                        onValueChange={([val]: [number]) => setBudgeted(val)}
                        min={0}
                        max={moneyLeftToAssign}
                        step={1}
                    />
                    <div className="text-sm text-muted-foreground">
                        Available: ${moneyLeftToAssign}
                    </div>
                </div>

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