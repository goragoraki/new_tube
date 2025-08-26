import { db } from "@/db";
import { commentReactions, comments, users } from "@/db/schema";
import { baseProcedure, createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { TRPCError } from "@trpc/server";
import { and, desc, eq, getTableColumns, lt, or, count, inArray, isNull, isNotNull } from "drizzle-orm";
import z from "zod"

export const commentsRouter = createTRPCRouter({
    create: protectedProcedure
        .input(z.object({
            parentId: z.uuid().nullish(),
            videoId: z.uuid(),
            value: z.string(),
        }))
        .mutation(async ({ ctx, input }) => {
            const { id: userId } = ctx.user;
            const { parentId, videoId, value } = input;

            const [existingComment] = await db
                .select()
                .from(comments)
                .where(inArray(comments.id, parentId ? [parentId] : []));

            if (!existingComment && parentId) {
                throw new TRPCError({ code: "NOT_FOUND" })
            }

            if (existingComment?.parentId && parentId) {
                throw new TRPCError({ code: "BAD_REQUEST" })
            }

            const [createdComments] = await db
                .insert(comments)
                .values({
                    parentId,
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
            parentId: z.uuid().nullish(),
            cursor: z.object({
                id: z.uuid(),
                updatedAt: z.date()
            }).nullish(),
            limit: z.number().min(1).max(100),
        }))
        .query(async ({ input, ctx }) => {
            const { clerkUserId } = ctx
            const { parentId, videoId, cursor, limit } = input;

            let userId;

            const [user] = await db
                .select()
                .from(users)
                .where(inArray(users.clerkId, clerkUserId ? [clerkUserId] : []))

            if (user) {
                userId = user.id
            }

            const viewerReactions = db.$with("viewer_reactions").as(
                db
                    .select({
                        commentId: commentReactions.commentsId,
                        type: commentReactions.type,
                    })
                    .from(commentReactions)
                    .where(inArray(commentReactions.userId, userId ? [userId] : []))
            );

            const replies = db.$with("replies").as(
                db.
                    select({
                        parentId: comments.parentId,
                        count: count(comments.id).as("count"),
                    })
                    .from(comments)
                    .where(isNotNull(comments.parentId))
                    .groupBy(comments.parentId)
            )

            const [[totalData], data] = await Promise.all([
                await db
                    .select({
                        count: count(),
                    })
                    .from(comments)
                    .where(eq(comments.videoId, videoId))
                ,
                await db
                    .with(viewerReactions, replies)
                    .select({
                        ...getTableColumns(comments),
                        user: users,
                        viewerReaction: viewerReactions.type,
                        replyCount: replies.count,
                        likeCount: db.$count(
                            commentReactions,
                            and(
                                eq(commentReactions.type, "like"),
                                eq(commentReactions.commentsId, comments.id),
                            )
                        ),
                        dislikeCount: db.$count(
                            commentReactions,
                            and(
                                eq(commentReactions.type, "dislike"),
                                eq(commentReactions.commentsId, comments.id),
                            )
                        ),
                    })
                    .from(comments)
                    .where(and(
                        eq(comments.videoId, videoId),
                        parentId
                            ? eq(comments.parentId, parentId)
                            : isNull(comments.parentId),
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
                    .leftJoin(viewerReactions, eq(comments.id, viewerReactions.commentId))
                    .leftJoin(replies, eq(comments.id, replies.parentId))
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