import { z } from "zod";
import { adminProcedure, createTRPCRouter, publicProcedure } from "../trpc";
import { Banner, BannerPosition } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { getBannerImgUrl } from "~/lib/helper";
import { BannerType } from "~/config/type";
import { s3 } from "~/lib/s3";

export const bannerRouter = createTRPCRouter({
  getAllBanners: publicProcedure.query(async ({ ctx }) => {
    const banners = await ctx.prisma.banner.findMany();
    const bannersWithUrls: BannerType[] = [];

    for (const banner of banners) {
      if (banner.position !== "advertise") {
        const withUrl = await getBannerImgUrl(banner);
        bannersWithUrls.push(withUrl);
      } else {
        bannersWithUrls.push({ ...banner, url: banner.imgUrl });
      }
    }
    return bannersWithUrls;
  }),
  getTopBanners: publicProcedure.query(async ({ ctx }) => {
    const banners = await ctx.prisma.banner.findMany({
      where: { position: "homeTop" },
    });

    const bannersWithUrls: BannerType[] = [];
    for (const banner of banners) {
      if (banner.position !== "advertise") {
        const withUrl = await getBannerImgUrl(banner);
        bannersWithUrls.push(withUrl);
      } else {
        bannersWithUrls.push({ ...banner, url: banner.imgUrl });
      }
    }
    return bannersWithUrls;
  }),
  getHeroBanner: publicProcedure.query(async ({ ctx }) => {
    const banner = await ctx.prisma.banner.findFirst({
      where: {
        position: "heroAlone",
      },
    });
    if (banner) {
      return await getBannerImgUrl(banner);
    } else {
      new TRPCError({
        code: "NOT_FOUND",
        message: "Cannot find any banner",
      });
    }
  }),
  getTopbar: publicProcedure.query(
    async ({ ctx }) =>
      await ctx.prisma.banner.findMany({ where: { position: "advertise" } }),
  ),
  getNewBanners: publicProcedure
    .input(z.number())
    .query(async ({ ctx, input }) => {
      const banners = await ctx.prisma.banner.findMany({
        take: input,
        orderBy: {
          id: "desc",
        },
        where: {
          position: {
            not: "advertise",
          },
        },
      });
      const bannersWithUrls: BannerType[] = [];

      for (const banner of banners) {
        if (banner.position !== "advertise") {
          const withUrl = await getBannerImgUrl(banner);
          bannersWithUrls.push(withUrl);
        } else {
          bannersWithUrls.push({ ...banner, url: banner.imgUrl });
        }
      }
      return bannersWithUrls;
    }),
  addBanner: adminProcedure
    .input(
      z.object({
        title: z.string(),
        description: z.string(),
        link: z.string(),
        imgUrl: z.string(),
        position: z.custom<"homeTop" | "heroAlone" | "advertise" | "other">(
          (value) =>
            value === "homeTop" || "heroAlone" || "advertise" || "other",
        ),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { title, description, link, imgUrl, position } = input;
      const banner = await ctx.prisma.banner.create({
        data: {
          title,
          description,
          link,
          imgUrl,
          position,
        },
      });

      return banner;
    }),
  updateBanner: adminProcedure
    .input(
      z.object({
        id: z.string(),
        title: z.string(),
        description: z.string(),
        link: z.string(),
        imgUrl: z.string(),
        position: z.custom<"homeTop" | "heroAlone" | "advertise" | "other">(
          (value) =>
            value === "homeTop" || "heroAlone" || "advertise" || "other",
        ),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { id, title, description, link, imgUrl, position } = input;
      if (!id) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Cannot find product.",
        });
      }
      const banner = await ctx.prisma.banner.update({
        where: {
          id,
        },
        data: {
          title,
          description,
          link,
          imgUrl,
          position,
        },
      });

      if (!banner) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Failed to update Banner",
        });
      }

      return banner;
    }),
  deleteBanner: adminProcedure
    .input(z.object({ id: z.string(), imageKey: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { id, imageKey } = input;

      if (!id) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Cannot find product.",
        });
      }

      await s3
        .deleteObject({ Bucket: "e-market-jiho", Key: imageKey })
        .promise()
        .then((res) => console.log(res));

      const banner = await ctx.prisma.banner.delete({
        where: {
          id,
        },
      });

      if (!banner) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Failed to update Banner",
        });
      }

      return banner;
    }),
});
