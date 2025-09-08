'use client'

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useTRPC } from "@/trpc/client";
import { useMutation, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { Trash2Icon } from "lucide-react";
import { useRouter } from "next/navigation";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { toast } from "sonner";

interface PlaylistHeaderSectionProps {
    playlistId: string;
}
export default function PlaylistHeaderSection({
    playlistId
}: PlaylistHeaderSectionProps) {
    return (
        <Suspense fallback={<PlaylistHeaderSectionSkeleton />}>
            <ErrorBoundary fallback={<p>error....</p>}>
                <PlaylistHeaderSectionSuspense playlistId={playlistId} />
            </ErrorBoundary>
        </Suspense>
    );
}

function PlaylistHeaderSectionSuspense({
    playlistId,
}: PlaylistHeaderSectionProps) {
    const trpc = useTRPC();
    const router = useRouter();
    const queryClient = useQueryClient();
    const { data: playlist } = useSuspenseQuery(trpc.playlists.getOne.queryOptions({ playlistId }));
    const remove = useMutation(trpc.playlists.remove.mutationOptions({
        onSuccess: () => {
            toast.success("재생목록 삭제 완료");
            queryClient.invalidateQueries(trpc.playlists.getMany.infiniteQueryFilter())
            router.push(`/playlists`);
        },
        onError: (error) => {
            toast.error(error.message)
        }
    }))

    return (
        <div className="flex justify-between">
            <div>
                <h1 className="text-2xl font-semibold">{playlist?.name}</h1>
                <p className="text-xs text-muted-foreground">{playlist?.name}의 동영상 목록</p>
            </div>
            <Button
                type="button"
                size="icon"
                variant="outline"
                className="rounded-full"
                onClick={() => remove.mutate({ playlistId })}
                disabled={remove.isPending}
            >
                <Trash2Icon />
            </Button>
        </div>
    )
}

function PlaylistHeaderSectionSkeleton() {
    return (
        <div className="flex flex-col gap-y-2">
            <Skeleton className="h-6 w-24" />
            <Skeleton className="h-3 w-32" />
        </div>
    )
}