import type { Metadata } from "next";
import { Figtree } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from 'next-themes'
import QueryProvider from "@/app/app/query-provider";
import { Toaster } from "@/components/ui/sonner";

const font = Figtree({
  weight: 'variable',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: {
    default: "WNAB",
    template: "%s | WNAB",
  },
  description: "The best app ever.",
  metadataBase: new URL("https://vercel.app"),
  openGraph: {
    title: "WNAB",
    description: "The best app ever.",
    url: "https://vercel.app",
    siteName: "WNAB",
    images: [
      {
        url: "https://vercel.app",
        width: 1000,
        height: 640,
        alt: "WNAB",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "WNAB",
    description: "The best app ever.",
    images: [""],
    creator: "@ericchen890",
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon-96x96.png", sizes: "96x96", type: "image/png" },
      { url: "/web-app-manifest-192x192.png", sizes: "192x192", type: "image/png" },
      { url: "/web-app-manifest-512x512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${font.className} antialiased`}
        suppressHydrationWarning
      >
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <QueryProvider>
          {children}
          </QueryProvider>
          <Toaster/>
        </ThemeProvider>
      </body>
    </html>
  );
}
