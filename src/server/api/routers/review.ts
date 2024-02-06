import { z } from "zod";
import { createTRPCRouter, publicProcedure, userProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";

export const reviewRouter = createTRPCRouter({
  findProductReview: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const { id } = input;

      const reviews = await ctx.prisma.review.findMany({
        where: {
          productId: id,
        },
        include: {
          author: true,
        },
      });

      return reviews ? reviews : [];
    }),
  createReview: userProcedure
    .input(
      z.object({
        productId: z.string(),
        userId: z.string(),
        star: z.number(),
        comment: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { userId, productId, comment, star } = input;
      const review = await ctx.prisma.review.create({
        data: {
          userId,
          productId,
          comment,
          star,
        },
      });

      return review;
    }),
  findReview: userProcedure
    .input(z.object({ userId: z.string(), productId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { userId, productId } = input;

      const review = await ctx.prisma.review.findFirst({
        where: {
          userId,
          productId,
        },
      });

      return review ? review : false;
    }),
  getUserReviews: userProcedure
    .input(
      z.object({
        userId: z.string(),
      }),
    )
    .query(
      async ({ ctx, input }) =>
        await ctx.prisma.review.findMany({ where: { userId: input.userId } }),
    ),
});
