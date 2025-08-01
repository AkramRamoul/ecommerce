"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface PriceFilterProps {
  minPrice?: string | null;
  maxPrice?: string | null;
  onMinPriceChange: (value: string) => void;
  onMaxPriceChange: (value: string) => void;
}

export const formatAsCurrency = (value: string) => {
  const numeric = value.replace(/[^0-9.-]+/g, "");
  const parsed = parseFloat(numeric);
  if (isNaN(parsed)) return "";
  const formatted = new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(parsed);
  return `DA ${formatted}`;
};

export const PriceFilter = ({
  maxPrice,
  minPrice,
  onMaxPriceChange,
  onMinPriceChange,
}: PriceFilterProps) => {
  const handleMinPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/[^0-9]/g, "");
    onMinPriceChange(raw);
  };

  const handleMaxPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/[^0-9]/g, "");
    onMaxPriceChange(raw);
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-col gap-2">
        <Label className="text-base font-medium">Min Price</Label>
        <Input
          type="text"
          onChange={handleMinPriceChange}
          value={minPrice ? formatAsCurrency(minPrice) : ""}
          placeholder="DA 0"
        />
      </div>
      <div className="flex flex-col gap-2">
        <Label className="text-base font-medium">Max Price</Label>
        <Input
          type="text"
          onChange={handleMaxPriceChange}
          value={maxPrice ? formatAsCurrency(maxPrice) : ""}
          placeholder="DA 1000"
        />
      </div>
    </div>
  );
};
