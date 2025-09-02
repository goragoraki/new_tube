'use client'

import { InfiniteScroll } from "@/components/inifinite-scroll";
import { HOME_LIMIT } from "@/constants";
import VideoGridCard, { VideoGridCardSkeleton } from "@/modules/videos/ui/components/video-grid-card";
import { useTRPC } from "@/trpc/client";
import { useSuspenseInfiniteQuery } from "@tanstack/react-query";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

export default function SubscribedVideosSection() {
    return (
        <Suspense fallback={<SubscribedVideosSectionSkeleton />}>
            <ErrorBoundary fallback={<p>error....</p>}>
                <SubscribedVideosSectionSuspense />
            </ErrorBoundary>
        </Suspense>
    );
}

function SubscribedVideosSectionSkeleton({
}) {
    return (
        <div className="gap-4 gap-y-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 [@media(min-width:2200px)]:grid-cols-4">
            {Array.from({ length: 8 }).map((_, idx) => (
                <VideoGridCardSkeleton key={idx} />
            ))}
        </div>
    )
}

function SubscribedVideosSectionSuspense() {
    const trpc = useTRPC();

    const { data: videos, hasNextPage, isFetchingNextPage, fetchNextPage } = useSuspenseInfiniteQuery(trpc.videos.getManySubscribed.infiniteQueryOptions({
        limit: HOME_LIMIT,
    }, {
        getNextPageParam: (lastPage) => lastPage.nextCursor,
    }))

    return (
        <div>
            <div className="gap-4 gap-y-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 [@media(min-width:2200px)]:grid-cols-4">
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
            <InfiniteScroll
                hasNextPage={hasNextPage}
                isFetchingNextPage={isFetchingNextPage}
                fetchNextPage={fetchNextPage}
            />
        </div>
    );
}