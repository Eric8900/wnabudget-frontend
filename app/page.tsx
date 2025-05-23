"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import { isAuthenticated } from "@/lib/middleware/auth";
import { useRouter } from "next/navigation";

export default function Home() {
  const [user, setUser] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    async function loadUser() {
      if (await isAuthenticated()) {
        setUser(true);
        router.push("/app");
      }
    }

    loadUser();
  }, [router]);

  return (
    <div>
      <Navbar user={user} />
      <div className="flex flex-col items-center justify-center h-screen">
        <h1 className="text-4xl font-bold">Welcome to WNAB.</h1>
      </div>
    </div>
  );
}