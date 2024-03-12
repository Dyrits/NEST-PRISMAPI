import { User as PrismaUser } from "@prisma/client";

export type NewUser = Omit<PrismaUser, "id" | "createdAt" | "updatedAt">;
export type SecureUser = Omit<PrismaUser, "password">;
export type User = PrismaUser;
