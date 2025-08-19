import { z } from "zod"
import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError, UTApi } from "uploadthing/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/db";
import { users, videos } from "@/db/schema";
import { and, eq } from "drizzle-orm";

const f = createUploadthing();


// FileRouter for your app, can contain multiple FileRoutes
export const ourFileRouter = {
    // Define as many FileRoutes as you like, each with a unique routeSlug
    thumbnailUploader: f({
        image: {
            /**
             * For full list of options and defaults, see the File Route API reference
             * @see https://docs.uploadthing.com/file-routes#route-config
             */
            maxFileSize: "4MB",
            maxFileCount: 1,
        },
    })
        // Set permissions and file types for this FileRoute
        .input(z.object({
            videoId: z.uuid()
        }))
        .middleware(async ({ req, input }) => {
            // This code runs on your server before upload
            const { userId: clerkUserId } = await auth();

            // If you throw, the user will not be able to upload
            if (!clerkUserId) throw new UploadThingError("Unauthorized");

            const [user] = await db
                .select()
                .from(users)
                .where(eq(users.clerkId, clerkUserId))

            if (!user) {
                throw new UploadThingError("Uhauthorized")
            }

            const [existingVideo] = await db
                .select({
                    thumbnailKey: videos.thumbnailKey
                })
                .from(videos)
                .where(and(
                    eq(videos.id, input.videoId),
                    eq(videos.userId, user.id)
                ))

            if (!existingVideo) throw new UploadThingError("Not Found");

            if (existingVideo.thumbnailKey) {
                const utapi = new UTApi();

                await utapi.deleteFiles(existingVideo.thumbnailKey);
                await db
                    .update(videos)
                    .set({ thumbnailKey: null, thumbnailUrl: null })
                    .where(and(
                        eq(videos.id, input.videoId),
                        eq(videos.userId, user.id),
                    ))
            }

            // Whatever is returned here is accessible in onUploadComplete as `metadata`
            return { user, ...input };
        })
        .onUploadComplete(async ({ metadata, file }) => {
            // This code RUNS ON YOUR SERVER after upload
            // console.log("Upload complete for userId:", metadata.userId);
            // console.log("file url", file.ufsUrl);

            await db
                .update(videos)
                .set({
                    thumbnailUrl: file.ufsUrl,
                    thumbnailKey: file.key,
                })
                .where(and(
                    eq(videos.id, metadata.videoId),
                    eq(videos.userId, metadata.user.id)
                ))

            // !!! Whatever is returned here is sent to the clientside `onClientUploadComplete` callback
            return { uploadedBy: metadata.user.id };
        }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
