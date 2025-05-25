// components/TableSkeleton.tsx
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

export default function TransactionTableSkeleton() {
  const placeholderRows = 6;

  return (
    <div className="w-full mx-auto animate-pulse">
      {/* ── heading skeleton ─────────────────────────────────────────────── */}
      <div className="p-4">
        {/* width roughly equals the real “Transactions” string */}
        <Skeleton className="h-7 w-40" />
      </div>

      {/* ── table skeleton ──────────────────────────────────────────────── */}
      <div className="w-full bg-white overflow-x-auto">
        <Table className="lg:text-xl text-base">
          {/* header */}
          <TableHeader>
            <TableRow className="text-sm text-neutral-600">
              <TableHead className="text-center w-24">
                <Skeleton className="h-4 w-16 mx-auto" />
              </TableHead>
              <TableHead className="text-right">
                <Skeleton className="h-4 w-20 ml-auto" />
              </TableHead>
              <TableHead className="w-full">
                <Skeleton className="h-4 w-28" />
              </TableHead>
              <TableHead className="w-36 hidden md:table-cell">
                <Skeleton className="h-4 w-24" />
              </TableHead>
              {/* empty header for actions */}
              <TableHead className="text-right w-12">
                <Skeleton className="h-4 w-4 ml-auto" />
              </TableHead>
            </TableRow>
          </TableHeader>

          {/* body */}
          <TableBody>
            {Array.from({ length: placeholderRows }).map((_, i) => (
              <TableRow key={i} className="hover:bg-muted/50">
                {/* cleared ▸ checkbox */}
                <TableCell className="text-center py-3">
                  <Skeleton className="h-5 w-5 mx-auto rounded" />
                </TableCell>

                {/* amount */}
                <TableCell className="text-right py-3">
                  <Skeleton className="h-4 w-24 ml-auto" />
                </TableCell>

                {/* category */}
                <TableCell className="py-3">
                  <Skeleton className="h-4 w-40" />
                </TableCell>

                {/* date (md+) */}
                <TableCell className="py-3 hidden md:table-cell">
                  <Skeleton className="h-4 w-24" />
                </TableCell>

                {/* -- two tiny action icons: peek + delete (md+) */}
                <TableCell className="text-right py-3 hidden md:table-cell">
                  <Skeleton className="h-4 w-4 ml-auto" />
                </TableCell>
                <TableCell className="text-right py-3">
                  <Skeleton className="h-4 w-4 ml-auto" />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}