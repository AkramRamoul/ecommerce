import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import Link from "next/link";

interface NavBarItems {
  href: string;
  children: React.ReactNode;
}

interface sidebarProps {
  items: NavBarItems[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
}
const NavBarSideBar = ({ items, open, onOpenChange }: sidebarProps) => {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="left" className="p-0 transition-none">
        <SheetHeader className="p-4 border-b">
          <SheetTitle>Menu</SheetTitle>
        </SheetHeader>
        <ScrollArea className="h-full flex flex-col overflow-y-auto pb-2">
          {items.map((item) => (
            <Link
              href={item.href}
              key={item.href}
              className="p-4 w-full text-left hover:bg-black hover:text-white flex items-center text-base font-medium"
              onClick={() => onOpenChange(false)}
            >
              {item.children}
            </Link>
          ))}
          <div className="border-t">
            <Link
              href="/sign-in"
              className="p-4 w-full text-left hover:bg-black hover:text-white flex items-center text-base font-medium"
              onClick={() => onOpenChange(false)}
            >
              Login
            </Link>
            <Link
              href="/sign-up"
              className="p-4 w-full text-left hover:bg-black hover:text-white flex items-center text-base font-medium"
              onClick={() => onOpenChange(false)}
            >
              Start Selling
            </Link>
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
};

export default NavBarSideBar;
