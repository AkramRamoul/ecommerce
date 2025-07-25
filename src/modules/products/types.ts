import { inferRouterOutputs } from "@trpc/server";

import { AppRouter } from "@/trpc/routers/_app";

export type ProductsgetManyOut =
  inferRouterOutputs<AppRouter>["products"]["getMany"];
