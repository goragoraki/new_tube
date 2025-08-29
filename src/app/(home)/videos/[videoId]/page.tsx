import { DEFAULT_LIMIT } from "@/constants";
import VideoView from "@/modules/videos/ui/views/video-view";
import { getQueryClient, HydrateClient, trpc } from "@/trpc/server";

interface PageProps {
    params: Promise<{
        videoId: string;
    }>;
}

export default async function Page({ params }: PageProps) {
    const { videoId } = await params;

    const queryClient = getQueryClient();
    void queryClient.prefetchQuery(trpc.videos.getOne.queryOptions({ id: videoId }))
    void queryClient.prefetchInfiniteQuery(trpc.comments.getMany.infiniteQueryOptions({ videoId, limit: DEFAULT_LIMIT }))
    void queryClient.prefetchInfiniteQuery(trpc.suggestions.getMany.infiniteQueryOptions({ videoId, limit: DEFAULT_LIMIT }))

    return (
        <HydrateClient>
            <VideoView videoId={videoId} />
        </HydrateClient>
    );
}