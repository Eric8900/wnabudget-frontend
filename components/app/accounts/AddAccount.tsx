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
import { useMoneyLeftActions } from "@/hooks/use-money-left-actions";

interface AddAccountProps {
  userId: string;
  refreshAccounts?: () => void;
}

export default function AddAccount({ userId, refreshAccounts }: AddAccountProps) {
  const [openDialog, setOpenDialog] = useState(false);
  const [name, setName] = useState("");
  const [type, setType] = useState("checking");
  const [balance, setBalance] = useState("0.00");
  const { refresh } = useMoneyLeftActions(userId);


  const handleCreateAccount = async () => {
    try {
      await api.post("/accounts", {
        user_id: userId,
        name,
        type,
        balance: parseFloat(balance),
      });

      toast("Account created successfully");
      setOpenDialog(false);
      setName("");
      setType("checking");
      setBalance("0");

      refreshAccounts?.();
      refresh();
    } catch (err: unknown) {
      const errorMessage =
        err && typeof err === "object" && "message" in err
          ? String((err as { message?: string }).message)
          : "Failed to create account";
      toast(`Error: ${errorMessage}`);
    }
  };

  return (
    <Dialog open={openDialog} onOpenChange={setOpenDialog}>
      <DialogTrigger asChild>
        <Button className="text-sm font-medium w-full">Add Account +</Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[500px] bg-white">
        <DialogHeader>
          <DialogTitle>Create Account</DialogTitle>
          <DialogDescription>Fill in the details to add a new account.</DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid items-center gap-4">
            <Label htmlFor="name" className="text-right">Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="col-span-3"
            />
          </div>

          <div className="grid items-center gap-4">
            <Label htmlFor="type" className="text-right">Type</Label>
            <select
              id="type"
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="col-span-3 border border-input rounded-md px-2 py-2"
            >
              <option value="checking">Checking</option>
              <option value="savings">Savings</option>
              <option value="credit">Credit Card</option>
              <option value="cash">Cash</option>
            </select>
          </div>

          <div className="grid items-center gap-4">
            <Label htmlFor="balance" className="text-right">Current Balance</Label>
            <Input
              id="balance"
              type="number"
              value={balance}
              onChange={(e) => setBalance(e.target.value)}
              className="col-span-3"
            />
          </div>
        </div>

        <DialogFooter className="flex justify-between">
          <Button variant="outline" onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button onClick={handleCreateAccount}>Create</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}