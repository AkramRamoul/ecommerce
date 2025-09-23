"use client";
import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import React from "react";
import { ReviewForm } from "./review-form";

interface Props {
  productId: string;
}

const ReviewSideBar = ({ productId }: Props) => {
  const trpc = useTRPC();
  const { data } = useSuspenseQuery(
    trpc.reviews.getOne.queryOptions({
      productId,
    })
  );

  return (
    <div>
      <ReviewForm productId={productId} initialData={data} />
    </div>
  );
};

export default ReviewSideBar;
