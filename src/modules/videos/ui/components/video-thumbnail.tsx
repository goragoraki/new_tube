import { formatDuration } from "@/lib/utils";
import Image from "next/image";

interface VideoTumbnailProps {
    title: string;
    duration: number;
    imageUrl?: string;
    previewUrl?: string;
}

export function VideoTumbnail({
    title,
    duration,
    imageUrl,
    previewUrl,
}: VideoTumbnailProps) {
    return (
        <div className="relative w-full group">
            {/** Thumbnail wrapper */}
            <div className="relative w-full overflow-hidden rounded-xl aspect-video">
                <Image
                    className="w-full h-full object-cover group-hover:opacity-0"
                    src={imageUrl ?? "/placeholder.svg"}
                    alt={title}
                    fill
                />
                <Image
                    unoptimized={!!previewUrl}
                    className="w-full h-full object-cover opacity-0 group-hover:opacity-100"
                    src={previewUrl ?? "/placeholder.svg"}
                    alt={title}
                    fill
                />
            </div>
            {/** Video duration box */}
            <div className=" absolute right-2 bottom-2 px-1 rounded bg-black/40 text-white text-[0.6rem] font-medium group-hover:opacity-0">
                {formatDuration(duration)}
            </div>
        </div>
    );
}