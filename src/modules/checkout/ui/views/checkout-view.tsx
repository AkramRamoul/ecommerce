"use client";

import { useEffect } from "react";

import { toast } from "sonner";

import { useTRPC } from "@/trpc/client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { useCart } from "../../hooks/use-cart";
import { generateTenentUrl } from "@/lib/utils";
import CheckoutItem from "../components/checkout-items";
import { CheckoutSideBar } from "../components/checkou-sidebar";
import { InboxIcon, LoaderIcon } from "lucide-react";
import { useCheckoutStates } from "../../hooks/use-checkou-state";
import { useRouter } from "next/navigation";

interface Props {
  tenantSlug: string;
}
export const CheckoutView = ({ tenantSlug }: Props) => {
  const router = useRouter();

  const [states, setStates] = useCheckoutStates();

  const { productIds, clearCart, removeProduct } = useCart(tenantSlug);

  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const { data, error, isLoading } = useQuery(
    trpc.checkout.getProduct.queryOptions({
      ids: productIds,
    })
  );
  const purshase = useMutation(
    trpc.checkout.purchase.mutationOptions({
      onMutate: () => {
        setStates({ success: false, cancel: false });
      },
      onSuccess: (data) => {
        window.location.href = data.url;
      },
      onError: (error) => {
        if (error.data?.code === "UNAUTHORIZED") {
          router.push("/sign-in");
        }
        toast.error(error.message || "Something went wrong");
      },
    })
  );

  useEffect(() => {
    if (states.success) {
      setStates({ success: false, cancel: false });
      clearCart();
      queryClient.invalidateQueries(trpc.library.getMany.infiniteQueryFilter());
      router.push("/library");
    }
  }, [
    clearCart,
    states.success,
    router,
    setStates,
    queryClient,
    trpc.library.getMany,
  ]);

  useEffect(() => {
    if (error?.data?.code === "NOT_FOUND") {
      clearCart();
      toast.warning("Invalid products in cart. Cart cleared.");
    }
  }, [error, clearCart]);

  if (isLoading) {
    return (
      <div className="lg:pt-16 pt-4 px-4 lg:px-12 ">
        <div className="border border-black border-dashed flex items-center justify-center p-8 flex-col gap-y4 bg-white w-full rounded-lg">
          <LoaderIcon className="size-4 animate-spin" />
        </div>
      </div>
    );
  }

  if (data?.totalDocs === 0) {
    return (
      <div className="lg:pt-16 pt-4 px-4 lg:px-12 ">
        <div className="border border-black border-dashed flex items-center justify-center p-8 flex-col gap-y4 bg-white w-full rounded-lg">
          <InboxIcon />
          <p className="text-base font-medium">No products found.</p>
        </div>
      </div>
    );
  }

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
            onPurchase={() => purshase.mutate({ productIds, tenantSlug })}
            isCanceled={states.cancel}
            disabled={purshase.isPending}
          />
        </div>
      </div>
    </div>
  );
};
