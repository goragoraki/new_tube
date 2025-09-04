import { Skeleton } from "@/components/ui/skeleton";
import { PlaylistGetManyOuput } from "@/modules/playlists/types";

interface PlaylistInfoProps {
    data: PlaylistGetManyOuput["items"][number];
}
export default function PlaylistInfo({
    data
}: PlaylistInfoProps) {

    return (
        <div className="flex gap-3">
            <div className="min-w-0 flex-1">
                <h3 className="font-medium line-clamp-1 lg:line-clamp-2 text-sm break-words">
                    {data.name}
                </h3>
                <p className="text-sm text-muted-foreground">재생목록</p>
                <p className="text-sm text-muted-foreground font-medium hover:text-primary">전체 재생목록 보기</p>
            </div>
        </div>
    );
}

export const PlaylistInfoSkeleton = () => {
    return (
        <div className="flex gap-3">
            <div className="min-w-0 flex-1 space-y-2">
                <Skeleton className="w-[90%] h-5" />
                <Skeleton className="w-[70%] h-5" />
                <Skeleton className="w-[50%] h-5" />
            </div>
        </div>
    )
}