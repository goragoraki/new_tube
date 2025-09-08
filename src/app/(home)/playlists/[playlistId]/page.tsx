import { HOME_LIMIT } from "@/constants";
import { VideosView } from "@/modules/playlists/ui/views/videos-view";
import { getQueryClient, HydrateClient, trpc } from "@/trpc/server";

interface PageProps {
    params: Promise<{ playlistId: string }>;
}

export const dynamic = "force-dynamic";

export default async function Layout({ params }: PageProps) {
    const { playlistId } = await params;
    const queryClient = getQueryClient();

    void queryClient.prefetchQuery(trpc.playlists.getOne.queryOptions({ playlistId }));
    void queryClient.prefetchInfiniteQuery(trpc.playlists.getVideos.infiniteQueryOptions({
        playlistId,
        limit: HOME_LIMIT,
    }));



    return (
        <HydrateClient>
            <VideosView playlistId={playlistId} />
        </HydrateClient>
    );
}