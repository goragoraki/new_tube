import { HOME_LIMIT } from "@/constants";
import UserView from "@/modules/users/ui/views/user-view";
import { getQueryClient, HydrateClient, trpc } from "@/trpc/server";

interface PageProps {
    params: Promise<{ userId: string }>;
}

export default async function Page({
    params
}: PageProps) {
    const { userId } = await params;
    const queryClient = getQueryClient();

    void queryClient.prefetchQuery(trpc.users.getOne.queryOptions({ id: userId }));
    void queryClient.prefetchInfiniteQuery(trpc.videos.getMany.infiniteQueryOptions({ userId, limit: HOME_LIMIT }))

    return (
        <HydrateClient>
            <UserView userId={userId} />
        </HydrateClient>
    );
}