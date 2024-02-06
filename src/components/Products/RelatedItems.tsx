import { FC } from "react";
import ProductCard from "./ProductCard";
import { ProductType } from "~/config/type";

interface RelatedItemsProps {
  products: ProductType[];
  title: string;
}

const RelatedItems: FC<RelatedItemsProps> = ({ products, title }) => {
  const suffledProducts = products.slice(0, 12);
  return (
    <div className="space-y-4">
      <div className="flex items-center">
        <span className="mr-4 inline-block h-12 w-6 rounded-md bg-redPrimary" />
        <h2 className="font-bold text-redPrimary">{title}</h2>
      </div>
      <div className="my-6 flex w-full items-start justify-between gap-4 pl-4 sm:flex-row sm:items-center sm:gap-0 sm:pl-0">
        <h2 className="text-xl tracking-widest sm:text-2xl md:text-3xl">
          Best Selling Products
        </h2>
      </div>
      <div className="flex flex-wrap justify-between gap-4">
        {suffledProducts.map((product, i) => (
          <ProductCard
            key={i}
            product={product}
          />
        ))}
      </div>
    </div>
  );
};

export default RelatedItems;
