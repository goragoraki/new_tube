"use client"

import CommentForm from "@/modules/comments/ui/components/comment-from";
import CommentItem from "@/modules/comments/ui/components/comment-item";
import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

interface commentsSectionProps {
    videoId: string;
}

export default function CommentsSection({ videoId }: commentsSectionProps) {

    return (
        <Suspense fallback={<p>loading.....</p>}>
            <ErrorBoundary fallback={<p>error...</p>}>
                <CommentsSectionSuspense videoId={videoId} />
            </ErrorBoundary>
        </Suspense>
    );
}

export function CommentsSectionSuspense({ videoId }: commentsSectionProps) {
    const trpc = useTRPC();
    const { data: comments } = useSuspenseQuery(trpc.comments.getMany.queryOptions({ videoId }));
    return (
        <div className="mt-6">
            <div className="flex flex-col gap-6">
                <h1>
                    댓글 {0}개
                </h1>
                <CommentForm videoId={videoId} />
            </div>
            <div className="flex flex-col gap-4 mt-2">
                {comments.map((comment) => (
                    <CommentItem
                        key={comment.id}
                        comment={comment}
                    />
                ))}
            </div>
        </div>
    )
}