import { HOME_LIMIT } from "@/constants";
import LikedView from "@/modules/playlists/ui/views/liked-view";
import { getQueryClient, HydrateClient, trpc } from "@/trpc/server";

export default function Page() {
    const queryClient = getQueryClient();
    void queryClient.prefetchInfiniteQuery(trpc.playlists.getLiked.infiniteQueryOptions({
        limit: HOME_LIMIT
    }));
    return (
        <HydrateClient>
            <LikedView />
        </HydrateClient>
    );
}