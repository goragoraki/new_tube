import { VideoGetOneOutput } from "@/modules/videos/type"
import { AlertTriangleIcon } from "lucide-react";

interface VideoBannerProps {
    muxStatus: VideoGetOneOutput["muxStatus"]
}

export default function VideoBanner({ muxStatus }: VideoBannerProps) {
    if (muxStatus === "ready") return null;

    return (
        <div className="bg-yellow-300 py-3 px-4 rounded-b-xl flex items-center">
            <AlertTriangleIcon className="size-4 text-black shrink-0" />
            <p className="text-xs md:text-sm font-medium text-black line-clamp-1">
                업로드가 진행중인 영상입니다.
            </p>
        </div>
    );
}