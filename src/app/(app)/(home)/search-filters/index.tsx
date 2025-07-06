import { CustomCat } from "../types";
import { SearchInput } from "./Search-input";
import { Categories } from "./categories";

interface Props {
  data: CustomCat[];
}

export const SearchFilters = ({ data }: Props) => {
  return (
    <div className="px-4 lg:px-12 py-8 border-b flex flex-col gap-4 w-full">
      <SearchInput data={data} />
      <div className="hidden lg:block">
        <Categories data={data} />
      </div>
    </div>
  );
};
