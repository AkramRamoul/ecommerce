"use client";

import { Poppins } from "next/font/google";
import Link from "next/link";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import React, { useState } from "react";
import { usePathname } from "next/navigation";
import NavBarSideBar from "./nav-sidebar";
import { MenuIcon } from "lucide-react";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["700"],
});

interface NavItemProps {
  children: React.ReactNode;
  href: string;
  isActive?: boolean;
}

const NavItem = ({ children, href, isActive }: NavItemProps) => {
  return (
    <Button
      asChild
      className={cn(
        "bg-transparent hover:bg-transparent rounded-full hover:border-primary border-transparent px-3.5 text-lg",
        isActive && "bg-black text-white hover:bg-black hover:text-white"
      )}
      disabled={isActive}
      variant={"outline"}
    >
      <Link href={href}>{children}</Link>
    </Button>
  );
};

const navBarItems = [
  { href: "/", children: "Home" },
  { href: "/about", children: "About" },
  { href: "/features", children: "Featurs" },
  { href: "/pricing", children: "Pricing" },
  { href: "/contact", children: "Contact" },
];

export const NavBar = () => {
  const pathname = usePathname();
  const [isSideBarOpen, setIsSideBarOpen] = useState(false);

  return (
    <nav className="h-20 flex border-b justify-between font-medium bg-white">
      <Link href="/" className="pl-6 flex items-center">
        <span className={cn("text-5xl font-semibold", poppins.className)}>
          MultiCart
        </span>
      </Link>
      <NavBarSideBar
        items={navBarItems}
        open={isSideBarOpen}
        onOpenChange={setIsSideBarOpen}
      />

      <div className="items-center gap-4 hidden lg:flex">
        {navBarItems.map((item) => (
          <NavItem
            key={item.href}
            href={item.href}
            isActive={pathname === item.href}
          >
            {item.children}
          </NavItem>
        ))}
      </div>

      <div className="hidden lg:flex">
        <Button
          asChild
          className="border-l border-t-0 border-b-0 border-r-0 px-12 rounded-none h-full bg-white hover:bg-rose-400 transition-colors text-lg"
          variant={"secondary"}
        >
          <Link prefetch href="/sign-in">
            Login
          </Link>
        </Button>
        <Button
          asChild
          className="border-l border-t-0 border-b-0 border-r-0 px-12  h-full rounded-none bg-black
          text-white hover:bg-rose-400 hover:text-black transition-colors text-lg"
          variant={"secondary"}
        >
          <Link prefetch href="sign-up">
            Start Selling
          </Link>
        </Button>
      </div>
      <div className="flex lg:hidden justify-center items-center">
        <Button
          variant={"ghost"}
          className="size-12 border-transparent bg-white"
          onClick={() => setIsSideBarOpen(true)}
        >
          <MenuIcon />
        </Button>
      </div>
    </nav>
  );
};
