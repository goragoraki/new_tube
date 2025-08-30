
import Link from "next/link";
import { VideoGetManyOutput } from "../../type";
import { VideoTumbnail } from "./video-thumbnail";
import { useMemo } from "react";
import { formatDistanceToNow } from "date-fns";
import { ko } from "date-fns/locale";
import { UserAvatar } from "@/components/user-avatar";
import VideoMenu from "./video-menu";
import { Skeleton } from "@/components/ui/skeleton";

interface VideoInfoProps {
    data: VideoGetManyOutput["items"][number];
    onRemove?: () => void;
}

export default function VideoInfo({
    data,
    onRemove,
}: VideoInfoProps) {

    const compactDate = useMemo(() => {
        return formatDistanceToNow(data.createdAt, { addSuffix: true, locale: ko })
    }, [data.createdAt])

    const compactViews = useMemo(() => {
        return Intl.NumberFormat("ko", {
            notation: "compact",
        }).format(data.viewCount);
    }, [data.viewCount])

    return (
        <div className="flex gap-3">
            <UserAvatar imageUrl={data.user.imageUrl} name={data.user.name} />
            <div className="flex-1 min-w-0">
                <h3 className="font-medium line-clamp-1 lg:line-clamp-2 text-base break-words">
                    {data.title}
                </h3>
                <p className="text-xs text-muted-foreground px-[2px] font-medium">
                    {data.user.name}
                </p>
                <p className="text-xs text-muted-foreground mt-1 font-medium">
                    {`조회수 ${compactViews}회 • ${compactDate}`}
                </p>
            </div>
            <div className="flex-shrink-0">
                <VideoMenu videoId={data.id} onRemove={onRemove} />
            </div>
        </div>
    )
}

export const VideoInfoSkeleton = () => {
    return (
        <div className="flex gap-3">
            <Skeleton className="size-10 flex-shrink-0 rounded-full" />
            <div className="min-w-0 flex-1 space-y-2">
                <Skeleton className="h-5 w-[90%]" />
                <Skeleton className="h-5 w-[70%]" />
            </div>
        </div>
    )
}