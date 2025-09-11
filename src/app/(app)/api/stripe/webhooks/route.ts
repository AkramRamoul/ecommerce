import Stripe from "stripe";

import { stripe } from "@/lib/stripe";
import { NextResponse } from "next/server";
import { getPayload } from "payload";

import config from "@payload-config";
import { ExpndedLineItems } from "@/modules/checkout/types";

export async function POST(req: Request) {
  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      await (await req.blob()).text(),
      req.headers.get("stripe-signature") as string,
      process.env.STRIPE_WEBHOOK_SECRET! as string
    );
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    if (error instanceof Error) {
      console.log(error);
    }
    console.error("❌Error message:", errorMessage);
    return NextResponse.json(
      { message: `Webhook error: ${errorMessage}` },
      { status: 400 }
    );
  }

  console.log("✅ Success:", event.id);
  const permittedEvents: string[] = ["checkout.session.completed"];
  const payload = await getPayload({ config });
  if (permittedEvents.includes(event.type)) {
    let data;
    try {
      switch (event.type) {
        case "checkout.session.completed":
          data = event.data.object as Stripe.Checkout.Session;
          if (!data.metadata?.userId) {
            throw new Error("user Id required");
          }
          const user = await payload.findByID({
            collection: "users",
            id: data.metadata.userId,
          });

          if (!user) {
            throw new Error("User not found");
          }

          const expandedSession = await stripe.checkout.sessions.retrieve(
            data.id,
            {
              expand: ["line_items.data.price.product"],
            }
          );

          if (
            !expandedSession.line_items?.data ||
            expandedSession.line_items.data.length === 0
          ) {
            throw new Error("No line items found");
          }
          const lineItems = expandedSession.line_items
            .data as ExpndedLineItems[];

          for (const item of lineItems) {
            await payload.create({
              collection: "orders",
              data: {
                stripeCheckoutSessionId: data.id,
                user: user.id,
                product: item.price.product.metadata.id,
                name: item.price.product.metadata.name,
              },
            });
          }
          break;
        default: {
          throw new Error(`Unhandled event type: ${event.type}`);
        }
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      console.log("❌Error message:", errorMessage);
      return NextResponse.json(
        { message: "Webhook handler failed" },
        { status: 400 }
      );
    }
  }
  return NextResponse.json({ received: true }, { status: 200 });
}
