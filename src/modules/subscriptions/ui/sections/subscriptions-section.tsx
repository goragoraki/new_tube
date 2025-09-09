'use client'

import { InfiniteScroll } from "@/components/inifinite-scroll";
import { HOME_LIMIT } from "@/constants";
import { useTRPC } from "@/trpc/client";
import { useMutation, useQueryClient, useSuspenseInfiniteQuery } from "@tanstack/react-query";
import Link from "next/link";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { toast } from "sonner";
import SubscriptionItem, { SubscriptionItemSkeleton } from "../components/subscription-item";

export default function SubscriptionsSection() {
    return (
        <Suspense fallback={<SubscriptionsSectionSkeleton />}>
            <ErrorBoundary fallback={<p>error....</p>}>
                <SubscriptionsSectionSuspense />
            </ErrorBoundary>
        </Suspense>
    );
}

function SubscriptionsSectionSkeleton({
}) {
    return (
        <div>
            <div className="gap-4 flex flex-col">
                {Array.from({ length: 8 }).map((_, idx) => (
                    <SubscriptionItemSkeleton key={idx} />
                ))}
            </div>

        </div>
    )
}

function SubscriptionsSectionSuspense() {
    const trpc = useTRPC();
    const queryClient = useQueryClient();

    const { data: subscriptions, hasNextPage, isFetchingNextPage, fetchNextPage } = useSuspenseInfiniteQuery(trpc.subscriptions.getMany.infiniteQueryOptions({
        limit: HOME_LIMIT,
    }, {
        getNextPageParam: (lastPage) => lastPage.nextCursor,
    }))

    const unsubscribe = useMutation(trpc.subscriptions.remove.mutationOptions({
        onSuccess: (data) => {
            toast.success("구독취소함");
            queryClient.invalidateQueries(trpc.users.getOne.queryFilter({ id: data.creatorId }))
            queryClient.invalidateQueries(trpc.videos.getManySubscribed.queryFilter());
            queryClient.invalidateQueries(trpc.subscriptions.getMany.infiniteQueryFilter())
        },
        onError: () => {
            toast.error("구독 취소 실패, 다시 시도해주세요")
        }
    }))

    return (
        <div>
            <div className="gap-4 gap-y-10 flex flex-col">
                {subscriptions.pages
                    .flatMap((page) => page.items)
                    .map((subscription) => (
                        <Link key={subscription.creatorId} href={`/users/${subscription.user.id}`}>
                            <SubscriptionItem
                                name={subscription.user.name}
                                imageUrl={subscription.user.imageUrl}
                                subscriberCount={subscription.user.subscriberCount}
                                onUnsubscribe={() => unsubscribe.mutate({ id: subscription.user.id })}
                                disabled={unsubscribe.isPending}
                            />
                        </Link>
                    ))
                }
            </div>
            <InfiniteScroll
                hasNextPage={hasNextPage}
                isFetchingNextPage={isFetchingNextPage}
                fetchNextPage={fetchNextPage}
            />
        </div>
    );
}