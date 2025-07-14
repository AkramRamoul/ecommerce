import { Category } from "@/payload-types";
import { baseProcedure, createTRPCRouter } from "@/trpc/init";
import type { Where } from "payload";

import z from "zod";

export const productsRouter = createTRPCRouter({
  getMany: baseProcedure
    .input(
      z.object({
        categorySlug: z.string().nullable().optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      const where: Where = {};

      if (input.categorySlug) {
        const data = await ctx.payload.find({
          collection: "categories",
          limit: 1,
          depth: 1,
          pagination: false,
          where: {
            slug: {
              equals: input.categorySlug,
            },
          },
        });

        const formattedData = data.docs.map((doc) => ({
          ...doc,
          subcategories: (doc.subcategories?.docs ?? []).map((doc) => ({
            ...(doc as Category),
          })),
        }));

        const subcategories = [];

        const category = formattedData[0];

        if (category) {
          subcategories.push(
            ...category.subcategories.map((subCat) => subCat.slug)
          );
        }
        where["category.slug"] = {
          in: [category.slug, ...subcategories],
        };
      }

      const data = await ctx.payload.find({
        collection: "products",
        depth: 1,
        where: {
          ...where,
        },
      });

      return data;
    }),
});
