import { ArrowLeftIcon } from "lucide-react";
import Link from "next/link";
import React, { Suspense } from "react";
import { ProductList, ProductListSuspense } from "../components/product-list";

export const LibraryView = () => {
  return (
    <div className="min-h-screen bg-white">
      <nav className="p-4 bg-[#F4F4F0] w-full border-b">
        <Link prefetch href={"/"} className="flex items-center gap-2">
          <ArrowLeftIcon className="size-4" />
          <span className="font-medium">Continue Shopping</span>
        </Link>
      </nav>
      <header className="py-8 border-b bg-[#F4F4F0]">
        <div className="max-w-(--breakpoint-xl) mx-auto px-4 lg:px-12 flex flex-col gap-y-4">
          <h1 className="text-[40px] font-medium">Library</h1>
          <p className="font-medium">Your purchase and review history</p>
        </div>
      </header>
      <section className="max-w-(--breakpoint-xl) mx-auto px-4 lg:px-12 py-10">
        <Suspense fallback={<ProductListSuspense />}>
          <ProductList />
        </Suspense>
      </section>
    </div>
  );
};
