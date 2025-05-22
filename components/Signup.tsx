"use client";

import { signup } from "@/lib/middleware/auth";
import { LogIn, Mail, LockIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "./ui/input";

export default function Signup() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const router = useRouter();
    const API_URL = process.env.NEXT_PUBLIC_API_URL;

    const validateEmail = (email: string) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    };

    const handleSignIn = async () => {
        if (!email || !password) {
            setError("Please enter both email and password.");
            return;
        }
        if (!validateEmail(email)) {
            setError("Please enter a valid email address.");
            return;
        }
        setError("");
        try {
            await signup(email, password);
            router.push("/login");
        } catch (err: unknown) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError("An unexpected error occurred.");
            }
        }
    };

    return (
        <div className="min-h-screen w-full flex items-center justify-center rounded-xl z-1 px-2">
            <div className="w-full max-w-sm bg-white rounded-3xl shadow-xl/10 p-8 flex flex-col items-center border border-accent/50">
                <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-white mb-6 shadow-lg/5">
                    <LogIn className="w-7 h-7" />
                </div>
                <h2 className="text-2xl font-bold mb-2 text-center">
                    Sign up with email
                </h2>
                <p className="text-gray-500 text-sm mb-6 text-center">
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Accusamus, numquam.
                </p>
                <div className="w-full flex flex-col gap-3 mb-2">
                    <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                            <Mail className="w-4 h-4" />
                        </span>
                        <Input
                            placeholder="Email"
                            type="email"
                            value={email}
                            className="w-full pl-10 pr-3 py-4 rounded-xl border border-gray-200 text-sm font-medium"
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                            <LockIcon className="w-4 h-4" />
                        </span>
                        <Input
                            placeholder="Password"
                            type="password"
                            value={password}
                            className="w-full pl-10 pr-3 py-4 rounded-xl border border-gray-200 text-sm font-medium"
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 cursor-pointer text-xs select-none"></span>
                    </div>
                    {error && (
                        <div className="text-sm text-red-500 text-left">{error}</div>
                    )}
                </div>
                <button
                    onClick={handleSignIn}
                    className="w-full bg-primary font-medium py-2 rounded-xl shadow hover:brightness-105 cursor-pointer transition mb-4 mt-2"
                >
                    Sign Up
                </button>
                <div className="flex items-center w-full my-2">
                    <div className="flex-grow border-t border-dashed border-gray-200"></div>
                    <span className="mx-2 text-xs text-gray-400">Or sign in with</span>
                    <div className="flex-grow border-t border-dashed border-gray-200"></div>
                </div>
                <div className="flex gap-3 w-full justify-center mt-2">
                    <Link href={`${API_URL}/oauth2/authorization/google`} className="grow w-full flex">
                        <button className="flex items-center justify-center w-12 h-12 rounded-xl border bg-white hover:bg-gray-100 transition grow">
                            <Image
                                src="https://www.svgrepo.com/show/475656/google-color.svg"
                                alt="Google"
                                width={24}
                                height={24}
                                className="w-6 h-6"
                            />
                        </button>
                    </Link>
                </div>
            </div>
        </div>
    );
};