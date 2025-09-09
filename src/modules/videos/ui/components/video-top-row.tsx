"use client"

import { VideoGetOneOutput } from "../../type";
import VideoOwner from "./video-owner";
import VideoReactions from "./video-reactions";
import VideoMenu from "./video-menu";
import VideoDiscription, { VideoDescriptionSkeleton } from "./video-description";
import { useMemo } from "react";
import { format, formatDistanceToNow } from "date-fns";
import { ko } from "date-fns/locale";
import { Skeleton } from "@/components/ui/skeleton";

interface VideoTopRowProps {
    video: VideoGetOneOutput
}
export default function VideoTopRow({ video }: VideoTopRowProps) {
    const compactViews = useMemo(() => {
        return Intl.NumberFormat("ko", {
            notation: "compact",
        }).format(video.viewCount);
    }, [video.viewCount])

    const expanededViews = useMemo(() => {
        return Intl.NumberFormat("ko", {
            notation: "standard"
        }).format(video.viewCount);
    }, [video.viewCount])

    const compactDate = useMemo(() => {
        return formatDistanceToNow(video.createdAt, { addSuffix: true, locale: ko })
    }, [video.createdAt])

    const expandedDate = useMemo(() => {
        return format(video.createdAt, "yyyy.MM.dd")
    }, [video.createdAt])

    return (
        <div className="flex flex-col gap-4 mt-4">
            <h1 className="text-xl font-bold">{video.title}</h1>
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                <VideoOwner user={video.users} videoId={video.id} />
                <div className="flex overflow-x-auto sm:min-w-[cacl(50%-6px)] sm:justify-end sm:overflow-visible pb-2 mb-2 sm:pb-0 sm:mb-0 gap-2">
                    <VideoReactions
                        videoId={video.id}
                        likes={video.likedCount}
                        dislikes={video.dislikedCount}
                        viewerReaction={video.viewerReaction}
                    />
                    <VideoMenu videoId={video.id} variant="secondary" />
                </div>
            </div>
            <VideoDiscription
                expanededViews={expanededViews}
                compactViews={compactViews}
                expandedDate={expandedDate}
                compactDate={compactDate}
                description={video.description}
            />
        </div>
    );
}

export const VideoTopRowSkeleton = () => {
    return (
        <div className="flex flex-col gap-4 mt-4">
            <div className="flex flex-col gap-2">
                <Skeleton className="h-6 w-3/5 md:w-2/5" />
            </div>
            <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-3 w-[70%]">
                    <Skeleton className="w-10 h-10 rounded-full shrink-0" />
                    <div className="flex flex-col gap-1 w-full">
                        <Skeleton className="h-3 w-4/5 md:w-[20%]" />
                        <Skeleton className="h-3 w-3/5 md:w-[10%]" />
                    </div>
                </div>
                <Skeleton className="h-9 w-2/6 md:1/6 rounded-full" />
            </div>
            <div className="h-[120px] w-full bg-secondary/50 rounded-xl">
                <VideoDescriptionSkeleton />
            </div>
        </div>
    )
}