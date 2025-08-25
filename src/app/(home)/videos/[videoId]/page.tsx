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
    //TODO: dont forget to change to prefetchInfinite!!
    void queryClient.prefetchQuery(trpc.comments.getMany.queryOptions({ videoId }))

    return (
        <HydrateClient>
            <VideoView videoId={videoId} />
        </HydrateClient>
    );
}