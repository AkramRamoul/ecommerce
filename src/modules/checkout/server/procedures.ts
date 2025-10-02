import { Media, Tenant } from "@/payload-types";
import {
  baseProcedure,
  createTRPCRouter,
  protectedProcedure,
} from "@/trpc/init";
import { TRPCError } from "@trpc/server";
import Stripe from "stripe";

import z from "zod";
import { checkoutMetaData, productMetaData } from "../types";
import { stripe } from "@/lib/stripe";
import { platformPercentage } from "@/constants";

export const checkoutRouter = createTRPCRouter({
  verify: protectedProcedure.mutation(async ({ ctx }) => {
    const user = await ctx.payload.findByID({
      collection: "users",
      id: ctx.session.user.id,
      depth: 0,
    });
    if (!user) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "User not found",
      });
    }
    const tenantId = user.tenants?.[0]?.tenant as string;
    const tenant = await ctx.payload.findByID({
      collection: "tenants",
      id: tenantId,
      depth: 0,
    });
    if (!tenant) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "Tenant not found",
      });
    }
    const accountLink = await stripe.accountLinks.create({
      account: tenant.stripeAccountId,
      refresh_url: `${process.env.NEXT_PUBLIC_APP_URL}/admin`,
      return_url: `${process.env.NEXT_PUBLIC_APP_URL}/admin`,
      type: "account_onboarding",
    });
    if (!accountLink.url) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to create account link",
      });
    }

    return { url: accountLink.url };
  }),
  purchase: protectedProcedure
    .input(
      z.object({
        productIds: z.array(z.string()),
        tenantSlug: z.string().min(1),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const products = await ctx.payload.find({
        collection: "products",
        depth: 2,
        where: {
          and: [
            {
              id: {
                in: input.productIds,
              },
            },
            {
              "tenant.slug": {
                equals: input.tenantSlug,
              },
            },
          ],
        },
      });
      if (products.totalDocs !== input.productIds.length) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Some products were not found",
        });
      }
      const tenantData = await ctx.payload.find({
        collection: "tenants",
        limit: 1,
        where: {
          slug: {
            equals: input.tenantSlug,
          },
        },
      });
      const tenant = tenantData.docs[0];

      if (!tenant) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Tenant not found",
        });
      }
      if (!tenant.stripeDetailsSubmitted) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Stripe details not submitted",
        });
      }

      const totalAmount = products.docs.reduce(
        (acc, item) => acc + item.price * 100,
        0
      );

      const platformFeeAmount = Math.round(
        totalAmount * (platformPercentage / 100)
      );

      const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] =
        products.docs.map((product) => ({
          price_data: {
            currency: "usd",
            product_data: {
              name: product.title,
              metadata: {
                stripeAccountId: tenant.stripeAccountId,
                id: product.id,
                name: product.title,
                price: product.price,
              } as productMetaData,
            },
            unit_amount: product.price * 100,
          },
          quantity: 1,
        }));
      const checkout = await stripe.checkout.sessions.create(
        {
          customer_email: ctx.session.user.email,
          success_url: `${process.env.NEXT_PUBLIC_APP_URL}/tenants/${input.tenantSlug}/checkout?success=true`,
          cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/tenants/${input.tenantSlug}/checkout?cancel=true`,
          line_items: lineItems,
          invoice_creation: { enabled: true },
          metadata: {
            userId: ctx.session.user.id,
          } as checkoutMetaData,
          payment_intent_data: {
            application_fee_amount: platformFeeAmount,
          },
          mode: "payment",
        },
        {
          stripeAccount: tenant.stripeAccountId,
        }
      );
      if (!checkout.url) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to create checkout session",
        });
      }
      return {
        url: checkout.url,
      };
    }),
  getProduct: baseProcedure
    .input(
      z.object({
        ids: z.array(z.string()),
      })
    )
    .query(async ({ ctx, input }) => {
      const data = await ctx.payload.find({
        collection: "products",
        depth: 2,
        where: {
          id: {
            in: input.ids,
          },
        },
      });

      if (data.totalDocs !== input.ids.length) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Products not found",
        });
      }

      return {
        ...data,
        totalPrice: data.docs.reduce((acc, product) => acc + product.price, 0),
        docs: data.docs.map((doc) => ({
          ...doc,
          image: doc.image as Media | null,
          tenant: doc.tenant as Tenant & { image: Media | null },
        })),
      };
    }),
});
