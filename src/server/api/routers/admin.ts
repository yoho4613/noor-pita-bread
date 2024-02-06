import { TRPCError } from "@trpc/server";
import { adminProcedure, createTRPCRouter, publicProcedure } from "../trpc";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { SignJWT } from "jose";
import { nanoid } from "nanoid";
// import { getJwtSecretKey } from "~/lib/auth";
import cookie from "cookie";
import { getJwtSecretKey } from "~/lib/auth";

export const adminRouter = createTRPCRouter({
  // getAllUsers: adminProcedure.query(async ({ ctx, input }) => {
  //   return await ctx.prisma.user.findMany();
  // }),
  signupUser: adminProcedure
    .input(
      z.object({
        name: z.string(),
        email: z.string(),
        password: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { email, password, name } = input;
      if (!email || !password || !name) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "Missing Information",
        });
      }
      const hasedPassword = await bcrypt.hash(password, 10);

      const user_exist = await ctx.prisma.admin.findUnique({
        where: { email },
      });

      if (user_exist) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "User already exists",
        });
      }

      const user = await ctx.prisma.admin.create({
        data: {
          name,
          email,
          password: hasedPassword,
        },
      });

      await ctx.prisma.account.create({
        data: {
          userId: user.id,
          type: "oauth",
          provider: "jwt-auth-credentials",
          providerAccountId: process.env.JWT_SECRET!,
        },
      });

      return { success: true };
    }),

  loginUser: publicProcedure
    .input(
      z.object({
        email: z.string(),
        password: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { res } = ctx;
      const { email, password } = input;

      const user = await ctx.prisma.admin.findFirst({
        where: { email },
      });

      const passwordMatch =
        user?.password && (await bcrypt.compare(password, user.password));

      if (!user || !passwordMatch || !email || !password) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Invalid email or password",
        });
      }

      const token = await new SignJWT({})
        .setProtectedHeader({ alg: "HS256" })
        .setJti(nanoid())
        .setIssuedAt()
        .setExpirationTime("24h")
        .sign(new TextEncoder().encode(getJwtSecretKey()));

      res.setHeader(
        "Set-Cookie",
        cookie.serialize("emarket-admin-token", token, {
          httpOnly: true,
          path: "/",
          secure: process.env.NODE_ENV === "production",
        }),
      );

      return { success: true };
    }),

  findUser: adminProcedure
    .input(
      z.object({
        email: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { email } = input;
      const token =
        ctx.req.cookies["next-auth.session-token"] ??
        ctx.req.cookies["__Secure-next-auth.session-token"];

      if (!token) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Token does not exist. User may not loggedin",
        });
      }

      // const session = await ctx.prisma.session.findFirst({
      //   where: {
      //     sessionToken: token,
      //   },
      // });

      // if (!session) {
      //   throw new TRPCError({
      //     code: "BAD_REQUEST",
      //     message: "Session does not exist",
      //   });
      // }

      const user = await ctx.prisma.admin.findFirst({
        where: {
          email,
        },
      });

      if (!user) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "No user found",
        });
      }

      return user;
    }),

  logout: publicProcedure.mutation(({ ctx }) => {
    const { res } = ctx;

    res.setHeader(
      "Set-Cookie",
      cookie.serialize("emarket-admin-token", "", {
        httpOnly: true,
        path: "/",
        expires: new Date(0),
        secure: process.env.NODE_ENV === "production",
      }),
    );

    return { success: true };
  }),
  pauseShop: adminProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { id } = input;
      const admin = await ctx.prisma.admin.findFirst({ where: { id } });

      if (!admin) {
        return new TRPCError({
          message: "No User Found",
          code: "NOT_FOUND",
        });
      }

      if (admin.role === "admin" || admin.role === "superadmin") {
        // Shop Paused Logic
      }
    }),

  // deleteUser: adminProcedure
  //   .input(
  //     z.object({
  //       id: z.string(),
  //     })
  //   )
  //   .mutation(async ({ ctx, input }) => {
  //     const { id } = input;
  //     return await ctx.prisma.user.delete({
  //       where: {
  //         id,
  //       },
  //     });
  //   }),
});
