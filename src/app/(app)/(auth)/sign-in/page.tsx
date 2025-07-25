import { SignIn } from "@/modules/auth/ui/views/sign-in-view";
import { caller } from "@/trpc/server";
import { redirect } from "next/navigation";
import React from "react";

const Page = async () => {
  const session = await caller.auth.session();
  if (session.user) {
    redirect("/");
  }
  return <SignIn />;
};

export default Page;
