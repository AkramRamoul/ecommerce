import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateTenentUrl(slug: string) {
  const isDev = process.env.NODE_ENV === "development";
  const isSubdomainRoutingEnabled = Boolean(
    process.env.NEXT_PUBLIC_ENABLE_SUBDOMAIN_ROUTING!
  );
  if (isDev || !isSubdomainRoutingEnabled) {
    return `${process.env.NEXT_PUBLIC_APP_URL}/tenants/${slug}`;
  }

  const protocol = "https";
  const domain = process.env.NEXT_PUBLIC_ROOT_DOMAIN;
  return `${protocol}://${slug}.${domain}`;
}
