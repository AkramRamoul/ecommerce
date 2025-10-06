"use client";

import { generateTenentUrl } from "@/lib/utils";
import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import React from "react";

import dynamic from "next/dynamic";
import { Button } from "@/components/ui/button";
import { ShoppingCartIcon } from "lucide-react";

const CheckoutButton = dynamic(
  () =>
    import("@/modules/checkout/ui/components/checkout-button").then(
      (mod) => mod.CheckoutButton
    ),
  {
    ssr: false,
    loading: () => (
      <Button className="bg-white" disabled={true}>
        <ShoppingCartIcon className="text-black" />
      </Button>
    ),
  }
);

interface Props {
  slug: string;
}

export const Navbar = ({ slug }: Props) => {
  const trpc = useTRPC();
  const { data } = useSuspenseQuery(
    trpc.tenants.getOne.queryOptions({
      slug,
    })
  );
  console.log(data);
  return (
    <nav className="h-20 border-b font-medium bg-white">
      <div className="max-w-(--breakpoint-xl) mx-auto flex justify-between items-center h-full px-4 lg:px-12 ">
        <Link
          href={generateTenentUrl(slug)}
          className="flex items-center gap-2"
        >
          {data.image?.url && (
            <Image
              src={data.image.url}
              className="rounded-full border shrink-0 size-[32px]"
              width={32}
              height={32}
              alt={slug}
            />
          )}
          <p className="text-xl">{data.name.toUpperCase()}&apos;s store </p>
        </Link>
        <CheckoutButton tenantSlug={data.slug} hideIfEmpty />
      </div>
    </nav>
  );
};

export const TenantNavBarSkeleton = () => {
  return (
    <nav className="h-20 border-b font-medium bg-white">
      <div className="max-w-(--breakpoint-xl) mx-auto flex justify-between items-center h-full px-4 lg:px-12 ">
        <div />
        <Button className="bg-white" disabled={true}>
          <ShoppingCartIcon className="text-black" />
        </Button>
      </div>
    </nav>
  );
};
