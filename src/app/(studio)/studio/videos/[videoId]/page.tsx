import VideoView from "@/modules/studio/views/video-view";
import { getQueryClient, HydrateClient, trpc } from "@/trpc/server";

export const dynamic = "force-dynamic"

interface PageProps {
    params: Promise<{
        videoId: string
    }>
}

export default async function Page({ params }: PageProps) {
    const { videoId } = await params;

    const queryClient = getQueryClient();
    void queryClient.prefetchQuery(trpc.studio.getOne.queryOptions({
        id: videoId,
    }))
    void queryClient.prefetchQuery(trpc.categories.getMany.queryOptions())

    return (
        <HydrateClient>
            <VideoView videoId={videoId} />
        </HydrateClient>
    );
}