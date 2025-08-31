"use client"

import { InfiniteScroll } from "@/components/inifinite-scroll";
import { DEFAULT_LIMIT } from "@/constants";
import { useIsMobile } from "@/hooks/use-mobile";
import VideoGridCard from "@/modules/videos/ui/components/video-grid-card";
import VideoRowCard from "@/modules/videos/ui/components/video-row-card";
import { useTRPC } from "@/trpc/client";
import { useInfiniteQuery } from "@tanstack/react-query";

interface ResultSectionProps {
    query: string | undefined;
    categoryId: string | undefined
}
export default function ResultsSection({
    query,
    categoryId,
}: ResultSectionProps) {
    const isMobile = useIsMobile();

    const trpc = useTRPC();
    const { data, hasNextPage, isFetchingNextPage, fetchNextPage } = useInfiniteQuery(trpc.search.getMany.infiniteQueryOptions({
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