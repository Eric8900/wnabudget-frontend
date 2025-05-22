'use client';
import Login from "@/components/Login";
import Navbar from "@/components/Navbar";
import { isAuthenticated } from "@/lib/middleware/auth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
    const router = useRouter();

    useEffect(() => {
        async function loadUser() {
            if (await isAuthenticated()) {
                router.replace("/");
            }
        }

        loadUser();
    }, [router]);

    return (
        <div>
            <Navbar />
            <Login />
        </div>
    );
}
