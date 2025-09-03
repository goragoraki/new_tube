import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { ThumbsDownIcon, ThumbsUpIcon } from "lucide-react";
import { VideoGetOneOutput } from "../../type";
import { useClerk } from "@clerk/nextjs";
import { useTRPC } from "@/trpc/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface VideoReactonsProps {
    videoId: string;
    likes: number;
    dislikes: number;
    viewerReaction: VideoGetOneOutput["viewerReaction"]
}


export default function VideoReactions({
    videoId,
    likes,
    dislikes,
    viewerReaction,
}: VideoReactonsProps) {
    const clerk = useClerk();
    const queryClient = useQueryClient();

    const trpc = useTRPC();

    const like = useMutation(trpc.videoReactions.like.mutationOptions({
        onSuccess: () => {
            queryClient.invalidateQueries(trpc.videos.getOne.queryFilter({ id: videoId }));
            queryClient.invalidateQueries(trpc.playlists.getLiked.infiniteQueryFilter());
        },
        onError: (error) => {
            if (error.data?.code === "UNAUTHORIZED") {
                clerk.openSignIn();
            }
        }
    }));

    const dislike = useMutation(trpc.videoReactions.dislike.mutationOptions({
        onSuccess: () => {
            queryClient.invalidateQueries(trpc.videos.getOne.queryFilter({ id: videoId }));
            queryClient.invalidateQueries(trpc.playlists.getLiked.infiniteQueryFilter());
        },
        onError: (error) => {
            if (error.data?.code === "UNAUTHORIZED") {
                clerk.openSignIn();
            }
        }
    }))

    const handleLike = () => {
        like.mutate({ videoId });
    }

    const handleDislke = () => {
        dislike.mutate({ videoId })
    }

    return (
        <div className="flex items-center flex-none">
            <Button
                variant="secondary"
                className="rounded-l-full gap-2 pr-4 border-none hover:bg-gray-200/70"
                disabled={like.isPending || dislike.isPending}
                onClick={handleLike}
            >
                <ThumbsUpIcon className={cn("size-5", viewerReaction === "like" && "fill-black")} />
                {likes}
            </Button>
            <Separator orientation="vertical" className="h-7" />
            <Button
                variant="secondary"
                className="rounded-r-full border-none hover:bg-gray-200/70"
                disabled={like.isPending || dislike.isPending}
                onClick={handleDislke}
            >
                <ThumbsDownIcon className={cn("size-5", viewerReaction === "dislike" && "fill-black")} />
                {dislikes}
            </Button>
        </div>
    );
}