import { z } from "zod";
import { createTRPCRouter, userProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";

export const watchlistRouter = createTRPCRouter({
  updateWatchlist: userProcedure
    .input(z.object({ userId: z.string(), productId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { userId, productId } = input;

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

      if (user.watchlist.includes(productId)) {
        const userUpdate = await ctx.prisma.user.update({
          where: {
            id: userId,
          },
          data: {
            watchlist: user.watchlist.filter((id) => id !== productId),
          },
        });

        return userUpdate;
      } else {
        const userUpdate = await ctx.prisma.user.update({
          where: {
            id: userId,
          },
          data: {
            watchlist: [...user.watchlist, productId],
          },
        });
        return userUpdate;
      }
    }),
});
