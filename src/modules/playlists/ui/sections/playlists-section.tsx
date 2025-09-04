'use client'

import { InfiniteScroll } from "@/components/inifinite-scroll";
import { HOME_LIMIT } from "@/constants";
import { useTRPC } from "@/trpc/client";
import { useSuspenseInfiniteQuery } from "@tanstack/react-query";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import PlaylistGridCard, { PlaylistGridCardSkeleton } from "../component/playlists-gird-card";

export default function PlaylistsSection() {
    return (
        <Suspense fallback={<PlaylistsSectionSkeleton />}>
            <ErrorBoundary fallback={<p>error....</p>}>
                <PlaylistsSectionSuspense />
            </ErrorBoundary>
        </Suspense>
    );
}

function PlaylistsSectionSkeleton({
}) {
    return (
        <div>
            <div className="gap-4 gap-y-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 [@media(min-width:2200px)]:grid-cols-4">
                {Array.from({ length: 8 }).map((_, idx) => (
                    <PlaylistGridCardSkeleton key={idx} />
                ))}
            </div>
        </div>
    )
}

function PlaylistsSectionSuspense() {
    const trpc = useTRPC();

    const { data: playlists, hasNextPage, isFetchingNextPage, fetchNextPage } = useSuspenseInfiniteQuery(trpc.playlists.getMany.infiniteQueryOptions({
        limit: HOME_LIMIT,
    }, {
        getNextPageParam: (lastPage) => lastPage.nextCursor,
    }))

    return (
        <div>
            <div className="gap-4 gap-y-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 [@media(min-width:2200px)]:grid-cols-4">
                {playlists.pages
                    .flatMap((page) => page.items)
                    .map((playlist) => (
                        <PlaylistGridCard
                            key={playlist.id}
                            data={playlist}
                        />
                    ))}

            </div>
            <InfiniteScroll
                hasNextPage={hasNextPage}
                isFetchingNextPage={isFetchingNextPage}
                fetchNextPage={fetchNextPage}
            />
        </div>
    );
}