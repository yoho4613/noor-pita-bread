import {
  BannerPosition,
  Category,
  Order,
  Prisma,
  Product,
  Review,
  Subcategory,
} from "@prisma/client";
import { Session } from "next-auth";
import { z } from "zod";

export interface User {
  name: string;
  email: string;
  image?: string;
  cart: string[];
  watchlist: string[];
  purchase?: [];
  address: string[];
  Order: Order[];
}

export interface SessionType {
  update: UpdateSession;
  data: Session;
  status: string;
}

export interface CategoryWithSubCategory {
  id: string;
  name: string;
  subcategory: {
    id: string;
    name: string;
    categoryId: string;
  }[];
}

export interface Sale {
  id: string;
  title: string;
  subtitle: string | null;
  start: Date;
  expire: Date;
  method: $Enums.SaleMethod;
  value: number;
  Products: Product[];
}

export interface Product {
  id: string;
  title: string;
  type: string;
  description: string;
  rrp: string;
  price: string;
  imgUrl: string[];
  /* eslint-disable-next-line */
  attributes?: {
    [key: string]: string[];
  };
  review?: Review;
  delivery: number | null;
  stock: number;
  category?: Category;
  categoryId?: string;
  subcategory?: Subcategory;
  subcategoryId: string | null;
  order?: Order[];
  Sale?: Sale;
  saleId: string | null;
  createdAt: Date;
  updatedAt: Date;
  url?: string[];
}

export interface ProductType {
  id: string;
  title: string;
  type: string;
  description: string;
  rrp: string;
  price: string;
  imgUrl: string[];
  /* eslint-disable-next-line */
  attributes: {
    [key: string]: string[];
  } | null;
  review?: Review;
  delivery: number | null;
  stock: number;
  category?: Category;
  categoryId?: string;
  subcategory?: Subcategory;
  subcategoryId: string | null;
  order?: Order[];
  Sale?: Sale;
  saleId: string | null;
  createdAt: Date;
  updatedAt: Date;
  url?: string[];
}

export interface UserDetail {
  id: string;
  name: string | null;
  email: string;
  emailVerified: Date | null;
  image: string | null;
  cart: string[];
  watchlist: string[];
  purchase: Prisma.JsonValue;
  address: Address | null;
  role: string;
  createdAt: Date;
}

export interface Address {
  address: string;
  city: string;
  contact: string;
  code: string;
  country: string;
  name: string;
}

export interface CartItem extends Product {
  quantity: number;
  checked: boolean;
}

export type ProductForm = {
  title: string;
  description: string;
  type: string;
  rrp: string;
  price: string;
  stock: number;
  categoryId: string;
  subcategoryId: string;
  saleId: string;
  delivery: number;
  imgUrl: string[];
};

export type BannerPositionType = BannerPosition;

export type BannerType = {
  id: string;
  title: string;
  description: string;
  link: string;
  imgUrl: string;
  position: BannerPosition;
  url: string;
};

export interface OrderType {
  id: string;
  products: CartItemWithUrl[];
  paymentId: string;
  status: $Enums.OrderStatus;
  address: Prisma.JsonValue;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CartItemWithUrl extends CartItem {
  url: string[];
}
