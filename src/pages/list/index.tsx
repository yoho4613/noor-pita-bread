import { useEffect, useState } from "react";
import { BiFilterAlt } from "react-icons/bi";
import { ImSortAmountDesc } from "react-icons/im";
import Searchbar from "~/components/global/Searchbar";
import ProductCard from "~/components/Products/ProductCard";
import CategoryNavBar from "~/components/navbar/CategoryNavBar";
import { api } from "~/utils/api";
import Spinner from "~/components/global/Spinner";
import { GetServerSideProps } from "next";
import { FC } from "react";
import { ProductType } from "~/config/type";

interface ListPageProps {
  category: string;
  subcategory: string;
  search: string;
}

const ListPage: FC<ListPageProps> = ({ category, subcategory, search }) => {
  const { data: categories } = api.category.withSubcategory.useQuery();
  const { data: products, isLoading } = api.product.findByFilter.useQuery({
    category,
    subcategory,
    search,
  });
  const [productLength, setProductLength] = useState(20);
  const [slicedProducts, setSlicedProducts] = useState<ProductType[] | null>(
    null,
  );

  useEffect(() => {
    if (products) {
      setSlicedProducts((products as ProductType[]).slice(0, productLength));
    }
  }, [products]);

  return (
    <div className="flex flex-col sm:flex-row">
      {categories && <CategoryNavBar categories={categories} />}
      <div className="w-full p-4">
        <div className="relative mb-6 flex grow">
          <div className="relative grow">
            <Searchbar />
          </div>
          <div className="ml-2 flex items-center space-x-2">
            <button>
              <ImSortAmountDesc className="text-2xl text-grayPrimary" />
            </button>
            <button>
              <BiFilterAlt className="text-3xl" />
            </button>
          </div>
        </div>
        <div className="flex flex-wrap items-start justify-between gap-4 ">
          {slicedProducts?.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
          {isLoading && <Spinner />}
        </div>
        <div className="text-center">
          {slicedProducts &&
            products &&
            slicedProducts.length < products.length && (
              <button
                onClick={() => {
                  if (products) {
                    setSlicedProducts(
                      (products as ProductType[]).slice(0, productLength + 20),
                    );
                    setProductLength((prev) => prev + 20);
                  }
                }}
                type="button"
                className="mb-2 mr-2 rounded-lg border border-gray-200 bg-white px-5 py-2.5 text-sm font-medium text-gray-900 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:outline-none focus:ring-4 focus:ring-gray-200 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white dark:focus:ring-gray-700"
              >
                More Products...
              </button>
            )}
        </div>
      </div>
    </div>
  );
};

/* eslint-disable-next-line */
export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  return {
    props: {
      category: query.category ?? "all",
      subcategory: query.subcategory ?? "all",
      search: query.search ?? "all",
    },
  };
};

export default ListPage;
