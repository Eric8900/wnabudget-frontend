import Link from "next/link";
import React from "react";
import Profile from "./Profile";
import { clearAuth } from "@/lib/middleware/auth";
import { Button } from "./ui/button";

interface NavbarProps {
    user?: boolean;
}

const Navbar: React.FC<NavbarProps> = ({ user = false }) => {
    return (
        <nav className="w-full flex items-center justify-between px-2 sm:px-8 md:px-28 py-4 shadow-none bg-text">
            <Link href="/" className="flex items-center space-x-2">
                <div className="text-text-foreground text-3xl font-[1000] hover:-rotate-6 hover:scale-110 transition-all tracking-tight">
                    WNAB<b className="text-accent">.</b>
                </div>
            </Link>
            <div className="flex items-center space-x-6">
                <Link
                    href="/app"
                    className="text-text-foreground hover:text-accent transition-colors font-bold"
                >
                    Dashboard
                </Link>
                {user ? (
                    <div className="flex items-center space-x-4">
                        <Profile className="text-text-foreground"/>
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
                        className="text-text-foreground hover:text-accent transition-colors font-bold"
                    >
                        Log in
                    </Link>
                )}
            </div>
        </nav>
    );
};

export default Navbar;