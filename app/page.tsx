"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import { isAuthenticated } from "@/lib/middleware/auth";

export default function Home() {
  const [user, setUser] = useState<{ name: string } | null>(null);

  useEffect(() => {
    if (isAuthenticated()) {
      // In a real app you'd decode token or fetch user data
      setUser({ name: "John Doe" }); // Placeholder name
    }
  }, []);

  return (
    <div>
      <Navbar user={user} />
    </div>
  );
}