import { baseProcedure, createTRPCRouter } from "@/trpc/init";
import { TRPCError } from "@trpc/server";
import { headers as getHeaders } from "next/headers";

import z from "zod";
import { generateAuthCookies } from "../utils";
export const authRouter = createTRPCRouter({
  session: baseProcedure.query(async ({ ctx }) => {
    const headers = await getHeaders();

    const session = await ctx.payload.auth({ headers });
    return session;
  }),
  register: baseProcedure
    .input(
      z.object({
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
      })
    )
    .mutation(async ({ input, ctx }) => {
      const existingData = await ctx.payload.find({
        collection: "users",
        limit: 1,
        where: {
          username: {
            equals: input.username,
          },
        },
      });
      const existingUser = existingData.docs[0];

      if (existingUser) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "User already exists",
        });
      }
      const tenant = await ctx.payload.create({
        collection: "tenants",
        data: {
          name: input.username,
          slug: input.username,
          stripeAccountId: "test",
        },
      });

      await ctx.payload.create({
        collection: "users",
        data: {
          email: input.email,
          username: input.username,
          password: input.password,
          tenants: [
            {
              tenant: tenant.id,
              roles: ["tenant-admin"],
            },
          ],
        },
      });

      const data = await ctx.payload.login({
        collection: "users",
        data: {
          email: input.email,
          password: input.password,
        },
      });
      if (!data.token) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Login failed",
        });
      }

      await generateAuthCookies({
        prefix: ctx.payload.config?.cookiePrefix,
        value: data.token,
      });
    }),

  login: baseProcedure
    .input(
      z.object({
        email: z.string().email(),
        password: z.string().min(4),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const data = await ctx.payload.login({
        collection: "users",
        data: {
          email: input.email,
          password: input.password,
        },
      });
      if (!data.token) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Login failed",
        });
      }

      await generateAuthCookies({
        prefix: ctx.payload.config?.cookiePrefix,
        value: data.token,
      });
      return data;
    }),
});
