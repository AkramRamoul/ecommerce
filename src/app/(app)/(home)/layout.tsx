import Footer from "@/modules/home/ui/components/footer";
import {
  SearchFilters,
  SearchLoading,
} from "@/modules/home/ui/components/search-filters";

import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

import { getQueryClient, trpc } from "@/trpc/server";
import { Suspense } from "react";
import { NavBar } from "@/modules/home/ui/components/navBar";

const Layout = async ({ children }: { children: React.ReactNode }) => {
  const queryClient = getQueryClient();
  void queryClient.prefetchQuery(trpc.categories.getMany.queryOptions());

  return (
    <div className="flex flex-col min-h-screen">
      <NavBar />
      <HydrationBoundary state={dehydrate(queryClient)}>
        <Suspense fallback={<SearchLoading />}>
          <SearchFilters />
        </Suspense>
      </HydrationBoundary>
      <div className="flex-1 bg-[#F4F4F0]">{children}</div>
      <Footer />
    </div>
  );
};

export default Layout;
