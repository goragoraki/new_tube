'use client'

import { InfiniteScroll } from "@/components/inifinite-scroll";
import { HOME_LIMIT } from "@/constants";
import VideoGridCard, { VideoGridCardSkeleton } from "@/modules/videos/ui/components/video-grid-card";
import VideoRowCard, { VideoRowCardSkeleton } from "@/modules/videos/ui/components/video-row-card";
import { useTRPC } from "@/trpc/client";
import { useMutation, useQueryClient, useSuspenseInfiniteQuery } from "@tanstack/react-query";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { toast } from "sonner";

interface PlaylistVideosProps {
    playlistId: string;
}

export default function PlaylistVideosSection({
    playlistId,
}: PlaylistVideosProps) {
    return (
        <Suspense fallback={<PlaylistVideosSectionSkeleton />}>
            <ErrorBoundary fallback={<p>error....</p>}>
                <PlaylistVideosSectionSuspense playlistId={playlistId} />
            </ErrorBoundary>
        </Suspense>
    );
}

function PlaylistVideosSectionSkeleton({
}) {
    return (
        <div>
            <div className="gap-4 gap-y-10 flex flex-col md:hidden">
                {Array.from({ length: 8 }).map((_, idx) => (
                    <VideoGridCardSkeleton key={idx} />
                ))}
            </div>
            <div className="gap-4 md:flex flex-col hidden">
                {Array.from({ length: 8 }).map((_, idx) => (
                    <VideoRowCardSkeleton key={idx} size="compact" />
                ))}
            </div>

        </div>
    )
}

function PlaylistVideosSectionSuspense({
    playlistId
}: PlaylistVideosProps) {
    const trpc = useTRPC();
    const queryClient = useQueryClient();
    const { data: videos, hasNextPage, isFetchingNextPage, fetchNextPage } = useSuspenseInfiniteQuery(trpc.playlists.getVideos.infiniteQueryOptions({
        playlistId,
        limit: HOME_LIMIT,
    }, {
        getNextPageParam: (lastPage) => lastPage.nextCursor,
    }))

    const removeVideo = useMutation(trpc.playlists.removeVideo.mutationOptions({
        onSuccess: (data) => {
            toast.success("재생목록에서 비디오 삭제")
            queryClient.invalidateQueries(trpc.playlists.getMany.infiniteQueryFilter());
            queryClient.invalidateQueries(trpc.playlists.getManyForVideo.infiniteQueryFilter({ videoId: data.videoId }));
            queryClient.invalidateQueries(trpc.playlists.getOne.queryFilter({ playlistId: data.playlistId }))
            queryClient.invalidateQueries(trpc.playlists.getVideos.infiniteQueryFilter({ playlistId: data.playlistId }))
        },
        onError: () => {
            toast.error("재생목록에 비디오 추가 실패")
        }
    }))

    return (
        <div>
            <div className="gap-4 gap-y-10 flex flex-col md:hidden">
                {videos.pages
                    .flatMap((page) => page.items)
                    .map((video) => (
                        <VideoGridCard
                            key={video.id}
                            data={video}
                            onRemove={() => removeVideo.mutate({ playlistId, videoId: video.id })}
                        />
                    ))
                }
            </div>
            <div className="hidden gap-4 md:flex flex-col">
                {videos.pages
                    .flatMap((page) => page.items)
                    .map((video) => (
                        <VideoRowCard
                            key={video.id}
                            data={video}
                            size="compact"
                            onRemove={() => removeVideo.mutate({ playlistId, videoId: video.id })}
                        />
                    ))
                }
            </div>
            <InfiniteScroll
                hasNextPage={hasNextPage}
                isFetchingNextPage={isFetchingNextPage}
                fetchNextPage={fetchNextPage}
            />
        </div>
    );
}