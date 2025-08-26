import z from "zod"

import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { db } from "@/db";
import { commentReactions } from "@/db/schema";
import { and, eq } from "drizzle-orm";

export const commentReactionsRouter = createTRPCRouter({
    like: protectedProcedure
        .input(z.object({
            commentId: z.uuid()
        }))
        .mutation(async ({ ctx, input }) => {
            const { id: userId } = ctx.user;
            const { commentId } = input;

            const [existingCommentReactionsLike] = await db
                .select()
                .from(commentReactions)
                .where(and(
                    eq(commentReactions.userId, userId),
                    eq(commentReactions.commentsId, commentId),
                    eq(commentReactions.type, "like")
                ))

            if (existingCommentReactionsLike) {
                const [deletedCommentReactionsLike] = await db
                    .delete(commentReactions)
                    .where(and(
                        eq(commentReactions.userId, userId),
                        eq(commentReactions.commentsId, commentId)
                    ))
                    .returning();

                return deletedCommentReactionsLike;
            }

            const [createdCommentReactionsLike] = await db
                .insert(commentReactions)
                .values({
                    userId,
                    commentsId: commentId,
                    type: "like"
                })
                .onConflictDoUpdate({
                    target: [commentReactions.commentsId, commentReactions.userId],
                    set: {
                        type: "like"
                    }
                })
                .returning();

            return createdCommentReactionsLike;
        }),
    dislike: protectedProcedure
        .input(z.object({
            commentId: z.uuid()
        }))
        .mutation(async ({ ctx, input }) => {
            const { id: userId } = ctx.user;
            const { commentId } = input;

            const [existingCommentReactionsDislike] = await db
                .select()
                .from(commentReactions)
                .where(and(
                    eq(commentReactions.userId, userId),
                    eq(commentReactions.commentsId, commentId),
                    eq(commentReactions.type, "dislike")
                ))

            if (existingCommentReactionsDislike) {
                const [deletedCommentReactionsDislike] = await db
                    .delete(commentReactions)
                    .where(and(
                        eq(commentReactions.userId, userId),
                        eq(commentReactions.commentsId, commentId)
                    ))
                    .returning();

                return deletedCommentReactionsDislike;
            }

            const [createdCommentReactionsDislike] = await db
                .insert(commentReactions)
                .values({
                    userId,
                    commentsId: commentId,
                    type: "dislike"
                })
                .onConflictDoUpdate({
                    target: [commentReactions.commentsId, commentReactions.userId],
                    set: {
                        type: "dislike"
                    }
                })
                .returning();

            return createdCommentReactionsDislike;
        }),

})