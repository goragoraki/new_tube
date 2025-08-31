import { DEFAULT_LIMIT } from "@/constants";
import SearchView from "@/modules/search/ui/views/search-view";
import { getQueryClient, HydrateClient, trpc } from "@/trpc/server";

export const dynamic = "force-dynamic"

interface PageProps {
    searchParams: Promise<{
        query: string | undefined;
        categoryId: string | undefined;
    }>
}
export default async function Page({ searchParams }: PageProps) {
    const { query, categoryId } = await searchParams;

    const queryClient = getQueryClient();
    void queryClient.prefetchQuery(trpc.categories.getMany.queryOptions())
    void queryClient.prefetchInfiniteQuery(trpc.search.getMany.infiniteQueryOptions({
        query,
        categoryId,
        limit: DEFAULT_LIMIT,
    }))

    return (
        <HydrateClient>
            <SearchView query={query} categoryId={categoryId} />
        </HydrateClient>
    );
}