import Link from "next/link";
import { CommentsGetManyOuput } from "../../type";
import { UserAvatar } from "@/components/user-avatar";
import { formatDistanceToNow } from "date-fns";
import { ko } from "date-fns/locale";

interface CommentItemProps {
    comment: CommentsGetManyOuput[number];
}
export default function CommentItem({
    comment,
}: CommentItemProps) {
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
                </div>
            </div>
        </div>
    );
}