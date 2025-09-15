import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import { useCart } from "@/modules/checkout/hooks/use-cart";
import Link from "next/link";

interface Props {
  tenantSlug: string;
  productId: string;
  isPurchased?: boolean;
}
export const CartButton = ({ tenantSlug, productId, isPurchased }: Props) => {
  const cart = useCart(tenantSlug);

  if (isPurchased) {
    return (
      <Button className="flex-1 font-medium" variant={"elevated"} asChild>
        <Link prefetch href={`/library/${productId}`}>
          View in library
        </Link>
      </Button>
    );
  }
  return (
    <Button
      variant={"elevated"}
      className={cn(
        "flex-1 bg-rose-400",
        cart.isProsuctInCart(productId) && "bg-white"
      )}
      onClick={() => {
        cart.toggleProduct(productId);
      }}
    >
      {cart.isProsuctInCart(productId) ? "Remove from cart" : "Add to cart"}
    </Button>
  );
};
