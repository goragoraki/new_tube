import { db } from "@/db";
import { comments, users } from "@/db/schema";
import { baseProcedure, createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { TRPCError } from "@trpc/server";
import { and, desc, eq, getTableColumns, lt, or, count } from "drizzle-orm";
import z from "zod"

export const commentsRouter = createTRPCRouter({
    create: protectedProcedure
        .input(z.object({
            videoId: z.uuid(),
            value: z.string(),
        }))
        .mutation(async ({ ctx, input }) => {
            const { id: userId } = ctx.user;
            const { videoId, value } = input;

            const [createdComments] = await db
                .insert(comments)
                .values({
                    userId,
                    videoId,
                    value
                })
                .returning();

            return createdComments;
        }),
    remove: protectedProcedure
        .input(z.object({
            commentId: z.uuid(),
        }))
        .mutation(async ({ ctx, input }) => {
            const { id: userId } = ctx.user;
            const { commentId } = input;

            const [deletedComment] = await db
                .delete(comments)
                .where(and(
                    eq(comments.userId, userId),
                    eq(comments.id, commentId)
                ))
                .returning();

            if (!deletedComment) {
                throw new TRPCError({ code: "NOT_FOUND" });
            }

            return deletedComment;
        }),
    getMany: baseProcedure
        .input(z.object({
            videoId: z.uuid(),
            cursor: z.object({
                id: z.uuid(),
                updatedAt: z.date()
            }).nullish(),
            limit: z.number().min(1).max(100),
        }))
        .query(async ({ input }) => {
            const { videoId, cursor, limit } = input;

            const [[totalData], data] = await Promise.all([
                await db
                    .select({
                        count: count(),
                    })
                    .from(comments)
                    .where(eq(comments.videoId, videoId))
                ,
                await db
                    .select({
                        ...getTableColumns(comments),
                        user: users,
                    })
                    .from(comments)
                    .where(and(
                        eq(comments.videoId, videoId),
                        cursor
                            ? or(
                                lt(comments.updatedAt, cursor.updatedAt),
                                and(
                                    eq(comments.updatedAt, cursor.updatedAt),
                                    lt(comments.id, cursor.id)
                                )
                            )
                            : undefined
                    ))
                    .innerJoin(users, eq(comments.userId, users.id))
                    .orderBy(desc(comments.updatedAt), desc(comments.id))
                    .limit(limit + 1)
            ])

            const hasMore = data.length > limit;
            const items = hasMore ? data.slice(0, -1) : data;
            const lastItem = items[items.length - 1];
            const nextCursor = hasMore
                ? {
                    id: lastItem.id,
                    updatedAt: lastItem.updatedAt
                }
                : null;

            return {
                items,
                totalCount: totalData.count,
                nextCursor,
            };
        }),
})