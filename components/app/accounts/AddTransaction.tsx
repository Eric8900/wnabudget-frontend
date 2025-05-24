"use client";

import { useState, useEffect } from "react";
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { api } from "@/lib/middleware/api";
import { useRefreshAllBudgets } from "@/hooks/use-budget-data";
import { useMoneyLeftActions } from "@/hooks/use-money-left-actions";

interface Category {
    id: string;
    name: string;
}

interface AddTransactionProps {
    userId: string;
    accountId: string;
    onCreated: () => void;
}

export default function AddTransaction({ userId, accountId, onCreated }: AddTransactionProps) {
    const [openDialog, setOpenDialog] = useState(false);
    const [categories, setCategories] = useState<Category[]>([]);
    const [categoryId, setCategoryId] = useState("");
    const [amount, setAmount] = useState<number>(0);
    const [payee, setPayee] = useState("");
    const [memo, setMemo] = useState("");
    const [cleared, setCleared] = useState(false);
    const [isExpense, setIsExpense] = useState(true);
    const refreshAllBudgets = useRefreshAllBudgets(userId);
    const moneyLeftActions = useMoneyLeftActions(userId);
    
    useEffect(() => {
        if (openDialog) {
            api.get<Category[]>(`/categories/user/${userId}`)
                .then(setCategories)
                .catch(() => toast.error("Failed to load categories"));
        }
    }, [openDialog, userId]);

    const handleCreateTransaction = async () => {
        if (!categoryId || !amount) {
            toast.error("Category and amount are required");
            return;
        }

        try {
            await api.post("/transactions", {
                user_id: userId,
                account_id: accountId,
                category_id: categoryId,
                amount: isExpense ? -Math.abs(amount) : Math.abs(amount),
                payee,
                memo,
                cleared,
            });

            toast.success("Transaction created");
            setOpenDialog(false);
            setCategoryId("");
            setAmount(0);
            setPayee("");
            setMemo("");
            setCleared(false);
            onCreated?.();
            refreshAllBudgets();
            moneyLeftActions.refresh();
        } catch (err: unknown) {
            toast.error(err instanceof Error ? err.message : "Failed to create transaction");
        }
    };

    return (
        <Dialog open={openDialog} onOpenChange={setOpenDialog}>
            <DialogTrigger asChild>
                <Button variant="default" className="text-sm">Add Transaction</Button>
            </DialogTrigger>

            <DialogContent className={`sm:max-w-[500px] bg-white border-4 ${isExpense ? "border-red-600" : "border-green-600"}`}>
                <DialogHeader>
                    <DialogTitle>Add a Transaction</DialogTitle>
                    <DialogDescription>Record income (inflow) or expense (outflow) from an account.</DialogDescription>
                </DialogHeader>

                <div className="grid gap-4 py-4">
                    <div className="grid sm:grid-cols-2 grid-cols-1 items-center gap-4">
                        <div className="grid items-center gap-4">
                            <Label className="text-right">Category</Label>
                            <Select value={categoryId} onValueChange={setCategoryId}>
                                <SelectTrigger className="col-span-3">
                                    <SelectValue placeholder="Select a category" />
                                </SelectTrigger>
                                <SelectContent>
                                    {categories.map((cat) => (
                                        <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="grid items-center gap-4">
                            <Label className="text-right">Type</Label>
                            <Select value={isExpense ? "expense" : "income"} onValueChange={(val) => setIsExpense(val === "expense")}>
                                <SelectTrigger className="col-span-3">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="income">Inflow</SelectItem>
                                    <SelectItem value="expense">Outflow</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="grid items-center gap-4">
                        <Label className="text-right">Amount</Label>
                        <Input
                            type="number"
                            value={amount}
                            onChange={(e) => setAmount(Number(e.target.value))}
                            className="col-span-3"
                            placeholder="e.g. -50.00 for expense, 200.00 for income"
                        />
                    </div>

                    <div className="grid items-center gap-4">
                        <Label className="text-right">Payee</Label>
                        <Input
                            value={payee}
                            onChange={(e) => setPayee(e.target.value)}
                            className="col-span-3"
                            placeholder="Optional"
                        />
                    </div>

                    <div className="grid items-center gap-4">
                        <Label className="text-right">Memo</Label>
                        <Input
                            value={memo}
                            onChange={(e) => setMemo(e.target.value)}
                            className="col-span-3"
                            placeholder="Optional"
                        />
                    </div>

                    <div className="flex items-center gap-4">
                        <Label className="text-right">Cleared</Label>
                        <Checkbox
                            checked={cleared}
                            onCheckedChange={(checked: boolean) => setCleared(Boolean(checked))}
                            className="col-span-3"
                        />
                    </div>
                </div>

                <DialogFooter className="flex justify-between">
                    <Button variant="outline" onClick={() => setOpenDialog(false)}>Cancel</Button>
                    <Button onClick={handleCreateTransaction} className={`${isExpense ? "bg-red-300" : "bg-green-300"}`}>Add Transaction</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}