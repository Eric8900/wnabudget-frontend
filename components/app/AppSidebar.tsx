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

interface AppSidebarProps {
  user: boolean;
}

function AppSidebar({ user }: AppSidebarProps) {
  const userId = getUserId();
  const { data: accounts = [], isLoading : loading } = useAccounts(userId);

  return (
    <div>
      <Sidebar>
        <SidebarHeader>
          <div className="flex items-center justify-between p-4">
            <Link href="/" className="flex items-center space-x-2">
              <div className="text-text text-3xl font-[1000] hover:-rotate-6 hover:scale-110 transition-all tracking-tight">
                WNAB<b className="text-accent">.</b>
              </div>
            </Link>
          </div>
        </SidebarHeader>

        <SidebarContent>

          {/* Budget Static Button */}
          <div className="p-2 gap-4 flex flex-col">
            <Link href="/app">
              <button className="cursor-pointer w-full hover:bg-muted transition-all border border-border rounded-md py-2 px-4 font-medium text-left">
                Budget
              </button>
            </Link>

            {/* Manage Accounts Button */}
            <ManageAccounts accounts={accounts} />

          </div>

          {/* Accounts Section */}
          <SidebarGroup>
            <SidebarGroupLabel>Accounts</SidebarGroupLabel>
            <SidebarGroupContent className="flex flex-col space-y-2 h-full">
              {loading ? (
                <div className="text-sm px-2">
                    <AccountsSkeleton/>
                </div>
              ) : accounts.length ? (
                accounts.map((account) => (
                  <Link href={`/app/accounts/${account.id}`} key={account.id}>
                    <div className="flex justify-between text-sm hover:bg-muted px-2 py-3 rounded-xl transition-all">
                      <span>{account.name}</span>
                      <span>${account.balance}</span>
                    </div>
                  </Link>
                ))
              ) : (
                <div className="text-sm px-2">No accounts found.</div>
              )}

              {/* Add Account Button */}
              <AddAccount userId={userId!} />

            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        <SidebarFooter>
          <SidebarGroup>
            <div className="flex items-center gap-2">
              {user ? (
                <div className="flex items-center space-x-4">
                  <Profile className="text-text" />
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
    </div>
  );
}

export default AppSidebar;