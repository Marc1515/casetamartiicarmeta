// src/modules/auth/adapters/output/next-auth/auth.config.ts
import type { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "@/shared/infrastructure/prisma/prisma";
import { authCallbacks } from "./auth.callbacks";
import { authEvents } from "./auth.events";

export const authOptions: NextAuthOptions = {
    adapter: PrismaAdapter(prisma),
    secret: process.env.NEXTAUTH_SECRET,
    session: {
        strategy: "jwt",
    },

    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        }),
    ],

    pages: {
        error: "/admin",
    },

    events: authEvents,
    callbacks: authCallbacks,
};