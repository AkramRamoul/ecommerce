"use client";

import { useTRPC } from "@/trpc/client";
import { useMutation } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { useEffect } from "react";

const Page = () => {
  const trpc = useTRPC();
  const { mutate: verify } = useMutation(
    trpc.checkout.verify.mutationOptions({
      onSuccess(data) {
        window.location.href = data.url;
      },
      onError() {
        window.location.href = "/";
      },
    })
  );
  useEffect(() => {
    verify();
  }, [verify]);
  return (
    <div className="min-h-screen flex items-center justify-center">
      <Loader2 className="animate-spin text-black" size={48} />
    </div>
  );
};

export default Page;
