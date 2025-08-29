import { DEFAULT_LIMIT } from "@/constants";
import VideoView from "@/modules/videos/ui/views/video-view";
import { getQueryClient, HydrateClient, trpc } from "@/trpc/server";

interface PageProps {
    params: Promise<{
        videoId: string;
    }>;
    searchParams: Promise<{
        categoryId?: string;
    }>;
}

export default async function Page({ params, searchParams }: PageProps) {
    const { videoId } = await params;
    const { categoryId } = await searchParams;
    const queryClient = getQueryClient();
    void queryClient.prefetchQuery(trpc.videos.getOne.queryOptions({ id: videoId }))
    void queryClient.prefetchInfiniteQuery(trpc.comments.getMany.infiniteQueryOptions({ videoId, limit: DEFAULT_LIMIT }))
    void queryClient.prefetchInfiniteQuery(trpc.suggestions.getMany.infiniteQueryOptions({ videoId, limit: DEFAULT_LIMIT }))
    void queryClient.prefetchQuery(trpc.categories.getMany.queryOptions())

    return (
        <HydrateClient>
            <VideoView videoId={videoId} categoryId={categoryId} />
        </HydrateClient>
    );
}