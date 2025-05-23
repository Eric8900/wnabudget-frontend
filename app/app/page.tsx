"use client";
import {
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getUserId, isAuthenticated } from "@/lib/middleware/auth";
import AppSidebar from "@/components/app/AppSidebar";
import CreateCategory from "@/components/app/CreateCategory";
import { api } from "@/lib/middleware/api";
import { toast } from "sonner";

export default function Home() {
  const [user, setUser] = useState<boolean>(false);
  const router = useRouter();
  const userId = getUserId();
  const [moneyLeftToAssign, setMoneyLeftToAssign] = useState<number>(0);

  const fetchMoneyLeftToAssign = async () => {
    try {
      const money = await api.get<number>(`/categories/left-to-assign/${userId}`);
      setMoneyLeftToAssign(money);
    } catch {
      toast.error("Failed to fetch available budget");
    }
  };

  useEffect(() => {
    if (userId) {
      fetchMoneyLeftToAssign();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);


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

  return (
    <div>
      <SidebarProvider>
        <AppSidebar user={user} refreshMoneyLeft={fetchMoneyLeftToAssign} />

        {/* Main content */}
        <main className="flex-1 min-w-100vh">
          {/* Header */}
          <div className="flex lg:flex-row flex-col px-4 py-2 bottom-0 lg:gap-10 gap-5">
            <SidebarTrigger className="h-4 w-4 mt-2" />
            <div className={`flex items-center justify-between ${moneyLeftToAssign < 0 ? "bg-red-300" : "bg-emerald-200"} gap-10 rounded-xl p-4`}>
              <div>
                <span className="font-extrabold text-xl">${moneyLeftToAssign.toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}</span> <br/>
                Ready to Assign
              </div>
              <CreateCategory
                userId={userId!}
                moneyLeftToAssign={moneyLeftToAssign}
                onCreated={fetchMoneyLeftToAssign} />
            </div>
          </div>
        </main>
      </SidebarProvider>
    </div>
  );
}