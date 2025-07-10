import { SignUp } from "@/modules/auth/ui/views/sign-up-view";
import React from "react";
import { caller } from "@/trpc/server";
import { redirect } from "next/navigation";

const Page = async () => {
  const session = await caller.auth.session();
  if (session.user) {
    redirect("/");
  }
  return <SignUp />;
};

export default Page;
