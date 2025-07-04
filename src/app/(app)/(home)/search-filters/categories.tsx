import { CategoeyDropdown } from "./Category-Drowpdown";

interface CategoriesProps {
  data: any[];
}

export const Categories = ({ data }: CategoriesProps) => {
  return (
    <div className="relative w-full">
      <div className="flex flex-nowrap items-center">
        {data.map((category) => (
          <CategoeyDropdown
            key={category.id}
            category={category}
            isActive={false}
            isHovered={false}
          />
        ))}
      </div>
    </div>
  );
};
