'use client'

import { InfiniteScroll } from "@/components/inifinite-scroll";
import { HOME_LIMIT } from "@/constants";
import VideoGridCard, { VideoGridCardSkeleton } from "@/modules/videos/ui/components/video-grid-card";
import VideoRowCard, { VideoRowCardSkeleton } from "@/modules/videos/ui/components/video-row-card";
import { useTRPC } from "@/trpc/client";
import { useSuspenseInfiniteQuery } from "@tanstack/react-query";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

export default function LikedVideosSection() {
    return (
        <Suspense fallback={<LikedVideosSectionSkeleton />}>
            <ErrorBoundary fallback={<p>error....</p>}>
                <LikedVideosSectionSuspense />
            </ErrorBoundary>
        </Suspense>
    );
}

function LikedVideosSectionSkeleton({
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

function LikedVideosSectionSuspense() {
    const trpc = useTRPC();

    const { data: videos, hasNextPage, isFetchingNextPage, fetchNextPage } = useSuspenseInfiniteQuery(trpc.playlists.getLiked.infiniteQueryOptions({
        limit: HOME_LIMIT
    }, {
        getNextPageParam: (lastPage) => lastPage.nextCursor,
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