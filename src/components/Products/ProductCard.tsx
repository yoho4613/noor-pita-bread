import { Product, Sale } from "@prisma/client";
import Link from "next/link";
import React, { FC, useEffect, useState } from "react";
import { BsStarHalf, BsStarFill, BsStar } from "react-icons/bs";
import { useStateContext } from "~/context/userDetailContext";
import { api } from "~/utils/api";
import Heart from "../global/Heart";
import { getAverage } from "~/lib/helper";
import Star from "../global/Star";
import { ProductType } from "~/config/type";

interface ProductCardProps {
  product: ProductType;
  deal?: Sale;
}

const ProductCard: FC<ProductCardProps> = ({ product, deal }) => {
  const { userDetail, updateCartContext } = useStateContext();
  const starArr = [1, 2, 3, 4, 5];
  const { data: reviews } = api.review.findProductReview.useQuery({
    id: product.id,
  });
  const [stars, setStars] = useState<number[]>([]);
  const [comments, setComments] = useState<string[]>([]);
  const [average, setAverage] = useState<number>(0);

  useEffect(() => {
    if (reviews) {
      setStars(reviews.map((review) => review.star));
      setComments(reviews.map((review) => review.comment));
      setAverage(getAverage(reviews.map((review) => review.star)));
    }
  }, [reviews]);

  if (!product) {
    return <div></div>;
  }

  return (
    <div className="group/item w-32 shrink-0 sm:w-64">
      <div className="relative h-24 overflow-y-hidden rounded-md border-2 sm:h-48">
        <Link href={`/product/${product.id}`}>
          <img
            className="m-auto h-full w-full"
            src={product.imgUrl[0] ?? ""}
            alt={product.title}
          />
        </Link>
        {deal && (
          <button className="btn--red absolute left-1 top-1 px-0.5 py-1 text-xs sm:left-2 sm:top-2 sm:px-2 sm:py-1 sm:text-sm">
            {deal.method === "percentDiscount" ? `-${deal.value}%` : ""}
          </button>
        )}
        <div className="absolute right-2 top-2 ">
          <Heart productId={product.id} />
        </div>

        <button
          onClick={() => updateCartContext(product.id)}
          className={`absolute bottom-0 right-0 z-10 w-full translate-y-full bg-buttonBlack py-1.5 text-xs text-whitePrimary transition group-hover/item:translate-y-0 sm:text-base ${
            userDetail.cart.includes(product.id) && "bg-redPrimary"
          }`}
        >
          {userDetail.cart.includes(product.id)
            ? "Remove From Cart"
            : "Add To Cart"}
        </button>
      </div>
      <div className="mt-4 flex flex-col space-y-2">
        <h3 className="text-sm font-bold sm:text-base">{product.title}</h3>
        <p>
          <span className="mr-2 text-sm text-redPrimary sm:text-base">
            ${product.price}
          </span>
          <span className="text-sm text-grayPrimary line-through sm:text-base">
            ${product.rrp}
          </span>
        </p>
        <Star average={average} />
      </div>
    </div>
  );
};

export default ProductCard;
