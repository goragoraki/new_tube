'use client'

import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import UserPageBanner, { UserPageBannerSkeleton } from "../components/user-page-banner";
import UserPageInfo, { UserPageInfoSkeleton } from "../components/user-page-info";
import { Separator } from "@/components/ui/separator";

interface UserSectionProps {
    userId: string;
}
export default function UserSection({
    userId,
}: UserSectionProps) {
    return (
        <Suspense fallback={<UserSectionSkeleton />}>
            <ErrorBoundary fallback={<p>error.....</p>}>
                <UserSectionSuspense userId={userId} />
            </ErrorBoundary>
        </Suspense>
    );
}

function UserSectionSuspense({
    userId
}: UserSectionProps) {
    const trpc = useTRPC();

    const { data: user } = useSuspenseQuery(trpc.users.getOne.queryOptions({ id: userId }));
    return (
        <div className="flex flex-col">
            <UserPageBanner user={user} />
            <UserPageInfo user={user} />
            <Separator />
        </div>
    )
}

function UserSectionSkeleton() {
    return (
        <div className="flex flex-col">
            <UserPageBannerSkeleton />
            <UserPageInfoSkeleton />
        </div>
    )
}