import Link from "next/link";
import { VideoGetManyOutput } from "../../type";
import { VideoThumnailSkeleton, VideoTumbnail } from "./video-thumbnail";
import VideoInfo, { VideoInfoSkeleton } from "./video-info";

interface VideoGridCardProps {
    data: VideoGetManyOutput["items"][number];
    onRemove?: () => void;
}

export default function VideoGridCard({
    data,
    onRemove,
}: VideoGridCardProps) {
    return (
        <div className="flex flex-col gap-2 w-full group">
            <Link href={`/videos/${data.id}`}>
                <VideoTumbnail
                    imageUrl={data.thumbnailUrl || undefined}
                    previewUrl={data.previewUrl || undefined}
                    title={data.title}
                    duration={data.duration ?? 0}
                />
            </Link>
            <VideoInfo data={data} onRemove={onRemove} />
        </div>
    )
}

export const VideoGridCardSkeleton = () => {
    return (
        <div className="flex flex-col gap-2 w-full">
            <VideoThumnailSkeleton />
            <VideoInfoSkeleton />
        </div>
    )
}

