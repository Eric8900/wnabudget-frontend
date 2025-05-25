"use client";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Loader2, Trash2 } from "lucide-react";
import React from "react";
import { useTransactions, useTransactionsActions } from "@/hooks/use-transactions";
import { TransactionTable } from "@/models/types";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import PeekDialog from "./PeekDialog";

interface TransactionsTableProps {
    userId: string;
    accountId: string;
}

export default function TransactionsTable({ userId, accountId }: TransactionsTableProps) {
    const { data, isLoading, isError, error } = useTransactions(userId, accountId);

    if (isLoading) return <TableSkeleton />;
    if (isError)
        return (
            <p className="text-destructive p-4">
                Failed to load transactions - {(error as Error).message}
            </p>
        );

    return (
        <div className="w-full mx-auto">
            <h2 className="p-4 text-xl font-semibold">Transactions</h2>

            <div className="w-full bg-white overflow-x-auto">
                <Table className="lg:text-xl text-base">
                    <TableHeader>
                        <TableRow className="text-sm text-neutral-600">
                            <TableHead className="text-center w-24">CLEARED</TableHead>
                            <TableHead className="text-right">AMOUNT</TableHead>
                            <TableHead className="w-full">CATEGORY</TableHead>
                            <TableHead className="w-36 hidden md:table-cell">DATE</TableHead>
                            <TableHead className="text-right w-12" />
                        </TableRow>
                    </TableHeader>

                    <TableBody>
                        {data!.map((tx) => (
                            <TransactionRow key={tx.id} tx={tx} accountId={accountId} />
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}

function TransactionRow({ tx, accountId }: { tx: TransactionTable, accountId: string }) {
    const { deleteTransaction, checkTransaction, isChecking } = useTransactionsActions(tx.user_id, accountId);
    return (
        <TableRow className={`${tx.cleared ? "" : "bg-yellow-50"} hover:bg-muted/70`}>
            <TableCell className="flex justify-center text-center py-3">
                <div className="flex justify-center">
                    {isChecking ? (
                        <Loader2 className="h-5 w-5 animate-spin text-primary stroke-primary" />
                    ) : (
                        <Checkbox className="cursor-pointer" checked={tx.cleared} onCheckedChange={() => { checkTransaction(tx.id) }} />
                    )}
                </div>
            </TableCell>

            <TableCell className="text-right py-3">
                <MoneyCell value={tx.amount} negativeIsRed />
            </TableCell>

            <TableCell className="py-3">
                {tx.category_name ?? "—"}
            </TableCell>

            <TableCell className="tabular-nums py-3 hidden md:table-cell">
                {tx.date}
            </TableCell>

            <TableCell className="tabular-nums py-3 hidden md:table-cell">
                <PeekDialog tx={tx} />
            </TableCell>

            <TableCell className="text-right py-3">
                <Dialog>
                    <DialogTrigger asChild>
                        <Button
                            variant="ghost"
                            size="icon"
                            className={"size-7"}
                        >
                            <Trash2 className="h-4 w-4 text-red-600" />
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Delete Transaction</DialogTitle>
                            <DialogDescription>
                                Are you sure you want to delete this transaction? This action cannot be undone.
                            </DialogDescription>
                        </DialogHeader>
                        <DialogFooter>
                            <Button onClick={() => deleteTransaction(tx.id)}>
                                Delete
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </TableCell>
        </TableRow>
    );
}

// --------------------------
// MONEY CELL HELPER
// --------------------------
export function MoneyCell({
    value,
    negativeIsRed = false,
}: {
    value: number;
    negativeIsRed?: boolean;
}) {
    const formatted = Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
    }).format(value);

    const color = negativeIsRed && value < 0 ? "text-red-500" : value === 0 ? undefined : "text-emerald-500";

    return <span className={`tabular-nums ${color}`}>{formatted}</span>;
}

// --------------------------
// SKELETON PLACEHOLDER
// --------------------------
function TableSkeleton() {
    return (
        <div className="w-full bg-white overflow-hidden">
            <div className="space-y-3 p-4">
                {[...Array(5)].map((_, i) => (
                    <div key={i} className="flex items-center gap-4">
                        <Skeleton className="h-5 w-24" />
                        <Skeleton className="h-5 w-40 flex-1" />
                        <Skeleton className="h-5 w-40 hidden md:block" />
                        <Skeleton className="h-5 w-16 hidden md:block" />
                        <Skeleton className="h-4 w-4" />
                        <Skeleton className="h-4 w-4" />
                    </div>
                ))}
            </div>
        </div>
    );
}