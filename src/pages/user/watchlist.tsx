import Link from "next/link";
import { FC, useState } from "react";
import { BsTrash } from "react-icons/bs";
import RelatedItems from "~/components/Products/RelatedItems";
import Spinner from "~/components/global/Spinner";
import { ProductType } from "~/config/type";
import { useStateContext } from "~/context/userDetailContext";
import { api } from "~/utils/api";

// interface WatchlistProps {}

const Watchlist: FC = ({}) => {
  const { userDetail, updateWatchlistContext, updateCartContext } =
    useStateContext();
  const { data: products, isLoading, isError } = api.product.findProducts.useQuery(
    userDetail.watchlist,
  );

  const { data: relatedProducts } = api.product.findRelatedProducts.useQuery({
    id: userDetail.watchlist[0] ?? "",
  });
  const [popupProduct, setPopupProduct] = useState<string | null>(null);

  const handleUpdateWatchlist = (productId: string) => {
    updateWatchlistContext(productId);
  };

  if (isLoading) {
    return (
      <div className="flex h-screen justify-center items-center">
        <Spinner />
      </div>
    );
  }

  const WatchlistPopup = () => {
    return (
      <div
        className="fixed left-0 top-0 z-50 flex h-screen w-screen items-center justify-center"
        style={{ background: "rgba(0,0,0,0.4)" }}
      >
        {popupProduct && (
          <div className=" space-y-4 rounded-md bg-whitePrimary p-2 sm:p-8">
            <p>Are you sure you want to remove this item from watchlist?</p>
            <div className="flex w-full justify-between">
              <button
                className=" rounded-md bg-green-500 px-4 py-2 text-whitePrimary"
                onClick={() => {
                  handleUpdateWatchlist(popupProduct);
                  setPopupProduct(null);
                }}
              >
                Confirm
              </button>
              <button
                className="btn--red px-4 py-2"
                onClick={() => setPopupProduct(null)}
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="m-auto max-w-[1280px] space-y-4">
      {popupProduct && <WatchlistPopup />}
      <div className="flex items-center justify-between md:mx-8 md:my-8">
        <h2>
          Watchlist <span>({userDetail.watchlist.length})</span>
        </h2>
        <button className="rounded-md border-2 px-4 py-2">
          Move All To Cart
        </button>
      </div>
      <div className="flex flex-wrap justify-evenly gap-4">
        {isError && <p>No Watchlist...</p>}
        {products?.map((product) => (
          <div className="w-32 shrink-0 sm:w-64" key={product.id}>
            <div className="relative h-24 overflow-y-hidden rounded-md border-2 sm:h-48">
              <Link href={`/product/${product.id}`}>
                <img
                  className="m-auto h-full w-full"
                  src={product.imgUrl[0]! || ""}
                  alt={product.title}
                />
              </Link>
              {product.Sale && (
                <button className="btn--red absolute left-1 top-1 px-0.5 py-1 text-xs sm:left-2 sm:top-2 sm:px-2 sm:py-1 sm:text-sm">
                  {product.Sale.method === "percentDiscount"
                    ? `-${product.Sale.value}%`
                    : ""}
                </button>
              )}
              <button
                onClick={() => setPopupProduct(product.id)}
                className="absolute right-2 top-2 rounded-full bg-whitePrimary p-1 "
              >
                <BsTrash />
              </button>
              <button
                onClick={() => updateCartContext(product.id)}
                className={`absolute bottom-0 right-0 z-10 w-full  bg-buttonBlack py-1.5 text-xs text-whitePrimary transition  sm:text-base ${
                  userDetail.cart.includes(product.id) && "bg-redPrimary"
                }`}
              >
                {userDetail.cart.includes(product.id)
                  ? "Remove From Cart"
                  : "Add To Cart"}
              </button>
            </div>
            <div className="mt-4 flex flex-col space-y-2">
              <h3 className="text-sm font-bold sm:text-base">
                {product.title}
              </h3>
              <p>
                <span className="mr-2 text-sm text-redPrimary sm:text-base">
                  ${product.price}
                </span>
                <span className="text-sm text-grayPrimary line-through sm:text-base">
                  ${product.rrp}
                </span>
              </p>
            </div>
          </div>
        ))}
      </div>
      <div className="md:px-8 md:py-12">
        {relatedProducts && (
          <RelatedItems products={relatedProducts as ProductType[]} title="Just For you" />
        )}
      </div>
    </div>
  );
};

export default Watchlist;
