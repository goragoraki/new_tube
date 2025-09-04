import { HOME_LIMIT } from "@/constants";
import PlaylistsView from "@/modules/playlists/ui/views/playlists-view";
import { getQueryClient, HydrateClient, trpc } from "@/trpc/server";

export default function Page() {
    const queryClient = getQueryClient();
    void queryClient.prefetchInfiniteQuery(trpc.playlists.getMany.infiniteQueryOptions({ limit: HOME_LIMIT }));
    return (
        <HydrateClient>
            <PlaylistsView />
        </HydrateClient>
    );
}