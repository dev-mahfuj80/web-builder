import { PrismaClient } from "@prisma/client";

declare global {
  var prisma: PrismaClient | undefined;
}

export const db =
  globalThis.prisma ||
  new PrismaClient({
    log:
      process.env.NODE_ENV === "development"
        ? ["error", "info", "warn"]
        : ["error"],
  });

if (process.env.NODE_ENV !== "production") globalThis.prisma = db;
