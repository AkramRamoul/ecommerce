"use client";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Category } from "@/payload-types";
import { useRef, useState } from "react";
import { useDropdownPosition } from "./use-dropdown-position";
import { SubcategoryMenu } from "./subcategory-menu";

interface Props {
  category: Category;
  isActive?: boolean;
  isHovered?: boolean;
}

export const CategoeyDropdown = ({ category, isActive, isHovered }: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropDownRef = useRef<HTMLDivElement>(null);
  const { getDropdownPosition } = useDropdownPosition(dropDownRef);
  const onMouseEnter = () => {
    if (category.subcategories) {
      setIsOpen(true);
    }
  };

  const onMouseLeave = () => {
    setIsOpen(false);
  };

  const position = getDropdownPosition();
  return (
    <div
      className="relative"
      ref={dropDownRef}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <div className="relative">
        <Button
          variant={"elevated"}
          className={cn(
            "h-11 px-4 bg-transparent border-transparent rounded-full hover:bg-white hover:border-primary text-black ",
            isActive && isHovered && "bg-white border-primary"
          )}
        >
          {category.name}
        </Button>
        {category.subcategories &&
          category.subcategories?.length > 0 &&
          isOpen && (
            <div
              className={cn(
                "opacity-0 absolute -bottom-3 w-0 h-0 border-l-[10px] border-b-[10px] border-r-[10px] border-l-transparent border-r-transparent border-b-black left-1/2 -translate-x-1/2",
                isOpen && "opacity-100"
              )}
            />
          )}
      </div>
      <SubcategoryMenu
        category={category}
        isOpen={isOpen}
        position={position}
      />
    </div>
  );
};
