import { DEFAULT_LIMIT } from "@/constants";
import { StudioView } from "@/modules/studio/views/studio-view";
import { getQueryClient, HydrateClient, trpc } from "@/trpc/server";

export default async function Page() {
    const queryClient = getQueryClient();
    void queryClient.prefetchInfiniteQuery(trpc.studio.getMany.infiniteQueryOptions({
        limit: DEFAULT_LIMIT,
    })) // 처음 로드할때만 작용

    return (
        <HydrateClient>
            <StudioView />
        </HydrateClient>
    );
}