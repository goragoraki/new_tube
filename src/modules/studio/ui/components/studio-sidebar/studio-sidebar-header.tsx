"use client"

import { SidebarHeader, SidebarMenuButton, SidebarMenuItem, useSidebar } from "@/components/ui/sidebar";
import { Skeleton } from "@/components/ui/skeleton";
import { UserAvatar } from "@/components/user-avatar";
import { useUser } from "@clerk/nextjs";
import Link from "next/link";

export default function StudioSidebarHedaer() {
    const { user } = useUser();
    const { state } = useSidebar();

    if (!user) {
        return (
            <SidebarHeader className="flex items-center justify-center pb-4">
                <Skeleton className="size-[112px] rounded-full" />
                <div className="flex flex-col items-center justify-center mt-2 gap-y-2">
                    <Skeleton className="h-4 w-[80px]" />
                    <Skeleton className="h-4 w-[100px]" />
                </div>
            </SidebarHeader>
        )
    }

    if (state === "collapsed") {
        return (
            <SidebarMenuItem>
                <SidebarMenuButton tooltip="Your profile" asChild>
                    <Link href='/users/current' className="flex justify-center items-center">
                        <UserAvatar
                            imageUrl={user?.imageUrl}
                            name={user.fullName ?? "User"}
                            size="sm"
                        />
                    </Link>
                </SidebarMenuButton>
            </SidebarMenuItem>
        )
    }

    return (
        <SidebarHeader className="flex items-center justify-center pb-4">
            <Link href="/users/current">
                <UserAvatar
                    imageUrl={user?.imageUrl}
                    name={user?.fullName ?? "User"}
                    className="size-[112px] hover:opacity-80 transition-opacity"
                />
            </Link>
            <div className="flex flex-col items-center justify-center mt-2">
                <p className="text-base font-bold">내 채널</p>
                <p className="text-sm text-muted-foreground ">{user?.fullName ?? "User"}</p>
            </div>
        </SidebarHeader>
    );
}