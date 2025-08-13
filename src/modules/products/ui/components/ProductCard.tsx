import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { generateTenentUrl } from "@/lib/utils";

interface ProductCardProps {
  id: string;
  name: string;
  imageUrl?: string | null;
  tenantUsername: string;
  tenantImageUrl?: string | null;
  reviewRating: number;
  reviewCount: number;
  price: number;
}

export const ProductCard = ({
  id,
  name,
  imageUrl,
  tenantUsername,
  tenantImageUrl,
  reviewRating,
  reviewCount,
  price,
}: ProductCardProps) => {
  const router = useRouter();

  const handleRedirect = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();

    router.push(generateTenentUrl(tenantUsername));
  };

  return (
    <Link href={`/products/${id}`} className="no-underline">
      <div
        className="border rounded-md bg-white overflow-hidden h-full flex flex-col
      hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transtition-shadow"
      >
        <div className="relative aspect-square">
          <Image
            src={imageUrl || "/authbg.png"}
            alt={name}
            fill
            className="object-cover"
          />
        </div>
        <div className="p-4 flex flex-col border-y gap-3 flex-1">
          <h2 className="text-lg font-medium line-clamp-4">{name}</h2>
          <div className="flex items-center gap-2" onClick={handleRedirect}>
            {tenantImageUrl && (
              <Image
                src={tenantImageUrl}
                alt={tenantUsername}
                width={16}
                height={16}
                className="rounded-full border shrink-0 size-[16px]"
              />
            )}

            <p className="text-sm font-medium underline">{tenantUsername}</p>
          </div>
          {reviewCount > 0 && (
            <div className="flex items-center gap-1">
              <span className="text-yellow-500">
                {"★"
                  .repeat(reviewRating)
                  .padEnd(5, "☆")
                  .split("")
                  .map((star, index) => (
                    <span key={index}>{star}</span>
                  ))}
              </span>
              <p className="text-sm font-medium">({reviewCount})</p>
            </div>
          )}
        </div>
        <div className="p-4 ">
          <div className="relartive px-2 py-1 border bg-rose-400 w-fit">
            <p className="text-sm font-medium">DA{price.toFixed(2)}</p>
          </div>
        </div>
      </div>
    </Link>
  );
};

export const ProductCardSkeleton = () => {
  return (
    <div className="w-full aspect-3/4 bg-neutral-200 rounded-lg animate-pulse"></div>
  );
};
