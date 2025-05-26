"use client";

import { useState } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Pencil, Trash } from "lucide-react";
import EditAccountDialog from "./EditAccountDialog";
import { Account } from "@/models/types";
import { api } from "@/lib/middleware/api";
import { useMoneyLeftActions } from "@/hooks/use-money-left-actions";
import { useAccountsActions } from "@/hooks/use-accounts";
import { useRefreshAllBudgets } from "@/hooks/use-budget-data";

interface ManageAccountsProps {
  accounts: Account[];
  onRefresh?: () => void;
}

export default function ManageAccounts({ accounts, onRefresh }: ManageAccountsProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const userId = accounts[0]?.user_id || "";
  const { refresh: refreshMoneyLeft } = useMoneyLeftActions(userId);
  const { refresh: refreshAccountsList } = useAccountsActions(userId);
  const refreshAllBudgets = useRefreshAllBudgets(userId);

  const handleDelete = async (id: string) => {
    try {
      await api.delete(`/accounts/${id}`);
      onRefresh?.();
      refreshMoneyLeft();
      refreshAccountsList();
      refreshAllBudgets();
    } catch (err) {
      console.error("Failed to delete account", err);
    } finally {
      setConfirmDeleteId(null);
    }
  };

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger asChild>
        <Button
        variant={"ghost"}
        className="cursor-pointer w-full py-2 px-4 font-medium text-left text-base justify-start">
            Manage Accounts
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[500px] bg-white">
        <DialogHeader>
          <DialogTitle>Manage Accounts</DialogTitle>
          <DialogDescription>
            View, edit, or delete your accounts.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {accounts.map((account) => (
            <div
              key={account.id}
              className="flex items-center justify-between border rounded-md p-3"
            >
              <span>{account.name}</span>
              <div className="flex gap-2">
                {confirmDeleteId === account.id ? (
                  <>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDelete(account.id)}
                    >
                      Confirm
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setConfirmDeleteId(null)}
                    >
                      Cancel
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedAccount(account)}
                    >
                      <Pencil size={16} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setConfirmDeleteId(account.id)}
                    >
                      <Trash size={16} />
                    </Button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>

        <DialogFooter>
          <Button onClick={() => setDialogOpen(false)} variant="outline">
            Close
          </Button>
        </DialogFooter>
      </DialogContent>

      {selectedAccount && (
        <EditAccountDialog
          account={selectedAccount}
          onClose={() => setSelectedAccount(null)}
          onSaved={() => {
            onRefresh?.();
            setSelectedAccount(null);
          }}
        />
      )}
    </Dialog>
  );
}