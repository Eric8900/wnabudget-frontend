import Link from "next/link";
import React from "react";

interface NavbarProps {
    user?: {
        name: string;
    } | null;
}

const Navbar: React.FC<NavbarProps> = ({ user }) => {
    return (
        <nav className="w-full flex items-center justify-between px-8 py-4 shadow-none bg-text">
            <Link href="/" className="flex items-center space-x-2">
                <div className="text-text-foreground text-2xl font-[1000] hover:-rotate-6 hover:scale-110 transition-all tracking-tight">
                    WNAB<b className="text-accent">.</b>
                </div>
            </Link>
            <div className="flex items-center space-x-6">
                <Link
                    href="/dashboard"
                    className="text-text-foreground hover:text-accent transition-colors font-bold"
                >
                    Dashboard
                </Link>
                {user ? (
                    <span className="text-text-foreground hover:text-accent font-bold">
                        {user.name}
                    </span>
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