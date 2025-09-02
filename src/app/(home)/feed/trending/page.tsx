import { HOME_LIMIT } from "@/constants";
import TrendingView from "@/modules/home/ui/views/trending-view";
import { getQueryClient, HydrateClient, trpc } from "@/trpc/server";

export const dynamic = "force-dynamic"

export default async function Page() {
  const queryClient = getQueryClient();
  void queryClient.prefetchInfiniteQuery(trpc.videos.getManyTrending.infiniteQueryOptions({
    limit: HOME_LIMIT,
  }))
  //tip! prefetch 를할때 같이 HydarteClient 를 넣어줘서 실수로 까먹는걸 방지!
  return (
    <HydrateClient>
      <TrendingView />
    </HydrateClient>
  );
}
