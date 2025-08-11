import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Newly - Create Beautiful Wedding RSVP Pages",
  description: "Elegant. Simple. Paperless. Everything you need to invite guests beautifully.",
  keywords: ["wedding", "RSVP", "event planning", "guest management", "wedding invitations"],
  authors: [{ name: "Newly" }],
  openGraph: {
    title: "Newly - Create Beautiful Wedding RSVP Pages",
    description: "Elegant. Simple. Paperless. Everything you need to invite guests beautifully.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={inter.className}>
          {children}
          <Toaster />
        </body>
      </html>
    </ClerkProvider>
  );
}
