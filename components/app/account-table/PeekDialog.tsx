import React from 'react'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { TransactionTable } from '@/models/types';
import { MoneyCell } from './transaction-table';
import { Button } from '@/components/ui/button';
import { EyeIcon } from 'lucide-react';

interface PeekDialogProps {
    tx: TransactionTable
}

export default function PeekDialog({ tx }: PeekDialogProps) {
    return (
        <Dialog key={tx.id}>
            <DialogTrigger asChild>
                <Button
                    variant="ghost"
                    size="icon"
                    className={"size-7 group"}
                >
                    <EyeIcon className="h-4 w-4 text-sky-500 hover:text-white group-hover:text-white" />
                </Button>
            </DialogTrigger>
            <DialogContent className='bg-white'>
                <DialogHeader>
                    <DialogTitle>Transaction Details</DialogTitle>
                    <DialogDescription>Review the transaction information below</DialogDescription>
                </DialogHeader>

                <div className="grid gap-6 p-2">
                    <div className="grid grid-cols-2 gap-2">
                        <span className="font-semibold">Account:</span>
                        <span>{tx.account_name}</span>

                        <span className="font-semibold">Category:</span>
                        <span>{tx.category_name || "—"}</span>

                        <span className="font-semibold">Amount:</span>
                        <MoneyCell value={tx.amount} negativeIsRed />

                        <span className="font-semibold">Payee:</span>
                        <span>{tx.payee || "—"}</span>

                        <span className="font-semibold">Memo:</span>
                        <span>{tx.memo || "—"}</span>

                        <span className="font-semibold">Date:</span>
                        <span>{tx.date}</span>

                        <span className="font-semibold">Cleared:</span>
                        <span>
                            {tx.cleared ? (
                                <span className="text-green-600 font-bold">✔</span>
                            ) : (
                                <span className="text-red-600 font-bold">✘</span>
                            )}
                        </span>
                    </div>
                </div>

                <DialogFooter>
                    <p className="text-xs text-muted-foreground">This transaction cannot be modified here.</p>
                </DialogFooter>
            </DialogContent>

        </Dialog>
    )
}