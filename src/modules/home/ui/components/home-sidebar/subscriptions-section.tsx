"use client"

import { SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";
import { Skeleton } from "@/components/ui/skeleton";
import { UserAvatar } from "@/components/user-avatar";
import { HOME_LIMIT } from "@/constants";
import { useTRPC } from "@/trpc/client";
import { useInfiniteQuery } from "@tanstack/react-query";
import { ListIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function SubscriptionsSection() {
    const trpc = useTRPC();

    const pathname = usePathname();

    const { data, isLoading } = useInfiniteQuery(trpc.subscriptions.getMany.infiniteQueryOptions({
        limit: HOME_LIMIT,
    }, {
        getNextPageParam: (lastPage) => lastPage.nextCursor,
    }))


    return (
        <SidebarGroup>
            <SidebarGroupLabel>
                구독한 채널
            </SidebarGroupLabel>
            <SidebarGroupContent>
                <SidebarMenu>
                    {isLoading && <LoadingSkeleton />}
                    {!isLoading && data?.pages.flatMap((page) => page.items).map((subscription) => (
                        <SidebarMenuItem key={subscription.creatorId}>
                            <SidebarMenuButton
                                tooltip={subscription.user.name}
                                asChild
                                isActive={pathname === `/users/${subscription.user.id}`}
                            >
                                <Link href={`/users/${subscription.user.id}`} className="flex items-center gap-4">
                                    <UserAvatar
                                        size="xs"
                                        imageUrl={subscription.user.imageUrl}
                                        name={subscription.user.name}
                                    />
                                    <span className="text-sm">{subscription.user.name}</span>
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    ))}
                    {!isLoading && (
                        <SidebarMenuItem>
                            <SidebarMenuButton
                                asChild
                                isActive={pathname === "/subscriptions"}
                            >
                                <Link href="/subscriptions" className="flex items-center gap-4">
                                    <ListIcon className="size-4" />
                                    <span className="text-sm">구독한 채널 모두 보기</span>
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    )}
                </SidebarMenu>
            </SidebarGroupContent>
        </SidebarGroup>
    );
}

const LoadingSkeleton = () => {
    return (
        <>
            {[1, 2, 3, 4].map((i) => (
                <SidebarMenuItem key={i}>
                    <SidebarMenuButton disabled>
                        <Skeleton className="size-6 rounded-full shrink-0" />
                        <Skeleton className="h-4 w-full" />
                    </SidebarMenuButton>
                </SidebarMenuItem>
            ))

            }
        </>
    )
}