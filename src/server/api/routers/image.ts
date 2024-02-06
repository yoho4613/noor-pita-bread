import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { s3 } from "~/lib/s3";

export const imageRouter = createTRPCRouter({
  getRandomImage: publicProcedure
    .input(z.object({ page: z.number(), query: z.string() }))
    .query(async ({ ctx, input }) => {
      const { page, query } = input;
      const url = `https://api.unsplash.com/search/photos?page=${page}&query=${query}&client_id=${process.env.IMAGE_API_KEY}`;
      const res = await fetch(url);
      /* eslint-disable */
      const data = await res.json();
      const image = data.results[0].urls.regular;

      return image;
    }),
  convertKeyToUrl: publicProcedure
    .input(z.array(z.string()))
    .query(async ({ ctx, input }) => {
      const urls = await Promise.all(
        input.map(async (url) => {
          return !url.includes("unsplash")
            ? await s3.getSignedUrlPromise("getObject", {
                Bucket: "e-market-jiho",
                Key: url,
              })
            : url;
        }),
      );

      return urls;
    }),
});
