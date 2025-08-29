import { Skeleton } from "@/components/ui/skeleton";
import { cva, type VariantProps } from "class-variance-authority";
import Link from "next/link";
import { Suspense, useMemo } from "react";
import { VideoGetManyOutput } from "../../type";
import { ErrorBoundary } from "react-error-boundary";
import { VideoTumbnail } from "./video-thumbnail";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";
import { ko } from "date-fns/locale";
import VideoMenu from "./video-menu";


const videoRowCardVarients = cva("group flex min-w-0", {
    variants: {
        size: {
            default: "gap-4",
            compact: "gap-2",
        },
    },
    defaultVariants: {
        size: "default",
    }
});

const thumbnailVariants = cva("relative flex-none", {
    variants: {
        size: {
            default: "w-[38%]",
            compact: "w-[168px]"
        },
    },
    defaultVariants: {
        size: "default",
    }
});

interface VideoRowCardProps extends VariantProps<typeof videoRowCardVarients> {
    data: VideoGetManyOutput["items"][number];
    onRemove?: () => void;
}

export default function VideoRowCard({
    data,
    size,
    onRemove,
}: VideoRowCardProps) {
    const compactDate = useMemo(() => {
        return formatDistanceToNow(data.createdAt, { addSuffix: true, locale: ko })
    }, [data.createdAt])

    const compactViews = useMemo(() => {
        return Intl.NumberFormat("ko", {
            notation: "compact",
        }).format(data.viewCount);
    }, [data.viewCount])

    return (
        <div className={videoRowCardVarients({ size })}>
            <Link href={`/videos/${data.id}`}
                className={thumbnailVariants({ size })}>
                <VideoTumbnail
                    imageUrl={data.thumbnailUrl || undefined}
                    previewUrl={data.previewUrl || undefined}
                    title={data.title}
                    duration={data.duration ?? 0}
                />
            </Link>

            {/** info */}
            <Link href={`/videos/${data.id}`} className="flex-1 min-w-0">
                <div className="flex justify-between gap-x-2">
                    <div className="flex-1 min-w-0">
                        <h3 className={cn(
                            "font-medium line-clamp-2",
                            size === "compact" ? "text-sm" : "text-base"
                        )}>
                            {data.title}
                        </h3>
                        {size === "default" && (
                            <p className="text-xs text-muted-foreground px-[2px]">
                                {data.user.name}
                            </p>
                        )}
                        {size === "default" && (
                            <p className="text-xs text-muted-foreground mt-1">
                                {`조회수 ${compactViews}회 • ${compactDate}`}
                            </p>
                        )}
                        {size === "compact" && (
                            <p className="text-xs text-muted-foreground px-[2px]">
                                {data.user.name}
                            </p>
                        )}
                        {size === "compact" && (
                            <p className="text-xs text-muted-foreground mt-1">
                                {`조회수 ${compactViews}회 • ${compactDate}`}
                            </p>
                        )}
                    </div>
                    <div className="flex-none">
                        <VideoMenu videoId={data.id} onRemove={onRemove} />
                    </div>
                </div>

            </Link>

        </div>
    )
}
