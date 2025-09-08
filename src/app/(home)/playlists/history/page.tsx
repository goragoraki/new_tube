import { HOME_LIMIT } from "@/constants";
import HistoryView from "@/modules/playlists/ui/views/history-view";
import { getQueryClient, HydrateClient, trpc } from "@/trpc/server";

export const dynamic = "force-dynamic";

export default function Page() {
    const queryClient = getQueryClient();
    void queryClient.prefetchInfiniteQuery(trpc.playlists.getHistory.infiniteQueryOptions({
        limit: HOME_LIMIT
    }));
    return (
        <HydrateClient>
            <HistoryView />
        </HydrateClient>
    );
}