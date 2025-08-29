"use client"

import { DEFAULT_LIMIT } from "@/constants";
import { useTRPC } from "@/trpc/client";
import { useInfiniteQuery } from "@tanstack/react-query";
import CommentItem from "./comment-item";
import { CornerDownRightIcon, Loader2Icon } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CommentRepliesProps {
    parentId: string;
    videoId: string;
}

export default function CommentReplies({
    parentId,
    videoId,
}: CommentRepliesProps) {
    const trpc = useTRPC();
    const { data: comments, hasNextPage, isFetchingNextPage, fetchNextPage, isLoading } = useInfiniteQuery(trpc.comments.getMany.infiniteQueryOptions({
        videoId,
        parentId,
        limit: DEFAULT_LIMIT,
    }, {
        getNextPageParam: (lastPage) => lastPage.nextCursor,
    })) // prefetch하지 않게 컨디셔널이기때문에

    return (
        <div className="flex flex-col gap-4 mt-2">
            {
                isLoading && (
                    <div className="flex items-center justify-center">
                        <Loader2Icon className=" animate-spin text-muted-foreground size-6" />
                    </div>
                )
            }
            {
                !isLoading &&
                comments?.pages.flatMap((page) => page.items).map((comment) => (
                    <CommentItem
                        key={comment.id}
                        variant="reply"
                        comment={comment}
                    />
                ))}
            <div>
                {hasNextPage && (
                    <Button
                        variant="teriary"
                        size="sm"
                        onClick={() => fetchNextPage()}
                        disabled={isFetchingNextPage}
                    >
                        <CornerDownRightIcon />
                        답글 더보기
                    </Button>
                )}

            </div>
        </div>
    );
}