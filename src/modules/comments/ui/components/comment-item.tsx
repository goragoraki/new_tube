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
import { MessagesSquareIcon, MoreVerticalIcon, Trash2Icon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth, useClerk } from "@clerk/nextjs";

interface CommentItemProps {
    comment: CommentsGetManyOuput["items"][number];
}
export default function CommentItem({
    comment,
}: CommentItemProps) {
    const trpc = useTRPC();
    const queryClient = useQueryClient();
    const { userId: userClerkId } = useAuth();
    const clerk = useClerk();

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

    return (
        <div>
            <div className="flex gap-4">
                <Link href={`/users/${comment.userId}`}>
                    <UserAvatar
                        size="lg"
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
                    {/*Todo reaction */}
                </div>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button size="icon" variant="ghost" className="size-8" >
                            <MoreVerticalIcon />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => { }}>
                            <MessagesSquareIcon className="size-4" />
                            답글
                        </DropdownMenuItem>
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
        </div>
    );
}