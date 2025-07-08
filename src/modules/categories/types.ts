import { inferRouterOutputs } from "@trpc/server";

import { AppRouter } from "@/trpc/routers/_app";

export type CategoriesgetManyOut =
  inferRouterOutputs<AppRouter>["categories"]["getMany"];
export type CategoriesgetManyOutputSingle = CategoriesgetManyOut[0];
