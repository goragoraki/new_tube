"use client"

import { cn } from "@/lib/utils";
import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import VideoPlayer from "../components/video-player";
import VideoBanner from "../components/video-banner";
import VideoTopRow from "../components/video-top-row";

interface VideoSectionProps {
    videoId: string;
}
export default function VideoSection({ videoId }: VideoSectionProps) {

    return (
        <Suspense fallback={<p>loading....</p>}>
            <ErrorBoundary fallback={<p>errorr....</p>}>
                <VideoSectionSuspense videoId={videoId} />
            </ErrorBoundary>
        </Suspense>
    );
}

function VideoSectionSuspense({ videoId }: VideoSectionProps) {
    const trpc = useTRPC();
    const { data: video } = useSuspenseQuery(trpc.videos.getOne.queryOptions({ id: videoId }));

    return (
        <>
            <div className={cn(
                "aspect-auto bg-black rounded-xl overflow-hidden relative",
                video.muxStatus !== "ready" && "rounded-b-none"
            )}>
                <VideoPlayer
                    autoPlay={false}
                    onPlay={() => { }}
                    playbackId={video.muxPlayBackId}
                    thumbnailUrl={video.thumbnailUrl}
                />
            </div>
            <VideoBanner muxStatus={video.muxStatus} />
            <VideoTopRow video={video} />
        </>
    );
}