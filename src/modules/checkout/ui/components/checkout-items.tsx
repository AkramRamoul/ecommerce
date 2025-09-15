interface Props {
  isLast?: boolean;
  productPrice: number;
  name: string;
  productUrl: string;
  image?: string | null;
  tenantUrl: string;
  tenantName: string;
  onRemove: () => void;
}

import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import React from "react";

function CheckoutItem({
  isLast,
  productPrice,
  name,
  productUrl,
  image,
  tenantName,
  tenantUrl,
  onRemove,
}: Props) {
  return (
    <div
      className={cn(
        "grid grid-cols-[8.5rem_1fr_auto] gap-4 pr-4 border-b",
        isLast && "border-b-0"
      )}
    >
      <div className="overflow-hidden border-r">
        <div className="relative aspect-square h-full">
          <Image
            src={image || "/pholder.jpg"}
            alt={name}
            fill
            className="object-cover"
          />
        </div>
      </div>
      <div className="py-4 flex flex-col justify-between">
        <div>
          <Link href={productUrl}>
            <h4 className="font-bold underline">{name}</h4>
          </Link>
          <Link href={tenantUrl}>
            <p className="font-medium underline">{tenantName}</p>
          </Link>
        </div>
      </div>
      <div className="py-4 flex flex-col justify-between">
        <p className="font-medium">DA {productPrice.toFixed(2)}</p>
        <button
          className="font-medium underline cursor-pointer"
          onClick={onRemove}
          type="button"
        >
          Remove
        </button>
      </div>
    </div>
  );
}

export default CheckoutItem;
