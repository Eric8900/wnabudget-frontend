"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function OAuthSuccessPage() {
    const searchParams = useSearchParams();
    const router = useRouter();

    useEffect(() => {
        const token = searchParams.get("token");
        const userId = searchParams.get("user_id");

        if (token && userId) {
            localStorage.setItem("access_token", token);
            localStorage.setItem("user_id", userId);
            router.push("/");
        } else {
            router.push("/");
        }
    }, [searchParams, router]);

    return <>
        <div className="min-h-screen flex justify-center items-center text-4xl">Logging in&nbsp;<LoadingDots /></div>
    </>;
}

const LoadingDots = () => {
    return (
        <div className="flex items-center justify-center gap-1 mb-7">
            <div className='animate-bounce [animation-delay:-0.3s] h-3'>.</div>
            <div className='animate-bounce [animation-delay:-0.15s] h-3'>.</div>
            <div className='animate-bounce h-3'>.</div>
        </div>
    );
};