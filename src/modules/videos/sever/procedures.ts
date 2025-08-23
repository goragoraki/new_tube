import { db } from "@/db";
import { users, videos, videoUpdateSchema, videoViews } from "@/db/schema";
import { mux } from "@/lib/mux";
import { baseProcedure, createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { TRPCError } from "@trpc/server";
import { and, eq, getTableColumns } from "drizzle-orm";
import { z } from "zod"
import { UTApi } from "uploadthing/server";
import { workflow } from "@/lib/workflow";


export const videosRouter = createTRPCRouter({
    getOne: baseProcedure
        .input(z.object({ id: z.uuid() }))
        .query(async ({ ctx, input }) => {

            const [existingVideo] = await db
                .select({
                    ...getTableColumns(videos),
                    users: {
                        ...getTableColumns(users),
                    },
                    viewCount: db.$count(videoViews, eq(videoViews.videoId, videos.id))
                })
                .from(videos)
                .innerJoin(users, eq(videos.userId, users.id))
                .where(eq(videos.id, input.id))

            if (!existingVideo) {
                throw new TRPCError({ code: "NOT_FOUND" })
            }

            return existingVideo;
        })
    ,
    generateThumbnail: protectedProcedure
        .input(z.object({
            id: z.uuid(),
            prompt: z.string().min(10),
        }))
        .mutation(async ({ ctx, input }) => {
            const { id: userId } = ctx.user;

            const { workflowRunId } = await workflow.trigger({
                url: `${process.env.UPSTASH_WORKFLOW_URL}/api/videos/workflows/thumbnail`,
                body: {
                    userId,
                    videoId: input.id,
                    prompt: input.prompt,
                }
            })

            return workflowRunId;
        }),
    generateTitle: protectedProcedure
        .input(z.object({
            id: z.uuid()
        }))
        .mutation(async ({ ctx, input }) => {
            const { id: userId } = ctx.user

            const { workflowRunId } = await workflow.trigger({
                url: `${process.env.UPSTASH_WORKFLOW_URL}/api/videos/workflows/title`,
                body: {
                    userId,
                    videoId: input.id,
                },
            })

            return workflowRunId
        }),
    generateDescription: protectedProcedure
        .input(z.object({
            id: z.uuid()
        }))
        .mutation(async ({ ctx, input }) => {
            const { id: userId } = ctx.user

            const { workflowRunId } = await workflow.trigger({
                url: `${process.env.UPSTASH_WORKFLOW_URL}/api/videos/workflows/description`,
                body: {
                    userId,
                    videoId: input.id,
                },
            })

            return workflowRunId
        }),

    restoreThumbnail: protectedProcedure
        .input(z.object({
            id: z.uuid()
        }))
        .mutation(async ({ ctx, input }) => {
            const { id: userId } = ctx.user;

            const [existingVideo] = await db
                .select()
                .from(videos)
                .where(and(
                    eq(videos.id, input.id),
                    eq(videos.userId, userId)
                ))

            if (!existingVideo) {
                throw new TRPCError({ code: "NOT_FOUND" })
            }

            if (existingVideo.thumbnailKey) {
                const utapi = new UTApi();

                await utapi.deleteFiles(existingVideo.thumbnailKey);
                await db
                    .update(videos)
                    .set({ thumbnailKey: null, thumbnailUrl: null })
                    .where(and(
                        eq(videos.id, input.id),
                        eq(videos.userId, userId)
                    ))
            }

            if (!existingVideo.muxPlayBackId) {
                throw new TRPCError({ code: "BAD_REQUEST" })
            }

            const tempThumbnailUrl = `https://image.mux.com/${existingVideo.muxPlayBackId}/thumbnail.jpg`;

            const utapi = new UTApi();
            const uploadedThumbnail = await utapi.uploadFilesFromUrl(tempThumbnailUrl);

            if (!uploadedThumbnail.data) {
                throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" })
            }

            const { key: thumbnailKey, ufsUrl: thumbnailUrl } = uploadedThumbnail.data;

            const [updatedVideo] = await db
                .update(videos)
                .set({
                    thumbnailUrl,
                    thumbnailKey,
                })
                .where(and(
                    eq(videos.id, input.id),
                    eq(videos.userId, userId)
                ))
                .returning();

            return updatedVideo
        }),

    remove: protectedProcedure
        .input(z.object({
            id: z.uuid()
        }))
        .mutation(async ({ ctx, input }) => {
            const { id: userId } = ctx.user;

            const [removedVideo] = await db
                .delete(videos)
                .where(and(
                    eq(videos.id, input.id),
                    eq(videos.userId, userId),
                ))
                .returning();

            if (!removedVideo) {
                throw new TRPCError({ code: "NOT_FOUND" })
            }

            console.log(removedVideo)

            return removedVideo
        })
    ,
    update: protectedProcedure
        .input(videoUpdateSchema)
        .mutation(async ({ ctx, input }) => {
            const { id: userId } = ctx.user;

            if (!input.id) {
                throw new TRPCError({ code: "BAD_REQUEST" })
            }

            const [updatedVideo] = await db
                .update(videos)
                .set({
                    title: input.title,
                    description: input.description,
                    categoryId: input.categoryId,
                    visibility: input.visibility,
                    updatedAt: new Date(),
                })
                .where(and(
                    eq(videos.id, input.id),
                    eq(videos.userId, userId)
                ))
                .returning();

            if (!updatedVideo) {
                throw new TRPCError({ code: "NOT_FOUND" });
            }

            return updatedVideo
        })
    ,
    create: protectedProcedure
        .mutation(async ({ ctx }) => {
            const { id: userId } = ctx.user;
            const upload = await mux.video.uploads.create({
                new_asset_settings: {
                    passthrough: userId, //metadata
                    playback_policies: ["public"],
                    input: [
                        {
                            generated_subtitles: [
                                {
                                    language_code: "en",
                                    name: "English",
                                }
                            ]
                        }
                    ]
                },
                cors_origin: "*", // todo : in production, set to your url
            })

            //throw new Error({code:BAD_REQUEST, message: "Specific message"})

            const [video] = await db
                .insert(videos)
                .values({
                    userId,
                    title: "Untitled",
                    muxStatus: "waiting",
                    muxUploadId: upload.id,
                })
                .returning();

            return {
                video: video,
                url: upload.url,
            }
        })
})