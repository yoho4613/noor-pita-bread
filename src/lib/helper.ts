import { Banner, Product } from "@prisma/client";
import {
  BannerType,
  CartItem,
  CartItemWithUrl,
  ProductType,
} from "~/config/type";
import { s3 } from "./s3";

export const getAverage = (arr: number[]) => {
  const total = arr.reduce((acc, next) => (acc += next), 0);
  const average = total / arr.length;
  return average;
};

export const startCountdown = (dateTime: Date) => {
  const countDownDate = dateTime.getTime();

  const now = new Date().getTime();
  const distance = countDownDate - now;

  const days = Math.floor(distance / (1000 * 60 * 60 * 24));
  const hours = Math.floor(
    (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
  );
  const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((distance % (1000 * 60)) / 1000);

  return {
    days,
    hours,
    minutes,
    seconds,
  };
};

/* eslint-disable */
export function shuffle(array: any[]) {
  let currentIndex = array.length,
    randomIndex;

  while (currentIndex > 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ];
  }

  return array;
}

export const getTotalPrice = (cartItems: CartItem[]) => {
  const subtotal = cartItems.reduce(
    (acc, next) =>
      next.checked ? (acc += Number(next.price) * next.quantity) : acc,
    0,
  );
  const totalDelivery = cartItems.reduce(
    (acc, next) => (next.checked ? (acc += Number(next.delivery)) : acc),
    0,
  );
  const totalPrice = subtotal + totalDelivery;

  return {
    subtotal,
    totalDelivery: totalDelivery <= 0 ? "Free" : totalDelivery,
    totalPrice,
  };
};

export const getImgUrl = async (product: Product) => {
  const withUrls = await Promise.all(
    product.imgUrl.map(async (url) => {
      return !url.includes("unsplash")
        ? await s3.getSignedUrlPromise("getObject", {
            Bucket: "e-market-jiho",
            Key: url,
          })
        : url;
    }),
  );

  return { ...product, url: [...withUrls] } as ProductType;
};

export const getBannerImgUrl = async (banner: Banner) => {
  const url = !banner.imgUrl.includes("unsplash")
    ? await s3.getSignedUrlPromise("getObject", {
        Bucket: "e-market-jiho",
        Key: banner.imgUrl,
      })
    : banner.imgUrl;

  return { ...banner, url } as BannerType;
};

export const getOrderImgUrl = async (product: CartItem) => {
  const withUrls = await Promise.all(
    product.imgUrl.map(async (url) => {
      return !url.includes("unsplash")
        ? await s3.getSignedUrlPromise("getObject", {
            Bucket: "e-market-jiho",
            Key: url,
          })
        : url;
    }),
  );

  return { ...product, url: [...withUrls] } as CartItemWithUrl;
};
