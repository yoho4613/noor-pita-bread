import { Category } from "@prisma/client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import {
  Dispatch,
  ReactNode,
  SetStateAction,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { toast } from "react-hot-toast";
import { Address, CategoryWithSubCategory, Product, ProductType, UserDetail } from "~/config/type";
import {
  defaultCategories,
  defaultProducts,
  defaultRandomProducts,
  defaultUserDetail,
} from "~/constant/config";
import { api } from "~/utils/api";

interface ContextProp {
  categories: CategoryWithSubCategory[];
  setCategories: Dispatch<SetStateAction<CategoryWithSubCategory[]>>;
  products: Product[];
  setProducts: Dispatch<SetStateAction<never[]>>;
  randomProducts: ProductType[];
  setRandomProducts: Dispatch<SetStateAction<ProductType[]>>;
  fetchCategories: () => void
}

const ShopContext = createContext<ContextProp>({
  categories: defaultCategories,
  setCategories: (str) => {
    return str;
  },
  products: defaultProducts,
  setProducts: (str) => {
    return str;
  },
  randomProducts: defaultRandomProducts,
  setRandomProducts: (str) => {
    return str;
  },
  fetchCategories: () => {
    return
  }
});

export const StateContext = ({ children }: { children: ReactNode }) => {
  const router = useRouter();
  const [categories, setCategories] = useState<CategoryWithSubCategory[]>([]);
  const [products, setProducts] = useState([]);
  const [randomProducts, setRandomProducts] = useState<ProductType[]>([]);
  const { data: fetchedrandomProducts } =
    api.product.getRandomProducts.useQuery(20);

  const { data: withSubCategory } = api.category.withSubcategory.useQuery();

  const fetchCategories = () => {
    console.log(withSubCategory)
    console.log(categories)
    if (!categories.length) {
      if (withSubCategory) {
        setCategories(withSubCategory);
      }
    }
  };

  const fetchProducts = () => {};

  const fetchProductsByCategories = async () => {};

  const fetchProductsByRecommandation = async () => {
    if (!randomProducts.length) {
      if (fetchedrandomProducts) {
        setRandomProducts(fetchedrandomProducts);
      }
    }
  };

  return (
    <ShopContext.Provider
      value={{
        categories,
        setCategories,
        products,
        setProducts,
        randomProducts,
        setRandomProducts,
        fetchCategories
      }}
    >
      {children}
    </ShopContext.Provider>
  );
};

export const useShopContext = () => useContext(ShopContext);
