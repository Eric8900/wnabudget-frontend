"use client";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { ChevronDown, ChevronRight } from "lucide-react";
import { useBudgetData } from "@/hooks/use-budget-data";
import { MasterCategoryRow } from "@/models/types";
import React from "react";
import CategoryGroupActions from "./CategoryGroupActions";
import CategoryActions from "./CategoryActions";
import { MonthNavigator } from "./MonthNavigator";
import BudgetTableSkeleton from "./BudgetTableSkeleton";

export default function BudgetTable({
    userId,
    month,
    year,
    moneyLeftToAssign
}: {
    userId: string;
    month: number;
    year: number;
    moneyLeftToAssign: number;
}) {
    const { data, isLoading, isError, error } = useBudgetData({
        userId,
        month,
        year,
    });

    if (isLoading)
        return <BudgetTableSkeleton />;

    if (isError)
        return (
            <p className="text-destructive p-4">
                Failed to load budget&nbsp;- {(error as Error).message}
            </p>
        );

    return (
        <div className="w-full mx-auto">
            <h2 className="p-4 text-xl font-semibold">
                <div className="flex items-center justify-center gap-2 ml-4">
                    <MonthNavigator/>
                </div>
            </h2>

            <div className="w-full bg-white">
                <Table className="lg:text-xl text-base">
                    <TableHeader>
                        <TableRow className="text-sm text-neutral-600">
                            <TableHead className="w-full pl-8">CATEGORY</TableHead>
                            <TableHead className="text-center hidden md:table-cell">BUDGETED</TableHead>
                            <TableHead className="text-center hidden md:table-cell">ACTIVITY</TableHead>
                            <TableHead className="text-center">AVAILABLE</TableHead>
                            <TableHead className="text-right w-28" />
                        </TableRow>
                    </TableHeader>

                    <TableBody>
                        {(data!.length === 0 || data === null) && (
                            <TableRow>
                                <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                                    Create a Category Group to begin.
                                </TableCell>
                            </TableRow>
                        )}
                        {data!.map((row) => (
                            <MasterRow key={row.id} row={row} userId={userId} month={month} year={year} moneyLeftToAssign={moneyLeftToAssign} />
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}

// ─────────────────────────────────────────────────────────────
// --------------------------
// CATEGORY GROUPS
// --------------------------
// ─────────────────────────────────────────────────────────────
function MasterRow({ row, userId, month, year, moneyLeftToAssign }: { row: MasterCategoryRow; userId: string; month: number; year: number, moneyLeftToAssign: number }) {
    const [open, setOpen] = React.useState(true);

    return (
        <>
            <TableRow
                className="bg-muted hover:bg-muted/70 cursor-pointer font-extrabold py-5"
                onClick={() => setOpen((o) => !o)}
            >
                <TableCell className="py-4">
                    <div className="flex items-center gap-2">
                        {open ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                        {row.name}
                    </div>
                </TableCell>

                <TableCell className="text-right tabular-nums hidden md:table-cell py-4">
                    <MoneyCell value={row.totals.budgeted} />
                </TableCell>
                <TableCell className="text-right tabular-nums hidden md:table-cell py-4">
                    <MoneyCell value={row.totals.activity} negativeIsRed />
                </TableCell>
                <TableCell className="text-right tabular-nums py-4">
                    <MoneyCell value={row.totals.available} negativeIsRed />
                </TableCell>
                <TableCell className="text-right py-4">
                    <CategoryGroupActions
                        groupId={row.id}
                        groupName={row.name}
                        rqKey={["budget", userId, month, year]}
                    />
                </TableCell>
            </TableRow>

            {/* // --------------------------
            // CATEGORIES
            // -------------------------- */}
            {open &&
                row.subRows.map((sub) => (
                    <TableRow key={sub.id}>
                        <TableCell className="pl-8">{sub.name}</TableCell>
                        <TableCell className="text-right hidden md:table-cell">
                            <MoneyCell value={sub.budgeted} />
                        </TableCell>
                        <TableCell className="text-right hidden md:table-cell">
                            <MoneyCell value={sub.activity} negativeIsRed />
                        </TableCell>
                        <TableCell className="text-right">
                            <MoneyCell value={sub.available} negativeIsRed />
                        </TableCell>
                        <TableCell className="text-right">
                            <CategoryActions
                                cat={{ id: sub.id, name: sub.name, budgeted: sub.budgeted }}
                                rqKey={["budget", userId, month, year]}
                                moneyLeftToAssign={moneyLeftToAssign + sub.budgeted}
                            />
                        </TableCell>
                    </TableRow>
                ))}
        </>
    );
}

// --------------------------
// MONEY CELL HELPER
// --------------------------
function MoneyCell({
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

    const color = negativeIsRed && value < 0 ? "text-red-500" : value == 0 ? undefined : "text-emerald-500";

    return (
        <div className={`text-right tabular-nums ${color}`}>
            {formatted}
        </div>
    );
}