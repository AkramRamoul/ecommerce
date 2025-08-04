import { loadProductFilters } from "@/modules/products/search-Params";
import { ProductListView } from "@/modules/products/ui/views/ProductListView";
import { getQueryClient, trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { SearchParams } from "nuqs/server";

interface Props {
  params: Promise<{ subcategory: string }>;
  searchParams: Promise<SearchParams>;
}

const Page = async ({ params, searchParams }: Props) => {
  const { subcategory } = await params;

  const filters = await loadProductFilters(searchParams);

  console.log("Filters:", filters);

  const queryClient = getQueryClient();
  void queryClient.prefetchQuery(
    trpc.products.getMany.queryOptions({
      categorySlug: subcategory,
      ...filters,
    })
  );

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ProductListView category={subcategory} />
    </HydrationBoundary>
  );
};

export default Page;
