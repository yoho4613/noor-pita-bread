import { z } from "zod";
import { adminProcedure, createTRPCRouter, publicProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";

export const subcategoryRouter = createTRPCRouter({
  getAllCategories: publicProcedure.query(async ({ ctx }) => {
    const categories = await ctx.prisma.subcategory.findMany({
      include: { category: true },
    });
    return categories;
  }),
  addCategory: adminProcedure
    .input(
      z.object({
        name: z.string(),
        categoryId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { name, categoryId } = input;

      const category = await ctx.prisma.subcategory.create({
        data: {
          name,
          categoryId,
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

      const category = await ctx.prisma.subcategory.delete({
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
        categoryId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { id, name, categoryId } = input;

      const category = await ctx.prisma.subcategory.update({
        where: {
          id,
        },
        data: {
          name,
          categoryId,
        },
      });
      return category;
    }),
});
