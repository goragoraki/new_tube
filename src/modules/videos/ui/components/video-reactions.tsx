import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { ThumbsDownIcon, ThumbsUpIcon } from "lucide-react";

interface VideoReactonsProps {
    videoId: string
}


export default function VideoReactions({
    videoId,
}: VideoReactonsProps) {
    const viewerReaction = "like"

    return (
        <div className="flex items-center flex-none">
            <Button
                variant="secondary"
                className="rounded-l-full gap-2 pr-4 border-none"
            >
                <ThumbsUpIcon className={cn("size-5", viewerReaction === "like" && "fill-black")} />
                {1}
            </Button>
            <Separator orientation="vertical" className="h-7" />
            <Button
                variant="secondary"
                className="rounded-r-full border-none"
            >
                <ThumbsDownIcon className={cn("size-5", viewerReaction !== "like" && "fill-black")} />
            </Button>
        </div>
    );
}