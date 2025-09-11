import Stripe from "stripe";

export type productMetaData = {
  stripeAccountId: string;
  id: string;
  name: string;
  price: number;
};

export type checkoutMetaData = {
  userId: string;
};

export type ExpndedLineItems = Stripe.LineItem & {
  price: Stripe.Price & {
    product: Stripe.Product & {
      metadata: productMetaData;
    };
  };
};
