"use client";
import {
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { getUserId, isAuthenticated } from "@/lib/middleware/auth";
import AppSidebar from "@/components/app/AppSidebar";
import CreateCategory from "@/components/app/CreateCategory";
import BudgetTable from "@/components/app/budget-table/data-table";
import { useMoneyLeft } from "@/hooks/use-money-left";
import CreateCategoryGroup from "@/components/app/CreateCategoryGroup";

export default function Home() {
  const [user, setUser] = useState<boolean>(false);
  const router = useRouter();
  const userId = getUserId();

  const { data: moneyLeftToAssign = 0 } = useMoneyLeft(userId);

  const params = useSearchParams();
  const month = Number(params.get('month') ?? new Date().getMonth() + 1);
  const year = Number(params.get('year') ?? new Date().getFullYear());

  useEffect(() => {
    async function loadUser() {
      if (await isAuthenticated()) {
        setUser(true);
      }
      else {
        router.replace("/login");
      }
    }

    loadUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!userId || userId == null) return <div></div>;

  return (
    <div>
      <SidebarProvider>
        <AppSidebar user={user} />

        {/* Main content */}
        <main className="flex flex-col w-full bg-white">
          {/* Header */}
          <div className="flex lg:flex-row flex-col px-4 py-2 bottom-0 lg:gap-10 gap-5">
            <SidebarTrigger className="h-4 w-4 mt-2" />
            <CreateCategoryGroup userId={userId!} className="text-base lg:hidden" />
            <div className={`flex items-center justify-between ${moneyLeftToAssign < 0 ? "bg-red-300" : "bg-emerald-200"} gap-10 rounded-xl p-4`}>
              <CreateCategoryGroup userId={userId!} className="hidden lg:flex" />
                <div>
                  <span className="font-extrabold text-xl">${moneyLeftToAssign.toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}</span> <br />
                  Ready to Assign
                </div>
                <CreateCategory
                  userId={userId!}
                  moneyLeftToAssign={moneyLeftToAssign} />
            </div>
          </div>
          <BudgetTable userId={userId as string} month={month} year={year} moneyLeftToAssign={moneyLeftToAssign} />
        </main>
      </SidebarProvider>
    </div>
  );
}