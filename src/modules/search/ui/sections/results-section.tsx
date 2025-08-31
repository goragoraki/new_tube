"use client"

import { InfiniteScroll } from "@/components/inifinite-scroll";
import { DEFAULT_LIMIT } from "@/constants";
import { useIsMobile } from "@/hooks/use-mobile";
import VideoGridCard, { VideoGridCardSkeleton } from "@/modules/videos/ui/components/video-grid-card";
import VideoRowCard, { VideoRowCardSkeleton } from "@/modules/videos/ui/components/video-row-card";
import { useTRPC } from "@/trpc/client";
import { useSuspenseInfiniteQuery } from "@tanstack/react-query";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

interface ResultSectionProps {
    query: string | undefined;
    categoryId: string | undefined
}

export default function ResultsSection({
    query,
    categoryId,
}: ResultSectionProps) {

    return (
        <Suspense
            key={`${query}-${categoryId}`}
            fallback={<ResultsSectionSkeleton />}>
            <ErrorBoundary fallback={<p>error....</p>}>
                <ResultsSectionSuspense query={query} categoryId={categoryId} />
            </ErrorBoundary>
        </Suspense>
    )
}

const ResultsSectionSkeleton = () => {
    return (
        <div>
            <div className="hidden flex-col gap-4 md:flex">
                {Array.from({ length: 5 }).map((_, idx) => (
                    <VideoRowCardSkeleton key={idx} />
                ))}

            </div>
            <div className="md:hidden flex flex-col gap-4 gap-y-10 pt-6">
                {Array.from({ length: 5 }).map((_, idx) => (
                    <VideoGridCardSkeleton key={idx} />
                ))}

            </div>
        </div>
    )
}

function ResultsSectionSuspense({
    query,
    categoryId,
}: ResultSectionProps) {
    const isMobile = useIsMobile();

    const trpc = useTRPC();
    const { data, hasNextPage, isFetchingNextPage, fetchNextPage } = useSuspenseInfiniteQuery(trpc.search.getMany.infiniteQueryOptions({
        query,
        categoryId,
        limit: DEFAULT_LIMIT,
    }, {
        getNextPageParam: (lastpage) => lastpage.nextCursor,
    }))

    return (
        <>
            {isMobile ? (
                <div className="flex flex-col gap-4 gap-y-10">
                    {data?.pages
                        .flatMap((page) => page.items)
                        .map((video) => (
                            <VideoGridCard key={video.id} data={video} />
                        ))}
                </div>
            ) : (
                <div className="flex flex-col gap-4">
                    {data?.pages
                        .flatMap((page) => page.items)
                        .map((video) => (
                            <VideoRowCard key={video.id} data={video} />
                        ))}

                </div>
            )}
            <InfiniteScroll
                hasNextPage={hasNextPage}
                isFetchingNextPage={isFetchingNextPage}
                fetchNextPage={fetchNextPage}
            />
        </>
    );
}