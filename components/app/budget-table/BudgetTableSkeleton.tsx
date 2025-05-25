// components/BudgetTableSkeleton.tsx
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
import React from "react";

export default function BudgetTableSkeleton() {
    const groups = 3;
    const subsPerGroup = 3;

    return (
        <div className="w-full mx-auto animate-pulse">
            {/* ── month navigator skeleton ─────────────────────────────────── */}
            <h2 className="p-4 text-xl font-semibold">
                <div className="flex items-center justify-center gap-2 ml-4">
                    {/* left chevron */}
                    <Skeleton className="h-9 w-9 rounded" />
                    {/* Month of … */}
                    <div className="flex flex-col gap-2 items-center justify-center">
                        <Skeleton className="h-5 w-16" />
                        <Skeleton className="h-8 w-32" />
                    </div>
                    {/* right chevron */}
                    <Skeleton className="h-9 w-9 rounded" />
                </div>
            </h2>

            {/* ── table skeleton ──────────────────────────────────────────── */}
            <div className="w-full bg-white overflow-x-auto">
                <Table className="lg:text-xl text-base">
                    {/* header */}
                    <TableHeader>
                        <TableRow className="text-sm text-neutral-600">
                            <TableHead className="w-full pl-8">
                                <Skeleton className="h-4 w-24" />
                            </TableHead>
                            <TableHead className="text-center hidden md:table-cell">
                                <Skeleton className="h-4 w-20 mx-auto" />
                            </TableHead>
                            <TableHead className="text-center hidden md:table-cell">
                                <Skeleton className="h-4 w-20 mx-auto" />
                            </TableHead>
                            <TableHead className="text-center">
                                <Skeleton className="h-4 w-20 mx-auto" />
                            </TableHead>
                            <TableHead className="text-right w-28">
                                <Skeleton className="h-4 w-4 ml-auto" />
                            </TableHead>
                        </TableRow>
                    </TableHeader>

                    {/* body */}
                    <TableBody>
                        {Array.from({ length: groups }).map((_, g) => (
                            <React.Fragment key={g}>
                                {/* master-category row */}
                                <TableRow className="bg-muted font-extrabold hover:bg-muted/70">
                                    <TableCell className="py-4">
                                        <div className="flex items-center gap-2">
                                            {/* chevron icon */}
                                            <Skeleton className="h-4 w-4" />
                                            <Skeleton className="h-4 w-48" />
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-right hidden md:table-cell py-4">
                                        <Skeleton className="h-4 w-24 ml-auto" />
                                    </TableCell>
                                    <TableCell className="text-right hidden md:table-cell py-4">
                                        <Skeleton className="h-4 w-24 ml-auto" />
                                    </TableCell>
                                    <TableCell className="text-right py-4">
                                        <Skeleton className="h-4 w-24 ml-auto" />
                                    </TableCell>
                                    <TableCell className="text-right py-4">
                                        {/* tiny action dots / menu */}
                                        <Skeleton className="h-4 w-4 ml-auto" />
                                    </TableCell>
                                </TableRow>

                                {/* sub-category rows */}
                                {Array.from({ length: subsPerGroup }).map((_, s) => (
                                    <TableRow key={s}>
                                        <TableCell className="pl-8 py-3">
                                            <Skeleton className="h-4 w-40" />
                                        </TableCell>
                                        <TableCell className="text-right hidden md:table-cell py-3">
                                            <Skeleton className="h-4 w-24 ml-auto" />
                                        </TableCell>
                                        <TableCell className="text-right hidden md:table-cell py-3">
                                            <Skeleton className="h-4 w-24 ml-auto" />
                                        </TableCell>
                                        <TableCell className="text-right py-3">
                                            <Skeleton className="h-4 w-24 ml-auto" />
                                        </TableCell>
                                        <TableCell className="text-right py-3">
                                            <Skeleton className="h-4 w-4 ml-auto" />
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </React.Fragment>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}