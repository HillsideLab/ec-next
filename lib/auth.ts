import { betterAuth } from "better-auth"
import { prismaAdapter } from "better-auth/adapters/prisma"
import { nextCookies } from "better-auth/next-js"
import { PrismaClient } from "@/lib/generated/prisma/client"
import { PrismaPg } from "@prisma/adapter-pg"
import { customSession } from "better-auth/plugins";
import { createAuthMiddleware } from "better-auth/api";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
})
const prisma = new PrismaClient({ adapter })

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: true,
  },
  user: {
    additionalFields: {
      role: { type: "string", defaultValue: "user", input: false },
    },
  },
  hooks: {
    after: createAuthMiddleware(async (ctx) => {
      if (ctx.path.startsWith("/sign-in") || ctx.path.startsWith("/sign-up")) {
        const newSession = ctx.context.newSession;
        if (!newSession) return;

        const cookieHeader = ctx.headers?.get("cookie") ?? "";
        const sessionCartId = cookieHeader
          .split("; ")
          .find((row) => row.startsWith("sessionCartId="))
          ?.split("=")[1];

        if (!sessionCartId) return;

        const sessionCart = await prisma.cart.findFirst({
          where: { sessionCartId },
        });

        if (sessionCart) {
          await prisma.cart.deleteMany({
            where: { userId: newSession.user.id },
          });

          await prisma.cart.update({
            where: { id: sessionCart.id },
            data: { userId: newSession.user.id },
          });
        }
      }
    }),
  },
  plugins: [
    customSession(async ({ user, session }) => {
      const dbUser = await prisma.user.findUnique({
        where: { id: user.id },
        select: { role: true },
      });

      return {
        user: {
          ...user,
          role: dbUser?.role ?? "user",
        },
        session,
      };
    }),
    nextCookies(),
  ],
  advanced: {
    database: {
      generateId: () => crypto.randomUUID(),
    },
  },
})