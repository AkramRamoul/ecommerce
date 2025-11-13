import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import "./globals.css";
import { TRPCReactProvider } from "@/trpc/client";
import { Toaster } from "@/components/ui/sonner";
import { NuqsAdapter } from "nuqs/adapters/next/app";

const dmsans = DM_Sans({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Ecom Road",
  description: "A mullti-tenant e-commerce platform .",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${dmsans.className} antialiased`}>
        <TRPCReactProvider>
          <NuqsAdapter>{children}</NuqsAdapter>
          <Toaster />
        </TRPCReactProvider>
      </body>
    </html>
  );
}
