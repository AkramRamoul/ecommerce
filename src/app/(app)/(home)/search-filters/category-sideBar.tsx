import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { CustomCat } from "../types";
import { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  data: CustomCat[];
}

export const CategorySideBar = ({ open, onOpenChange, data }: Props) => {
  const [parentCategories, setParentCategories] = useState<CustomCat[] | null>(
    null
  );
  const [selectedCategory, setSelectedCategory] = useState<CustomCat | null>(
    null
  );

  const currentCategories = parentCategories ?? data ?? [];

  const router = useRouter();

  const handleOpenChange = (open: boolean) => {
    setSelectedCategory(null);
    setParentCategories(null);
    onOpenChange(open);
  };
  const handleClick = (category: CustomCat) => {
    if (category.subcategories && category.subcategories.length > 0) {
      setParentCategories(category.subcategories as CustomCat[]);
      setSelectedCategory(category);
    } else {
      if (parentCategories && selectedCategory) {
        router.push(`/${selectedCategory.slug}/${category.slug}`);
      } else {
        if (category.slug === "all") {
          router.push("/");
        } else {
          router.push(`/${category.slug}`);
        }
      }
      handleOpenChange(false);
    }
  };

  const bgColor = selectedCategory?.color || "white";

  const handleBackClick = () => {
    if (parentCategories) {
      setParentCategories(null);
      setSelectedCategory(null);
    }
  };

  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      <SheetContent
        side="left"
        className="p-0 transition-none"
        style={{ backgroundColor: bgColor }}
      >
        <SheetHeader className="p-4 border-b">
          <SheetTitle>Categories</SheetTitle>
        </SheetHeader>
        <ScrollArea className="h-full flex flex-col overflow-y-auto pb-2">
          {parentCategories && (
            <button
              onClick={handleBackClick}
              className="w-full text-left p-4 hover:bg-black hover:text-white flex items-center text-base font-medium cursor-pointer"
            >
              <ChevronLeft className="size-4 mr-2" />
              Back
            </button>
          )}
          {currentCategories.map((category: CustomCat) => (
            <button
              key={category.slug}
              onClick={() => handleClick(category)}
              className="w-full text-left p-4 hover:bg-black hover:text-white flex items-center text-base justify-between font-medium cursor-pointer"
            >
              {category.name}
              {category.subcategories && category.subcategories.length > 0 && (
                <ChevronRight className="size-4" />
              )}
            </button>
          ))}
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
};
