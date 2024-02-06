import { z } from "zod";
import { adminProcedure, createTRPCRouter, publicProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";

export const categoryRouter = createTRPCRouter({
  withSubcategory: publicProcedure.query(async ({ ctx }) => {
    const categories = await ctx.prisma.category.findMany({
      include: {
        subcategory: true,
      },
    });

    return categories.sort(
      (a, b) => b.subcategory.length - a.subcategory.length,
    );
  }),
  getAllCategories: publicProcedure.query(async ({ ctx }) => {
    const categories = await ctx.prisma.category.findMany({
      include: {
        subcategory: true,
      },
    });

    return categories;
  }),
  addCategory: adminProcedure
    .input(
      z.object({
        name: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { name } = input;

      const category = await ctx.prisma.category.create({
        data: {
          name,
        },
      });
      return category;
    }),
  deleteCategory: adminProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { id } = input;

      const category = await ctx.prisma.category.delete({
        where: {
          id,
        },
      });

      if (!category) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "Cannot find Category",
        });
      }

      return category;
    }),
  updateCategory: adminProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { id, name } = input;

      const category = await ctx.prisma.category.update({
        where: {
          id,
        },
        data: {
          name,
        },
      });

      return category;
    }),
});
