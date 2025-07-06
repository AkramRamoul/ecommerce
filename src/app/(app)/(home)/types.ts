import { Category } from "@/payload-types";

export type CustomCat = Category & {
  subcategories: Category[];
};
