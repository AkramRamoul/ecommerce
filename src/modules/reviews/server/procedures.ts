import { TRPCError } from "@trpc/server";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";

import z from "zod";

export const reviewsRouter = createTRPCRouter({
  getOne: protectedProcedure
    .input(
      z.object({
        productId: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const product = await ctx.payload.findByID({
        collection: "products",
        id: input.productId,
      });
      if (!product)
        throw new TRPCError({
          code: "NOT_FOUND",
          message: `Product with ID ${input.productId} not found`,
        });

      const reviewsData = await ctx.payload.find({
        collection: "reviews",
        where: {
          and: [
            {
              product: { equals: input.productId },
            },
            {
              user: { equals: ctx.session.user.id },
            },
          ],
        },
        limit: 1,
      });
      const review = reviewsData.docs[0];

      if (!review) {
        return null;
      }

      return review;
    }),

  create: protectedProcedure
    .input(
      z.object({
        productId: z.string(),
        rating: z.number().min(1).max(5),
        description: z.string().min(10).max(500),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const product = await ctx.payload.findByID({
        collection: "products",
        id: input.productId,
      });
      if (!product)
        throw new TRPCError({
          code: "NOT_FOUND",
          message: `Product with ID ${input.productId} not found`,
        });

      const existingReviews = await ctx.payload.find({
        collection: "reviews",
        where: {
          and: [
            { product: { equals: input.productId } },
            { user: { equals: ctx.session.user.id } },
          ],
        },
        limit: 1,
      });
      if (existingReviews.totalDocs > 0) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "You have already reviewed this product.",
        });
      }
      const newReview = await ctx.payload.create({
        collection: "reviews",
        data: {
          product: input.productId,
          user: ctx.session.user.id,
          rating: input.rating,
          description: input.description,
        },
      });
      return newReview;
    }),
  update: protectedProcedure
    .input(
      z.object({
        reviewId: z.string(),
        rating: z.number().min(1).max(5),
        description: z.string().min(10).max(500),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const existingReview = await ctx.payload.findByID({
        depth: 0,
        collection: "reviews",
        id: input.reviewId,
      });
      if (!existingReview)
        throw new TRPCError({
          code: "NOT_FOUND",
          message: `Review with ID ${input.reviewId} not found`,
        });
      if (existingReview.user !== ctx.session.user.id) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You do not have permission to edit this review.",
        });
      }

      const updatedReview = await ctx.payload.update({
        collection: "reviews",
        id: input.reviewId,
        data: {
          rating: input.rating,
          description: input.description,
        },
      });
      return updatedReview;
    }),
});
