"use client"

import Link from "next/link";
import { CommentsGetManyOuput } from "../../type";
import { UserAvatar } from "@/components/user-avatar";
import { formatDistanceToNow } from "date-fns";
import { ko } from "date-fns/locale";
import { useTRPC } from "@/trpc/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ChevronDownIcon, ChevronUpIcon, FlagIcon, MoreVerticalIcon, ThumbsDownIcon, ThumbsUpIcon, Trash2Icon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth, useClerk } from "@clerk/nextjs";
import { cn } from "@/lib/utils";
import { useState } from "react";
import CommentForm from "./comment-form";
import CommentReplies from "./comment-replies";

interface CommentItemProps {
    comment: CommentsGetManyOuput["items"][number];
    variant?: "reply" | "comment";
}
export default function CommentItem({
    comment,
    variant = "comment",
}: CommentItemProps) {
    const trpc = useTRPC();
    const queryClient = useQueryClient();
    const { userId: userClerkId } = useAuth();
    const clerk = useClerk();

    const [isReplyOpen, setIsReplyOpen] = useState(false);
    const [isRepliesOpen, setIsRepliesOpen] = useState(false);


    const remove = useMutation(trpc.comments.remove.mutationOptions({
        onSuccess: () => {
            toast.success("댓글 삭제 완료")
            queryClient.invalidateQueries(trpc.comments.getMany.infiniteQueryFilter({ videoId: comment.videoId }))
        },
        onError: (error) => {
            if (error.data?.code === "UNAUTHORIZED") {
                clerk.openSignIn();
            } else {
                toast.error(error.message)
            }
        }
    }))

    const like = useMutation(trpc.commentReactions.like.mutationOptions({
        onSuccess: () => {
            queryClient.invalidateQueries(trpc.comments.getMany.infiniteQueryFilter({ videoId: comment.videoId }));
        },
        onError: (error) => {
            if (error.data?.code === "UNAUTHORIZED") {
                clerk.openSignIn();
            } else {
                toast.error(error.message)
            }
        }
    }))

    const dislike = useMutation(trpc.commentReactions.dislike.mutationOptions({
        onSuccess: () => {
            queryClient.invalidateQueries(trpc.comments.getMany.infiniteQueryFilter({ videoId: comment.videoId }));
        },
        onError: (error) => {
            if (error.data?.code === "UNAUTHORIZED") {
                clerk.openSignIn();
            } else {
                toast.error(error.message)
            }
        }
    }))

    return (
        <div>
            <div className="flex gap-4">
                <Link href={`/users/${comment.userId}`}>
                    <UserAvatar
                        size={variant === "comment" ? "lg" : "sm"}
                        imageUrl={comment.user.imageUrl}
                        name={comment.user.name}
                    />
                </Link>
                <div className="flex-1 min-w-0">
                    <Link href={`/users/${comment.userId}`}>
                        <div className="flex items-center gap-2 mb-0.5">
                            <span className="font-medium text-sm pb-0.5">
                                {`@${comment.user.name}`}
                            </span>
                            <span className="text-xs text-muted-foreground font-medium">
                                {formatDistanceToNow(comment.createdAt, {
                                    addSuffix: true,
                                    locale: ko
                                })}
                            </span>
                        </div>
                    </Link>
                    <p className="text-sm whitespace-pre-line">
                        {comment.value}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                        <div className="flex items-center">
                            <Button
                                disabled={false}
                                variant="ghost"
                                size="icon"
                                className="size-8 rounded-full hover:bg-gray-200"
                                onClick={() => like.mutate({ commentId: comment.id })}
                            >
                                <ThumbsUpIcon
                                    className={cn(
                                        comment.viewerReaction === "like" && "fill-black"
                                    )}
                                />
                            </Button>
                            <span className="text-xs text-muted-foreground">{comment.likeCount}</span>
                            <Button
                                disabled={false}
                                variant="ghost"
                                size="icon"
                                className="size-8 rounded-full hover:bg-gray-200"
                                onClick={() => dislike.mutate({ commentId: comment.id })}
                            >
                                <ThumbsDownIcon
                                    className={cn(
                                        comment.viewerReaction === "dislike" && "fill-black"
                                    )}
                                />
                            </Button>
                            <span className="text-xs text-muted-foreground">{comment.dislikeCount}</span>
                        </div>
                        {variant === "comment" && (
                            <Button
                                variant="ghost"
                                size="sm"
                                className="rounded-full h-8"
                                onClick={() => setIsReplyOpen(true)}
                            >
                                답글
                            </Button>
                        )}
                    </div>
                </div>
                <DropdownMenu modal={false}>
                    <DropdownMenuTrigger asChild>
                        <Button size="icon" variant="ghost" className="size-8" >
                            <MoreVerticalIcon />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        {
                            comment.user.clerkId !== userClerkId && (
                                <DropdownMenuItem onClick={() => { }}>
                                    <FlagIcon className="size-4" />
                                    신고
                                </DropdownMenuItem>
                            )
                        }
                        {
                            comment.user.clerkId === userClerkId && (
                                <DropdownMenuItem onClick={() => remove.mutate({ commentId: comment.id })}>
                                    <Trash2Icon className="size-4" />
                                    삭제
                                </DropdownMenuItem>
                            )
                        }
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
            {isReplyOpen && variant === "comment" && (
                <div className="mt-4 pl-14">
                    <CommentForm
                        videoId={comment.videoId}
                        variant="reply"
                        parentId={comment.id}
                        onCancel={() => setIsReplyOpen(false)}
                        onSuccess={() => {
                            setIsReplyOpen(false);
                            setIsRepliesOpen(true);
                        }}
                    />
                </div>
            )}
            <div className="pl-14">
                {comment.replyCount > 0 && variant === "comment" && (
                    <Button
                        size="sm"
                        variant="teriary"
                        onClick={() => setIsRepliesOpen((cur) => !cur)}
                        className="rounded-full"
                    >
                        {isRepliesOpen ? <ChevronUpIcon /> : <ChevronDownIcon />}
                        답글 {comment.replyCount}개
                    </Button>
                )}
                {
                    comment.replyCount > 0 && variant === "comment" && isRepliesOpen && (
                        <CommentReplies
                            parentId={comment.id}
                            videoId={comment.videoId}
                        />
                    )
                }
            </div>
        </div>
    );
}