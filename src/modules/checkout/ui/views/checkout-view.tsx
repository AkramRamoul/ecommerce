"use client";

import { useEffect } from "react";

import { toast } from "sonner";

import { useTRPC } from "@/trpc/client";
import { useQuery } from "@tanstack/react-query";

import { useCart } from "../../hooks/use-cart";
import { generateTenentUrl } from "@/lib/utils";
import CheckoutItem from "../components/checkout-items";
import { CheckoutSideBar } from "../components/checkou-sidebar";

interface Props {
  tenantSlug: string;
}
export const CheckoutView = ({ tenantSlug }: Props) => {
  const { productIds, clearAllCarts, removeProduct } = useCart(tenantSlug);

  const trpc = useTRPC();
  const { data, error } = useQuery(
    trpc.checkout.getProduct.queryOptions({
      ids: productIds,
    })
  );
  useEffect(() => {
    if (error?.data?.code === "NOT_FOUND") {
      clearAllCarts();
      toast.warning("Invalid products in cart. Cart cleared.");
    }
  }, [error, clearAllCarts]);

  return (
    <div className="lg:pt-16 pt-4 px-4 lg:px-12 ">
      <div className="grid grid-cols-1 lg:grid-cols-7 gap-4 lg:gap-16">
        <div className="lg:col-span-4">
          <div className="border rounded-md overflow-hidden bg-white">
            {data?.docs.map((product, index) => (
              <CheckoutItem
                key={product.id}
                isLast={index === data.docs.length - 1}
                name={product.title}
                productUrl={`${generateTenentUrl(product.tenant.slug)}/products/${product.id}`}
                image={product.image?.url}
                tenantUrl={generateTenentUrl(product.tenant.slug)}
                tenantName={product.tenant.name}
                productPrice={product.price}
                onRemove={() => {
                  removeProduct(product.id);
                }}
              />
            ))}
          </div>
        </div>
        <div className="lg:col-span-3">
          <CheckoutSideBar
            totalPrice={data?.totalPrice || 0}
            oncheckout={() => {}}
            isCanceled={false}
            isPending={false}
          />
        </div>
      </div>
    </div>
  );
};
