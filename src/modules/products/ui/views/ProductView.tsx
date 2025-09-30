"use client";

import StarRating from "@/components/star-rating";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { generateTenentUrl } from "@/lib/utils";
import dynamic from "next/dynamic";

import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import { LinkIcon, StarIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Fragment, useState } from "react";
import { toast } from "sonner";

const CartButton = dynamic(
  () => import("../components/cart-button").then((mod) => mod.CartButton),
  {
    ssr: false,
    loading: () => (
      <Button
        variant={"elevated"}
        className="flex-1 bg-rose-400"
        disabled={true}
      >
        Add to cart
      </Button>
    ),
  }
);

interface Props {
  productId: string;
  tenantSlug: string;
}

export const ProductView = ({ productId, tenantSlug }: Props) => {
  const trpc = useTRPC();

  const { data } = useSuspenseQuery(
    trpc.products.getOne.queryOptions({ id: productId })
  );

  const [copied, setCopied] = useState(false);

  return (
    <div className="px-4 lg:px-12 py-10">
      <div className="border rounded-sm bg-white overflow-hidden">
        <div className="relative aspect-[3.9] border-b">
          <Image
            src={data.image?.url || "/pholder.jpg"}
            fill
            alt={data.title}
            className="object-cover"
          />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-6">
          <div className="col-span-4">
            <div className="p-6">
              <h1 className="text-4xl font-medium">{data.title}</h1>
            </div>
            <div className="border-y flex">
              <div className="px-6 py-4 flex items-center justify-center border-r">
                <div className="px-2 py-1 bg-rose-400">
                  <p className="text-base font-medium">
                    DA{data.price.toFixed(2)}
                  </p>
                </div>
              </div>
              <div className="px-6 py-4 flex items-center justify-center lg:border-r ">
                <Link
                  href={generateTenentUrl(tenantSlug)}
                  className="flex items-center gap-2"
                >
                  {data.tenant.image?.url && (
                    <Image
                      src={data.tenant.image?.url}
                      width={20}
                      height={20}
                      alt={data.tenant?.name}
                      className="rounded-full border shrink-0 size-[20px]"
                    />
                  )}
                  <p className="text-base underline font-medium">
                    {data.tenant.name}
                  </p>
                </Link>
              </div>
              <div className="hidden lg:flex px-6 items-center py-4 justify-center">
                <div className="flex items-center gap-2">
                  <StarRating
                    rating={data.reviewRating}
                    iconClassName="size-4"
                  />
                  <p className="text-base font-medium">
                    {data.reviewCount} ratings
                  </p>
                </div>
              </div>
            </div>
            <div className="lg:hidden block px-6 py-4 items-center justify-center border-b">
              <div className="flex items-center gap-2">
                <StarRating rating={data.reviewRating} iconClassName="size-4" />
                <p className="text-base font-medium">
                  {data.reviewCount} ratings
                </p>
              </div>
            </div>
            <div className="p-6">
              {data.description ? (
                <p className="font-medium text-muted-foreground italic">
                  {data.description}
                </p>
              ) : (
                <p>No description provided</p>
              )}
            </div>
          </div>
          <div className="col-span-2">
            <div className="border-t lg:border-t-0 lg:border-l h-full">
              <div className="flex flex-col gap-4 p-6 border-b">
                <div className="flex flex-row items-center gap-2">
                  <CartButton
                    isPurchased={data.isPurchased}
                    tenantSlug={tenantSlug}
                    productId={productId}
                  />
                  <Button
                    className="size-12"
                    variant={"elevated"}
                    onClick={() => {
                      setCopied(true);
                      navigator.clipboard.writeText(window.location.href);
                      toast.success("Product link copied to clipboard");
                      setTimeout(() => setCopied(false), 1000);
                    }}
                    disabled={copied}
                  >
                    <LinkIcon />
                  </Button>
                </div>
                <p className="text-center font-medium">
                  {data.refundPolicy === "no-refunds"
                    ? "No refunds"
                    : `${data.refundPolicy} money back guarantee`}
                </p>
              </div>
              <div className="p-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-medium">Ratings</h3>
                  <div className="flex items-center gap-x-1 font-medium">
                    <StarIcon className="size-4 fill-black" />
                    <p>({data.reviewRating})</p>
                    <p className="text-base">{data.reviewCount} ratings</p>
                  </div>
                </div>
                <div className="grid grid-cols-[auto_1fr_auto] gap-3 mt-4">
                  {[5, 4, 3, 2, 1].map((rating) => (
                    <Fragment key={rating}>
                      {/* Star + label */}
                      <div className="flex items-center gap-2">
                        <StarIcon className="size-4 fill-yellow-500" />
                        <p className="text-base">{rating}</p>
                      </div>

                      {/* Progress bar */}
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <Progress
                          value={data.ratingDistribution[rating]} // percentage value
                          className="h-[1lh]"
                        />
                      </div>

                      {/* Percentage text */}
                      <p className="text-base">
                        {data.ratingDistribution[rating]} %
                      </p>
                    </Fragment>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
