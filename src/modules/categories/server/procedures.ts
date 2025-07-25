import { Category } from "@/payload-types";
import { baseProcedure, createTRPCRouter } from "@/trpc/init";

export const categoriesRouter = createTRPCRouter({
  getMany: baseProcedure.query(async ({ ctx }) => {
    const data = await ctx.payload.find({
      collection: "categories",
      pagination: false,
      depth: 1,
      where: {
        parent: {
          exists: false,
        },
      },
      sort: "name",
    });
    const formattedData = data.docs.map((doc) => ({
      ...doc,
      subcategories: (doc.subcategories?.docs ?? []).map((doc) => ({
        ...(doc as Category),
      })),
    }));
    return formattedData;
  }),
});
