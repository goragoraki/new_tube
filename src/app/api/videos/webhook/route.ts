import {
    VideoAssetCreatedWebhookEvent,
    VideoAssetDeletedWebhookEvent,
    VideoAssetErroredWebhookEvent,
    VideoAssetReadyWebhookEvent,
    VideoAssetTrackReadyWebhookEvent,
} from "@mux/mux-node/resources/webhooks"
import { headers } from "next/headers";

import { mux } from "@/lib/mux"
import { db } from "@/db";
import { videos } from "@/db/schema";
import { eq } from "drizzle-orm";
import { UTApi } from "uploadthing/server";

const SIGNING_SECRET = process.env.MUX_WEBHOOK_SECRET!;

type WebhookEvent =
    | VideoAssetCreatedWebhookEvent
    | VideoAssetReadyWebhookEvent
    | VideoAssetErroredWebhookEvent
    | VideoAssetTrackReadyWebhookEvent
    | VideoAssetDeletedWebhookEvent

export const POST = async (request: Request) => {
    if (!SIGNING_SECRET) {
        throw new Error("mux webhook secret is not set")
    }

    const headersPayload = await headers();
    const muxSignature = headersPayload.get("mux-signature");

    if (!muxSignature) {
        return new Response("No signature found", { status: 401 });
    }

    const payload = await request.json();
    const body = JSON.stringify(payload)

    mux.webhooks.verifySignature(
        body,
        {
            "mux-signature": muxSignature,
        },
        SIGNING_SECRET,
    )

    switch (payload.type as WebhookEvent["type"]) {
        case "video.asset.created": {
            const data = payload.data as VideoAssetCreatedWebhookEvent["data"];

            if (!data.upload_id) {
                return new Response("No upload id found", { status: 400 });
            }

            await db
                .update(videos)
                .set({
                    muxAssetId: data.id,
                    muxStatus: data.status,
                })
                .where(eq(videos.muxUploadId, data.upload_id))
            break;
        }

        case "video.asset.ready": {
            const data = payload.data as VideoAssetReadyWebhookEvent["data"];
            const playbackId = data.playback_ids?.[0].id

            if (!data.upload_id) {
                return new Response("Missing upload id found", { status: 400 });
            }

            if (!playbackId) {
                return new Response("Missing playback id found", { status: 400 });
            }

            const tempThumbnailUrl = `https://image.mux.com/${playbackId}/thumbnail.jpg`;
            const tempPreviewUrl = `https://image.mux.com/${playbackId}/animated.gif`;

            const utapi = new UTApi();
            const [
                uploadedThumbnail,
                uploadedPreview,
            ] = await utapi.uploadFilesFromUrl([
                tempThumbnailUrl,
                tempPreviewUrl,
            ])

            if (!uploadedThumbnail.data || !uploadedPreview.data) {
                return new Response("failed to upload thumbnail or preview", { status: 500 })
            }

            const { key: thumbnailKey, ufsUrl: thumbnailUrl } = uploadedThumbnail.data;
            const { key: previewKey, ufsUrl: previewUrl } = uploadedPreview.data;

            const duration = data.duration ? Math.round(data.duration * 1000) : 0;

            await db
                .update(videos)
                .set({
                    muxStatus: data.status,
                    muxPlayBackId: playbackId,
                    muxAssetId: data.id,
                    thumbnailUrl: thumbnailUrl,
                    thumbnailKey: thumbnailKey,
                    previewUrl: previewUrl,
                    previewKey: previewKey,
                    duration,
                })
                .where(eq(videos.muxUploadId, data.upload_id))
            break;
        }

        case "video.asset.errored": {
            const data = payload.data as VideoAssetErroredWebhookEvent["data"];
            if (!data.upload_id) {
                return new Response("Missing upload id found", { status: 400 });
            }

            await db
                .update(videos)
                .set({
                    muxStatus: data.status,
                })
                .where(eq(videos.muxUploadId, data.id));
            break;
        }

        case "video.asset.deleted": {
            const data = payload.data as VideoAssetDeletedWebhookEvent["data"];
            if (!data.upload_id) {
                return new Response("Missing upload id found", { status: 400 });
            }

            await db
                .delete(videos)
                .where(eq(videos.muxUploadId, data.upload_id));

            break;
        }

        case "video.asset.track.ready": {
            const data = payload.data as VideoAssetTrackReadyWebhookEvent["data"] & {
                asset_id: string;
            };

            const assetId = data.asset_id;
            const trackId = data.id;
            const status = data.status;

            await db
                .update(videos)
                .set({
                    muxTrackId: trackId,
                    muxTrackStatus: status,
                })
                .where(eq(videos.muxAssetId, assetId))

            break;
        }
    }

    return new Response("Webhook received", { status: 200 })
}