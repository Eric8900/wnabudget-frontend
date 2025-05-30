"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import { isAuthenticated } from "@/lib/middleware/auth";
import { useRouter } from "next/navigation";
import Hero from "@/components/landing/Hero";
import Footer from "@/components/landing/Footer";

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
      <Hero/>
      <Footer/>
    </div>
  );
}