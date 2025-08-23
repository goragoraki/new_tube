"use client"

import { cn } from "@/lib/utils";
import { useTRPC } from "@/trpc/client";
import { useMutation, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import VideoPlayer from "../components/video-player";
import VideoBanner from "../components/video-banner";
import VideoTopRow from "../components/video-top-row";
import { useAuth } from "@clerk/nextjs";

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
    const { isSignedIn } = useAuth();

    const trpc = useTRPC();
    const queryClient = useQueryClient();
    const { data: video } = useSuspenseQuery(trpc.videos.getOne.queryOptions({ id: videoId }));

    const createView = useMutation(trpc.videoViews.create.mutationOptions({
        onSuccess: () => {
            queryClient.invalidateQueries(
                trpc.videos.getOne.queryFilter({ id: videoId })
            )
        }
    }))

    const handlePlay = () => {
        if (!isSignedIn) return;

        createView.mutate({ videoId });
    }
    return (
        <>
            <div className={cn(
                "aspect-auto bg-black rounded-xl overflow-hidden relative",
                video.muxStatus !== "ready" && "rounded-b-none"
            )}>
                <VideoPlayer
                    autoPlay={false}
                    onPlay={handlePlay}
                    playbackId={video.muxPlayBackId}
                    thumbnailUrl={video.thumbnailUrl}
                />
            </div>
            <VideoBanner muxStatus={video.muxStatus} />
            <VideoTopRow video={video} />
        </>
    );
}