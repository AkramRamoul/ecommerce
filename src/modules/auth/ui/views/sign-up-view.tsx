"use client";

import { useForm } from "react-hook-form";
import z from "zod";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import Link from "next/link";

import { toast } from "sonner";

import { Poppins } from "next/font/google";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTRPC } from "@/trpc/client";

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["700"],
});

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6, "password must be at least 6 characters"),
  username: z
    .string()
    .min(3, "username must be at least 3 characters")
    .max(63, "username must be less than 64 characters")
    .regex(
      /^[a-z0-9][a-z0-9-]*[a-z0-9]$/,
      "username can only contain lowercase letters, numbers and hyphens it must start and end with a letter or a number"
    )
    .refine(
      (val) => !val.includes("--"),
      "username cannot contain consecutive hyphens"
    )
    .transform((val) => val.toLocaleLowerCase()),
});

export const SignUp = () => {
  const router = useRouter();
  const trpc = useTRPC();
  const register = useMutation(
    trpc.auth.register.mutationOptions({
      onError: (err) => toast.error(err.message),
      onSuccess: () => router.push("/"),
    })
  );
  const form = useForm<z.infer<typeof registerSchema>>({
    mode: "all",
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: "",
      password: "",
      username: "",
    },
  });
  const onSubmit = (values: z.infer<typeof registerSchema>) => {
    register.mutate(values);
  };

  const username = form.watch("username");
  const usernameErrors = form.formState.errors.username;
  const showPreview = username && !usernameErrors;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5">
      <div className="bg-[#F4F4F0] h-screen w-full lg:col-span-3 overflow-auto">
        <Form {...form}>
          <form
            className="flex flex-col gap-8 p-4 lg:p-16"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <div className="flex items-center justify-between mb-8 ">
              <Link href="/">
                <span className={cn("text-2xl", poppins.className)}>
                  MultiCart
                </span>
              </Link>
              <Button
                asChild
                variant={"ghost"}
                size={"sm"}
                className="border-none text-base underline"
              >
                <Link prefetch href="/sign-in">
                  Sign In
                </Link>
              </Button>
            </div>
            <h1 className="text-4xl font-medium">
              Welcome, join over 1000 creators doing buisness with MultiCart.
            </h1>
            <FormField
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base">Username</FormLabel>
                  <FormControl>
                    <Input placeholder="Username" {...field} />
                  </FormControl>
                  <FormDescription
                    className={cn("hidden", showPreview && "block")}
                  >
                    Your store will be available at&nbsp;
                    <strong> https://multicart.com/{username}</strong>
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base">Email</FormLabel>
                  <FormControl>
                    <Input placeholder="Email" type="email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base">Password</FormLabel>
                  <FormControl>
                    <Input placeholder="Password" type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              className="bg-black text-white hover:bg-rose-400 hover:text-primary"
              size={"lg"}
              variant={"elevated"}
              disabled={register.isPending}
            >
              Create account
            </Button>
          </form>
        </Form>
      </div>
      <div
        className="h-screen w-full lg:col-span-2 hidden lg:block"
        style={{
          backgroundImage: "url('/authbg.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
    </div>
  );
};
