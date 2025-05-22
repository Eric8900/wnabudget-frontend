"use client";
import Navbar from "@/components/Navbar";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { isAuthenticated } from "@/lib/middleware/auth";

export default function Home() {
    const [user, setUser] = useState<boolean>(false);
    const router = useRouter();
    
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

    return (
        <div>
            <Navbar user={user} />
        </div>
    );
}