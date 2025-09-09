import { HOME_LIMIT } from "@/constants";
import SubscriptionsView from "@/modules/subscriptions/ui/views/subscriptions-view";
import { getQueryClient, HydrateClient, trpc } from "@/trpc/server";

export default async function Page() {
    const queryClient = getQueryClient();
    void queryClient.prefetchInfiniteQuery(trpc.subscriptions.getMany.infiniteQueryOptions({ limit: HOME_LIMIT }));

    return (
        <HydrateClient>
            <SubscriptionsView />
        </HydrateClient>
    );
}