"use client";
import {
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getUserId, isAuthenticated } from "@/lib/middleware/auth";
import AppSidebar from "@/components/app/AppSidebar";
import { useParams } from "next/navigation";
import AddTransaction from "@/components/app/accounts/AddTransaction";
import TransactionsTable from "@/components/app/account-table/transaction-table";

export default function Home() {
  const [user, setUser] = useState<boolean>(false);
  const router = useRouter();
  const { account_id } = useParams();
  const userId = getUserId();

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
  }, [router]);

  if (!userId || userId == null) return <div></div>;

  return (
    <div>
      <SidebarProvider>
          <AppSidebar user={user} />

          {/* Main content */}
          <main className="flex-1 min-w-100vh bg-white">
            {/* Header */}
            <div className="flex px-4 py-2 bottom-0 gap-10">
              <SidebarTrigger className="h-4 w-4 mt-2" />
              <AddTransaction userId={userId!} accountId={account_id as string} />
            </div>
            <TransactionsTable userId={userId} accountId={account_id as string} />
          </main>
      </SidebarProvider>
    </div>
  );
}