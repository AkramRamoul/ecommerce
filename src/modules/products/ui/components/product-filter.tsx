"use client";

import { cn } from "@/lib/utils";
import { ChevronDown, ChevronRight } from "lucide-react";
import { useState } from "react";
import { PriceFilter } from "./priceFilter";
import { useProductFilters } from "../../hooks/use-product-filters";
import { TagsFIlter } from "./tagsFilter";

interface ProductFiltersProps {
  title: string;
  className?: string;
  children: React.ReactNode;
}
const ProductFilter = ({ title, className, children }: ProductFiltersProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const Icon = isOpen ? ChevronDown : ChevronRight;

  return (
    <div className={cn("p-4 border-b flex flex-col gap-2", className)}>
      <div
        className="cursor-pointer flex items-center justify-between"
        onClick={() => setIsOpen((current) => !current)}
      >
        <p className="font-medium">{title}</p>
        <Icon className="size-5" />
      </div>
      {isOpen && children}
    </div>
  );
};
export const ProductFilters = () => {
  const [filters, setFilters] = useProductFilters();
  const onChange = (key: keyof typeof filters, value: unknown) => {
    setFilters({ ...filters, [key]: value });
  };

  const hasFilters = Object.values(filters).some(
    (value) => value !== "" && value !== undefined
  );

  const onClear = () => {
    setFilters({
      minPrice: "",
      maxPrice: "",
      tags: [],
    });
  };

  return (
    <div className="border rounded-md bg-white ">
      <div className="p-4 border-b flex items-center justify-between ">
        <p className="font-medium">Filters</p>
        {hasFilters && (
          <button
            className="underline cursor-pointer"
            onClick={onClear}
            type="button"
          >
            Clear
          </button>
        )}
      </div>
      <ProductFilter title="Price">
        <PriceFilter
          minPrice={filters.minPrice}
          maxPrice={filters.maxPrice}
          onMinPriceChange={(value) => onChange("minPrice", value)}
          onMaxPriceChange={(value) => onChange("maxPrice", value)}
        />
      </ProductFilter>

      <ProductFilter title="Tags" className="border-b-0">
        <TagsFIlter
          value={filters.tags}
          onChange={(value) => onChange("tags", value)}
        />
      </ProductFilter>
    </div>
  );
};
