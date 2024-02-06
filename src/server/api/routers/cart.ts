import { z } from "zod";
import { createTRPCRouter, publicProcedure, userProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";

export const cartRouter = createTRPCRouter({
  updateCart: userProcedure
    .input(z.object({ userId: z.string(), productId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { userId, productId } = input;
      console.log(userId);
      console.log(productId);

      const user = await ctx.prisma.user.findFirst({
        where: {
          id: userId,
        },
      });

      if (!user) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Cannot find User",
        });
      }

      if (user.cart.includes(productId)) {
        const userUpdate = await ctx.prisma.user.update({
          where: {
            id: userId,
          },
          data: {
            cart: user.cart.filter((id) => id !== productId),
          },
        });
        console.log("remove from cart");
        console.log(userUpdate.cart);
        return userUpdate;
      } else {
        const userUpdate = await ctx.prisma.user.update({
          where: {
            id: userId,
          },
          data: {
            cart: [...user.cart, productId],
          },
        });
        return userUpdate;
      }
    }),
  updateUserCart: userProcedure
    .input(z.object({ id: z.string(), productId: z.array(z.string()) }))
    .mutation(async ({ ctx, input }) => {
      const { id, productId } = input;

      const user = await ctx.prisma.user.findFirst({
        where: { id },
      });

      const newCart = [];

      if (user?.cart) {
        for (const item of user?.cart) {
          if (!productId.includes(item)) {
            newCart.push(item);
          }
        }
      }

      const updatedUser = await ctx.prisma.user.update({
        where: { id },
        data: {
          cart: newCart,
        },
      });

      return updatedUser;
    }),
});
