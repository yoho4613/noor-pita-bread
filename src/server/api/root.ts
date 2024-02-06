import { createTRPCRouter } from "~/server/api/trpc";
import { userRouter } from "./routers/user";
import { adminRouter } from "./routers/admin";
import { categoryRouter } from "./routers/category";
import { subcategoryRouter } from "./routers/subcategory";
import { saleRouter } from "./routers/sale";
import { imageRouter } from "./routers/image";
import { bannerRouter } from "./routers/banner";
import { productRouter } from "./routers/product";
import { watchlistRouter } from "./routers/watchlist";
import { cartRouter } from "./routers/cart";
import { checkoutRouter } from "./routers/checkout";
import { reviewRouter } from "./routers/review";
import { orderRouter } from "./routers/order";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  user: userRouter,
  admin: adminRouter,
  category: categoryRouter,
  subCategory: subcategoryRouter,
  sale: saleRouter,
  image: imageRouter,
  banner: bannerRouter,
  product: productRouter,
  watchlist: watchlistRouter,
  cart: cartRouter,
  checkout: checkoutRouter,
  review: reviewRouter,
  order: orderRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
