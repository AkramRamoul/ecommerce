"use client";

import React from "react";
import { useProductFilters } from "../../hooks/use-product-filters";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const ProductSort = () => {
  const [filters, setFilters] = useProductFilters();

  return (
    <div className="flex items-center gap-2 ">
      <Button
        size="sm"
        className={cn(
          "rounded-full bg-white hover:bg-white",
          filters.sort !== "default" &&
            "bg-transparent border-transparent hover:border-border hover:bg-transparent"
        )}
        onClick={() => setFilters({ sort: "default" })}
        variant={"secondary"}
      >
        Default
      </Button>
      <Button
        size="sm"
        className={cn(
          "rounded-full bg-white hover:bg-white",
          filters.sort !== "newest" &&
            "bg-transparent border-transparent hover:border-border hover:bg-transparent"
        )}
        onClick={() => setFilters({ sort: "newest" })}
        variant={"secondary"}
      >
        Newest
      </Button>
      <Button
        size="sm"
        className={cn(
          "rounded-full bg-white hover:bg-white",
          filters.sort !== "oldest" &&
            "bg-transparent border-transparent hover:border-border hover:bg-transparent"
        )}
        onClick={() => setFilters({ sort: "oldest" })}
        variant={"secondary"}
      >
        Oldest
      </Button>
    </div>
  );
};
