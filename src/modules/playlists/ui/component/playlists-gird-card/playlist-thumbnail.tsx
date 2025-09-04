import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { THUMBNAIL_FALLBACK } from "@/modules/videos/constants";
import { ListVideoIcon, PlayIcon } from "lucide-react";
import Image from "next/image";
import { useMemo } from "react";

interface PlaylistThumbnailProps {
    title: string;
    videoCount: number;
    className?: string;
    imageUrl?: string | null;
}
export default function PlaylistThumbnail({
    title,
    videoCount,
    className,
    imageUrl,
}: PlaylistThumbnailProps) {
    const compactViews = useMemo(() => {
        return Intl.NumberFormat("ko", {
            notation: "compact"
        }).format(videoCount);
    }, [videoCount])
    return (
        <div className={cn("relative pt-3", className)}>
            {/** stack effect layers */}
            <div className="relative">
                {/** background layers */}
                <div className="bg-black/20 w-[97%] aspect-video rounded-xl overflow-hidden absolute -top-3 left-1/2 -translate-x-1/2" />
            </div>
            <div className="relative">
                {/** background layers */}
                <div className="bg-black/25 w-[98.5%] aspect-video rounded-xl overflow-hidden absolute -top-1.5 left-1/2 -translate-x-1/2" />
            </div>
            {/** main image */}
            <div className="relative overflow-hidden w-full rounded-xl aspect-video">
                <Image
                    src={imageUrl || THUMBNAIL_FALLBACK}
                    alt={title}
                    className="w-full h-full object-cover"
                    fill
                />

                {/** hover overlay */}
                <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <PlayIcon className="size-4 text-white fill-white" />
                    <span className="text-white font-medium">재생하기</span>
                </div>
            </div>

            {/** video count indicator */}
            <div className="absolute bottom-2 right-2 px-1 py-0.5 text-xs rounded bg-black/70 text-white font-medium flex items-center gap-x-1">
                <ListVideoIcon className="size-4" />
                {`동영상 ${compactViews}개`}
            </div>
        </div>
    );
}

export const PlaylistThumbnailSkeleton = () => {
    return (
        <div className="relative w-full overflow-hidden rounded-xl aspect-video">
            <Skeleton className="size-full" />
        </div>
    )
}