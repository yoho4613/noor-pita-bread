import { GetServerSideProps } from "next";
import Image from "next/image";
import Link from "next/link";
import defaultAvatar from "../../../public/avatar.png";
import React, { FC, useEffect, useState } from "react";
import { AiOutlineMinus } from "react-icons/ai";
import {
  BsArrowRepeat,
  BsPlusLg,
  BsStar,
  BsStarFill,
  BsStarHalf,
} from "react-icons/bs";
import { TbTruckDelivery } from "react-icons/tb";
import Heart from "~/components/global/Heart";
import Spinner from "~/components/global/Spinner";
import Star from "~/components/global/Star";
import RelatedItems from "~/components/Products/RelatedItems";
import { getAverage } from "~/lib/helper";
import { api } from "~/utils/api";
import { useStateContext } from "~/context/userDetailContext";
import { ProductType } from "~/config/type";

interface IProductDetailProps {
  id: string;
}
/* eslint-disable */
interface Order {
  [key: string]: number | string | undefined;
}

interface OrderDetail extends Order {
  quantity: number;
}

const ProductDetail: FC<IProductDetailProps> = ({ id }) => {
  const { data: product } = api.product.findProduct.useQuery({ id });
  const { data: relatedProducts } = api.product.findRelatedProducts.useQuery({
    id,
  });
  const { userDetail, updateCartContext } = useStateContext();
  const { data: reviews } = api.review.findProductReview.useQuery({ id });
  const [selectedPhoto, setSelectedPhoto] = useState("");
  const [orderDetail, setOrderDetail] = useState<OrderDetail>({ quantity: 0 });
  const [stars, setStars] = useState<number[]>([]);
  const [comments, setComments] = useState<string[]>([]);

  useEffect(() => {
    if (product) {
      if (product.imgUrl.length) {
        setSelectedPhoto(product.imgUrl[0]!);
      }
      if (product.attributes) {
        setOrderDetail({ quantity: 1 });
        Object.keys(product.attributes).map((key) => {
          setOrderDetail((prev) => ({
            ...prev,
            key: "",
          }));
        });
      }
    }
  }, [product]);

  useEffect(() => {
    if (reviews) {
      setStars(reviews.map((review) => review.star));
      setComments(reviews.map((review) => review.comment));
    }
  }, [reviews]);

  const handleAddCart = () => {
    updateCartContext(id);
  };

  if (!product) {
    return (
      <div className="flex h-screen w-screen items-center justify-center">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="m-auto mt-4 w-screen max-w-[1280px] space-y-6 px-2 sm:mt-12 sm:px-10">
      <div className="flex  flex-col md:flex-row">
        {/* Gallery */}
        <div className="mb-8 mr-8 grid w-full gap-4 md:mb-0 md:w-3/5">
          <div>
            {selectedPhoto && (
              <Image
                className="h-auto max-h-96 w-full rounded-lg"
                width={100}
                height={100}
                src={selectedPhoto}
                alt={product.title}
              />
            )}
          </div>
          <div className="grid grid-cols-5 gap-4">
            {product.imgUrl.map((img, i) => (
              <button key={i} onClick={() => setSelectedPhoto(img)}>
                <Image
                  className={`h-24 w-full rounded-lg ${
                    selectedPhoto === img && "border-2 border-redPrimary"
                  }`}
                  sizes="cover"
                  objectPosition="center"
                  width={100}
                  height={100}
                  src={img}
                  alt={product.title}
                />
              </button>
            ))}
          </div>
        </div>
        {/* Detail */}
        <div className="mb-10 space-y-2 md:mb-0">
          <h2 className="text-2xl font-bold">{product.title}</h2>
          <div className="flex items-center">
            {[...Array(5)].map((star, i) =>
              i < getAverage(stars) && i + 1 > getAverage(stars) ? (
                <BsStarHalf
                  key={i}
                  size={15}
                  className="text-[#ffc107] sm:mr-1"
                />
              ) : i > getAverage(stars) ? (
                <BsStar key={i} size={15} className="text-[#ffc107] sm:mr-1" />
              ) : (
                <BsStarFill
                  key={i}
                  size={15}
                  className="text-[#ffc107] sm:mr-1"
                />
              ),
            )}
            <span className="ml-2 text-sm text-grayPrimary">
              ({stars.length} Reviews)
            </span>
            <span className="mx-4 text-grayPrimary">|</span>
            {product.stock > 0 ? (
              <span className="text-sm text-green-500">In Stock</span>
            ) : (
              <span className="text-sm text-redPrimary">Out of Stock</span>
            )}
          </div>
          <h3 className="text-xl tracking-wider">${product.price}</h3>
          <p className="border-b-2 border-grayPrimary py-6">
            {product.description}
          </p>
          <div className="pt-6">
            {product.attributes &&
              Object.entries(product.attributes).map((attribute, x) => (
                <div
                  key={x}
                  className="mb-4 flex flex-wrap items-center space-x-2 sm:flex-nowrap"
                >
                  {attribute.map((att, i) =>
                    i === 0 ? (
                      <h3 key={i} className="text-base sm:text-xl">
                        {att[0]?.toUpperCase()}
                        {att.slice(1)}:
                      </h3>
                    ) : (
                      (att as string[]).map((value: string, index: number) => (
                        <button
                          key={index}
                          onClick={() =>
                            setOrderDetail((prev) => ({
                              ...prev,
                              [String(attribute[0])]: value,
                            }))
                          }
                          className={`rounded-md border-2 px-2.5 py-1 text-xs sm:text-sm ${
                            orderDetail[attribute[0]] === value &&
                            "bg-redPrimary text-whitePrimary"
                          }`}
                        >
                          {value}
                        </button>
                      ))
                    ),
                  )}
                </div>
              ))}
          </div>
          <div className="w-full">
            <button
              onClick={handleAddCart}
              className={`${
                userDetail.cart.includes(product.id)
                  ? "bg-redPrimary text-whitePrimary"
                  : "hover:bg-buttonGreen"
              } w-full rounded-md border-2 py-1 text-xs sm:text-base`}
            >
              {userDetail.cart.includes(product.id)
                ? "Remove From Cart"
                : "Add To Cart"}
            </button>
          </div>
          <div className="flex justify-start gap-4 pb-6 md:justify-between md:gap-0">
            <div className="flex items-center">
              <button
                onClick={() =>
                  setOrderDetail((prev) => ({
                    ...prev,
                    quantity:
                      prev.quantity >= product.stock
                        ? prev.quantity
                        : prev.quantity + 1,
                  }))
                }
                className="rounded-l-md border-2 p-1 hover:border-transparent hover:bg-redPrimary hover:text-whitePrimary sm:p-2"
              >
                <BsPlusLg className="text-sm sm:text-xl" />
              </button>
              <input
                type="number"
                value={orderDetail.quantity}
                onChange={(e) =>
                  setOrderDetail((prev) => ({
                    ...prev,
                    quantity: Number(e.target.value),
                  }))
                }
                className="number-input w-10 border-y-2 p-1 text-center text-xs outline-0 sm:h-full sm:w-16 sm:p-2 sm:text-base"
              />
              <button
                onClick={() =>
                  setOrderDetail((prev) => ({
                    ...prev,
                    quantity:
                      prev.quantity <= 1
                        ? prev.quantity
                        : Number(prev.quantity) - 1,
                  }))
                }
                className="rounded-r-md border-2 p-1 hover:border-transparent hover:bg-redPrimary hover:text-whitePrimary sm:p-2"
              >
                <AiOutlineMinus className="text-sm sm:text-xl" />
              </button>
            </div>
            <button
              onClick={handleAddCart}
              className="btn--red w-24 text-xs sm:w-36 sm:text-base"
            >
              Buy Now
            </button>
            <div className="rounded-md border-2 hover:border-transparent hover:bg-buttonGreen hover:text-whitePrimary">
              <Heart productId={product.id} />
            </div>
          </div>

          <div>
            <div className="flex items-center rounded-sm border-2 px-2.5 py-4">
              <TbTruckDelivery className="mr-4" size={35} />
              <div>
                <h3 className="font-bold">Fast Delivery</h3>
                <p className="text-xs">
                  Delivery is available for <strong>${product.delivery}</strong>
                </p>
              </div>
            </div>
            <div className="flex items-center rounded-sm border-2 border-t-0 px-2.5 py-4">
              <BsArrowRepeat className="mr-4" size={35} />
              <div>
                <h3 className="font-bold">Return Delivery</h3>
                <p className="text-xs">
                  Free 30 Days Delivery Returns. <Link href={"/"}>Details</Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Comments */}
      <div className="flex items-center">
        <span className="mr-4 inline-block h-12 w-6 rounded-md bg-redPrimary" />
        <h2 className="font-bold text-redPrimary">Reviews</h2>
      </div>
      <div className="w-full rounded-sm border-2">
        <div className="w-full space-y-4 p-2.5">
          {reviews ? (
            reviews.slice(0, 10).map((review) => (
              <div
                key={review.id}
                className="flex w-full flex-col items-start gap-4 border-b-2 pb-4 sm:flex-row sm:items-center sm:gap-0"
              >
                <Image
                  className="mr-4 h-14 w-14 rounded-full"
                  src={review.author.image || defaultAvatar}
                  alt="author"
                  width={100}
                  height={100}
                />
                <div>
                  <h3 className="text-sm sm:text-base">
                    Author: <strong>{review.author.name}</strong>
                  </h3>
                  <h4 className="text-sm sm:text-base">{review.comment}</h4>
                  <Star average={review.star} />
                </div>
                <div className="grow self-start text-right text-xs">
                  <p>
                    Posted at: <span>{review.createdAt.toLocaleString()}</span>
                  </p>
                  {review.updatedAt.getTime() > review.createdAt.getTime() && (
                    <p>
                      Edited at:{" "}
                      <span>{review.updatedAt.toLocaleString()}</span>
                    </p>
                  )}
                </div>
              </div>
            ))
          ) : (
            <Spinner />
          )}
        </div>
      </div>
      {/* Related Item */}
      <div>
        {relatedProducts && (
          <RelatedItems
            products={relatedProducts as ProductType[]}
            title="Related Item"
          />
        )}
      </div>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  return {
    props: {
      id: query.id,
    },
  };
};

export default ProductDetail;
