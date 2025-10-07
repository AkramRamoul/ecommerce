import { cookies as getCokies } from "next/headers";

interface Props {
  prefix: string;
  value: string;
}

export const generateAuthCookies = async ({ prefix, value }: Props) => {
  const cookies = await getCokies();
  cookies.set({
    name: `${prefix}-token`,
    value: value,
    httpOnly: true,
    path: "/",
    ...(process.env.NODE_ENV !== "development" && {
      sameSite: "none",
      domain: process.env.NEXT_PUBLIC_ROOT_DOMAIN,
      secure: true,
    }),
  });
};
