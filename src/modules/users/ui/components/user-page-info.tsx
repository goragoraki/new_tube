'use client'

import { UserAvatar } from "@/components/user-avatar";
import { UsersGetOneOutput } from "../../type";
import { useAuth, useClerk } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import SubscriptionsButton from "@/modules/subscriptions/ui/subscription-button";
import { useSubscriptions } from "@/modules/subscriptions/hooks/use-subscription";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

interface UserPageInfoProps {
    user: UsersGetOneOutput;
}

export function UserPageInfoSkeleton() {
    return (
        <div className="py-6">
            {/** mobile layout */}
            <div className="flex flex-col md:hidden">
                <div className="flex items-center gap-3">
                    <Skeleton className="h-[60px] w-[60px] rounded-full" />
                    <div className="flex-1 min-w-0">
                        <Skeleton className="h-6 w-32" />
                        <Skeleton className="h-3 w-48 mt-1" />
                    </div>
                </div>
                <Skeleton className="h-10 w-full mt-3 rounded-full" />
            </div>

            {/** desktop layout */}
            <div className="md:flex hidden items-start gap-4">
                <Skeleton className="w-[160px] h-[160px] rounded-full" />
                <div className="flex flex-col">
                    <Skeleton className="w-32 h-10" />
                    <Skeleton className="w-48 h-6 mt-3" />
                    <Skeleton className="w-32 h-8 rounded-full mt-3" />
                </div>
            </div>
        </div>

    )
}

export default function UserPageInfo({
    user
}: UserPageInfoProps) {
    const { userId: userClerkId, isLoaded } = useAuth();
    const clerk = useClerk();
    const { isPending, onClick } = useSubscriptions({
        userId: user.id,
        isSubscribed: user.viewerSubscribed,
    })

    return (
        <div className="py-6">
            {/** mobile layout */}
            <div className="flex flex-col md:hidden">
                <div className="flex items-center gap-3">
                    <UserAvatar
                        imageUrl={user.imageUrl}
                        name={user.name}
                        size="lg"
                        className="h-[60px] w-[60px]"
                        onClick={() => {
                            if (userClerkId === user.clerkId) {
                                clerk.openUserProfile();
                            }
                        }}
                    />
                    <div className="flex-1 min-w-0">
                        <h1 className="text-xl font-bold">{user.name}</h1>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                            <span className="text-xs text-muted-foreground font-medium">구독자 {user.subscriberCount}명 &bull; 동영상 {user.videoCount}개</span>
                        </div>
                    </div>
                </div>
                {userClerkId === user.clerkId ? (
                    <Button
                        type="button"
                        asChild
                        className="w-full mt-3 rounded-full"
                        variant="secondary"
                    >
                        <Link href="/studio">
                            내 스튜디오로 가기
                        </Link>
                    </Button>
                ) : (
                    <SubscriptionsButton
                        onClick={onClick}
                        isSubscribed={user.viewerSubscribed}
                        disabled={isPending || !isLoaded}
                        className="w-full mt-3"
                    />
                )
                }
            </div>

            {/** Desktop layout */}
            <div className="md:flex hidden items-start gap-4">
                <UserAvatar
                    imageUrl={user.imageUrl}
                    name={user.name}
                    size="xl"
                    className={cn(userClerkId === user.clerkId && "cursor-pointer hover:opacity-80 transition-opacity duration-300")}
                    onClick={() => {
                        if (userClerkId === user.clerkId) {
                            clerk.openUserProfile();
                        }
                    }}
                />
                <div className="flex-1 min-w-0">
                    <h1 className="text-4xl font-bold">{user.name}</h1>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground font-medium mt-3">
                        <span>구독자 {user.subscriberCount}명 &bull; 동영상 {user.videoCount}개</span>
                    </div>
                    {userClerkId === user.clerkId ? (
                        <Button
                            type="button"
                            asChild
                            className="mt-3 rounded-full"
                            variant="secondary"
                        >
                            <Link href="/studio">
                                내 스튜디오로 가기
                            </Link>
                        </Button>
                    ) : (
                        <SubscriptionsButton
                            onClick={onClick}
                            isSubscribed={user.viewerSubscribed}
                            disabled={isPending || !isLoaded}
                            className="mt-3"
                        />
                    )
                    }
                </div>
            </div>

        </div>
    );
}