'use client'

import { InfiniteScroll } from "@/components/inifinite-scroll";
import { ResponsiveModal } from "@/components/reponsive-dialog";
import { Button } from "@/components/ui/button";
import { DEFAULT_LIMIT } from "@/constants";
import { useTRPC } from "@/trpc/client";
import { useInfiniteQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2Icon, SquareCheckIcon, SquareIcon } from "lucide-react";
import { toast } from "sonner";
import z from "zod";

interface PlaylistAddModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    videoId: string;
}

export default function PlaylistAddModal({
    open,
    onOpenChange,
    videoId,
}: PlaylistAddModalProps) {
    const trpc = useTRPC();
    const queryClient = useQueryClient();
    const { data: playlists, isLoading, hasNextPage, isFetchingNextPage, fetchNextPage } = useInfiniteQuery(trpc.playlists.getManyForVideo.infiniteQueryOptions({
        limit: DEFAULT_LIMIT,
        videoId: videoId,
    }, {
        getNextPageParam: (lastPage) => lastPage.nextCursor,
        enabled: !!videoId && open,
    }))

    const addVideo = useMutation(trpc.playlists.addVideo.mutationOptions({
        onSuccess: () => {
            toast.success("재생목록에 비디오 추가")
            queryClient.invalidateQueries(trpc.playlists.getMany.infiniteQueryFilter());
            queryClient.invalidateQueries(trpc.playlists.getManyForVideo.infiniteQueryFilter({ videoId }));
        },
        onError: () => {
            toast.error("재생목록에 비디오 추가 실패")
        }
    }))

    const removeVideo = useMutation(trpc.playlists.removeVideo.mutationOptions({
        onSuccess: () => {
            toast.success("재생목록에서 비디오 삭제")
            queryClient.invalidateQueries(trpc.playlists.getMany.infiniteQueryFilter());
            queryClient.invalidateQueries(trpc.playlists.getManyForVideo.infiniteQueryFilter({ videoId }));
        },
        onError: () => {
            toast.error("재생목록에 비디오 추가 실패")
        }
    }))

    const handleOpenChange = (newOpen: boolean) => {
        queryClient.resetQueries(trpc.playlists.getManyForVideo.infiniteQueryFilter());
        onOpenChange(newOpen);
    }

    return (
        <ResponsiveModal
            title="재생목록에 추가하기"
            open={open}
            onOpenChange={handleOpenChange}
        >
            <div className="flex flex-col gap-1">
                {isLoading && (
                    <Loader2Icon className="size-5 animate-spin text-muted-foreground" />
                )}
                {!isLoading && (
                    playlists?.pages
                        .flatMap((page) => page.items)
                        .map((playlist) => (
                            <Button
                                key={playlist.id}
                                variant="ghost"
                                className="w-full justify-start px-2 [&_svg]:size-5"
                                size="lg"
                                onClick={() => {
                                    if (playlist.containsVideo) {
                                        removeVideo.mutate({ playlistId: playlist.id, videoId })
                                    } else {
                                        addVideo.mutate({ playlistId: playlist.id, videoId })
                                    }
                                }}
                                disabled={removeVideo.isPending || addVideo.isPending}
                            >
                                {
                                    playlist.containsVideo ? (
                                        <SquareCheckIcon className="mr-2" />
                                    ) : (
                                        <SquareIcon className="mr-2" />
                                    )
                                }
                                {playlist.name}
                            </Button>
                        ))
                )}
                {!isLoading && (
                    <InfiniteScroll
                        isManual
                        hasNextPage={hasNextPage}
                        isFetchingNextPage={isFetchingNextPage}
                        fetchNextPage={fetchNextPage}
                    />
                )}
            </div>
        </ResponsiveModal>
    );
}