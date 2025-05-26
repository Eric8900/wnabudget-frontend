"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarFooter,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { clearAuth, getUserId } from "@/lib/middleware/auth";
import Profile from "@/components/Profile";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import AddAccount from "./accounts/AddAccount";
import { AccountsSkeleton } from "./accounts/AccountsSkeleton";
import ManageAccounts from "./accounts/ManageAccounts";
import { useAccounts } from "@/hooks/use-accounts";
import { useRefreshAllBudgets } from "@/hooks/use-budget-data";
import { useMoneyLeftActions } from "@/hooks/use-money-left-actions";

interface AppSidebarProps {
  user: boolean;
}

function AppSidebar({ user }: AppSidebarProps) {
  const userId = getUserId();
  const { data: accounts = [], isLoading: loading } = useAccounts(userId);
  const refreshAllBudgets = useRefreshAllBudgets(userId);
  const { refresh: refreshMoneyLeft } = useMoneyLeftActions(userId);

  return (
    <div>
      <Sidebar>
        <SidebarHeader className="bg-text text-text-foreground">
          <div className="flex items-center justify-between p-4">
            <Link href="/" className="flex items-center space-x-2">
              <div className="text-3xl font-[1000] hover:-rotate-6 hover:scale-110 transition-all tracking-tight">
                WNAB<b className="text-accent">.</b>
              </div>
            </Link>
          </div>
        </SidebarHeader>

        <SidebarContent className="bg-text text-text-foreground">

          {/* Budget Static Button */}
          <div className="p-2 gap-4 flex flex-col">
            <Link href="/app">
              <Button
                variant={"ghost"}
                className="cursor-pointer w-full py-2 px-4 font-medium text-left text-base justify-start"
                onClick={() => {
                  refreshAllBudgets();
                  refreshMoneyLeft();
                }}>
                {/* REFRESH BUDGETS ON CLICK so that only when necessary, refresh it */}
                Budget
              </Button>
            </Link>

            {/* Manage Accounts Button */}
            <ManageAccounts accounts={accounts} />

          </div>

          {/* Accounts Section */}
          <SidebarGroup className="bg-text text-text-foreground">
            <SidebarGroupLabel className="bg-text text-text-foreground">Accounts</SidebarGroupLabel>
            <SidebarGroupContent className="flex flex-col space-y-2 h-full pl-3 mb-5">
              {loading ? (
                <div className="text-sm px-2">
                  <AccountsSkeleton />
                </div>
              ) : accounts.length ? (
                accounts.map((account) => (
                  <Link href={`/app/accounts/${account.id}`} key={account.id}>
                    <Button
                      variant={"ghost"}
                      className="cursor-pointer w-full py-2 px-4 font-medium text-left text-sm justify-start">
                      <div className="flex justify-between w-full">
                        <span>{account.name}</span>
                        <span>${account.balance}</span>
                      </div>
                    </Button>
                  </Link>
                ))
              ) : (
                <div className="text-sm px-2">No accounts found.</div>
              )}
            </SidebarGroupContent>
            {/* Add Account Button */}
            <AddAccount userId={userId!} />
          </SidebarGroup>
        </SidebarContent>

        <SidebarFooter className="bg-text text-text-foreground">
          <SidebarGroup>
            <div className="flex items-center gap-2">
              {user ? (
                <div className="flex items-center space-x-4">
                  <Profile />
                  <Button
                    variant={"default"}
                    onClick={() => {
                      clearAuth();
                      window.location.reload();
                    }}
                    className="cursor-pointer font-bold"
                  >
                    Log out
                  </Button>
                </div>
              ) : (
                <Link
                  href="/login"
                  className="hover:text-accent transition-colors font-bold"
                >
                  Log in
                </Link>
              )}
            </div>
          </SidebarGroup>
        </SidebarFooter>
      </Sidebar>
    </div >
  );
}

export default AppSidebar;