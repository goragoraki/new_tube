"use client"

import { InfiniteScroll } from "@/components/inifinite-scroll";
import { DEFAULT_LIMIT } from "@/constants";
import CommentForm from "@/modules/comments/ui/components/comment-form";
import CommentItem from "@/modules/comments/ui/components/comment-item";
import { useTRPC } from "@/trpc/client";
import { useSuspenseInfiniteQuery } from "@tanstack/react-query";
import { Loader2Icon } from "lucide-react";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

interface commentsSectionProps {
    videoId: string;
}

export default function CommentsSection({ videoId }: commentsSectionProps) {

    return (
        <Suspense fallback={<CommentsSkeleton />}>
            <ErrorBoundary fallback={<p>error...</p>}>
                <CommentsSectionSuspense videoId={videoId} />
            </ErrorBoundary>
        </Suspense>
    );
}

export function CommentsSkeleton() {
    return (
        <div className="mt-6 flex justify-center items-center">
            <Loader2Icon className="animate-spin text-muted-foreground size-7" />
        </div>
    )
}

export function CommentsSectionSuspense({ videoId }: commentsSectionProps) {
    const trpc = useTRPC();
    const { data: comments, hasNextPage, isFetchingNextPage, fetchNextPage } = useSuspenseInfiniteQuery(trpc.comments.getMany.infiniteQueryOptions({
        videoId,
        limit: DEFAULT_LIMIT,
    }, {
        getNextPageParam: (lastPage) => lastPage.nextCursor,
    }
    ));
    return (
        <div className="mt-6">
            <div className="flex flex-col gap-6">
                <h1 className="text-lg font-semibold">
                    댓글 {comments.pages[0].totalCount}개
                </h1>
                <CommentForm videoId={videoId} />
            </div>
            <div className="flex flex-col gap-4 mt-2">
                {comments.pages.flatMap((page) => page.items).map((comment) => (
                    <CommentItem
                        key={comment.id}
                        comment={comment}
                    />
                ))}
                <InfiniteScroll
                    hasNextPage={hasNextPage}
                    isFetchingNextPage={isFetchingNextPage}
                    fetchNextPage={fetchNextPage}
                />
            </div>
        </div>
    )
}