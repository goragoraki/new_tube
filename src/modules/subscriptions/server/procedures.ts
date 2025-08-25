import { db } from "@/db";
import { subscriptions } from "@/db/schema";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { TRPCError } from "@trpc/server";
import { and, eq } from "drizzle-orm";
import z from "zod"

export const subscriptionsRouter = createTRPCRouter({
    create: protectedProcedure
        .input(z.object({
            id: z.uuid()
        }))
        .mutation(async ({ ctx, input }) => {
            const { id: viewerId } = ctx.user;
            const { id: creatorId } = input;

            if (viewerId === creatorId) {
                throw new TRPCError({ code: "BAD_REQUEST" });
            }

            const [createdSubscription] = await db
                .insert(subscriptions)
                .values({
                    viewerId,
                    creatorId,
                })
                .returning();

            return createdSubscription
        }),
    remove: protectedProcedure
        .input(z.object({
            id: z.uuid()
        }))
        .mutation(async ({ ctx, input }) => {
            const { id: viewerId } = ctx.user;
            const { id: creatorId } = input;

            if (viewerId === creatorId) {
                throw new TRPCError({ code: "BAD_REQUEST" });
            }

            const [deletedSubscription] = await db
                .delete(subscriptions)
                .where(and(
                    eq(subscriptions.viewerId, viewerId),
                    eq(subscriptions.creatorId, creatorId),
                ))
                .returning();

            return deletedSubscription;
        })
})