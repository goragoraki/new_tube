"use client"

import Link from "next/link";
import { VideoGetOneOutput } from "../../type";
import { UserAvatar } from "@/components/user-avatar";
import { useAuth } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import SubscriptionsButton from "@/modules/subscriptions/ui/subscription-button";
import UserInfo from "@/modules/users/ui/components/user-info";
import { useSubscriptions } from "@/modules/subscriptions/hooks/use-subscription";

interface VideoOwnerProps {
    user: VideoGetOneOutput["users"];
    videoId: string;
}
export default function VideoOwner({ user, videoId }: VideoOwnerProps) {
    const { userId: clerkId, isLoaded } = useAuth();
    const { isPending, onClick } = useSubscriptions({
        userId: user.id,
        isSubscribed: user.viewerSubscribed,
        fromVideoId: videoId,
    })

    return (
        <div className="flex items-center justify-between sm:justify-start gap-3 min-w-0">
            <Link href={`/users/${user.id}`}>
                <div className="flex items-center gap-3 min-w-0">
                    <UserAvatar size="lg" imageUrl={user.imageUrl} name={user.name} />
                    <div className="flex flex-col min-w-0">
                        <UserInfo name={user.name} size="lg" />
                        {/** todo 구독자 명시하기 */}
                        <span className="text-sm text-muted-foreground font-medium">구독자 {user.subscriberCount}명</span>
                    </div>
                </div>
            </Link>
            {/** todo 구독중 고려하기*/}
            {user.clerkId === clerkId ? (
                <Button
                    className="rounded-full"
                    asChild
                >
                    <Link href={`/studio/videos/${videoId}`}>
                        동영상 수정
                    </Link>
                </Button>
            ) : (
                <SubscriptionsButton
                    onClick={onClick}
                    disabled={isPending || !isLoaded}
                    isSubscribed={user.viewerSubscribed}
                    className="rounded-full"
                    size="default"
                />
            )}
        </div>
    );
}