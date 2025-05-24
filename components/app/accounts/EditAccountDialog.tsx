import { useState } from "react";
import { api } from "@/lib/middleware/api";
import { Account } from "@/models/types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useAccountsActions } from "@/hooks/use-accounts";

interface EditAccountDialogProps {
  account: Account;
  onClose: () => void;
  onSaved: () => void;
}

export default function EditAccountDialog({ account, onClose, onSaved }: EditAccountDialogProps) {
  const [name, setName] = useState(account.name);
  const [loading, setLoading] = useState(false);
  const { refresh: refreshAccountsList} = useAccountsActions(account.user_id);

  const handleSave = async () => {
    setLoading(true);
    try {
      await api.put(`/accounts/${account.id}`, {
        ...account,
        name,
      });
      onSaved?.();
      refreshAccountsList();
    } catch (err) {
      console.error("Failed to update account", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] bg-white">
        <DialogHeader>
          <DialogTitle>Edit Account</DialogTitle>
          <DialogDescription>
            Update account details below.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="grid items-center gap-4">
            <Label>Name</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} />
          </div>

          <div className="grid items-center gap-4">
            <Label>Type</Label>
            <Input value={account.type} disabled />
          </div>

          <div className="grid items-center gap-4">
            <Label>Balance</Label>
            <Input value={`$${account.balance.toFixed(2)}`} disabled />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSave} disabled={loading}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}