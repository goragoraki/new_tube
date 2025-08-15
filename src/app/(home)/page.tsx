import HomeView from "@/modules/home/ui/views/home-view";
import { getQueryClient, HydrateClient, trpc } from "@/trpc/server";

export const dynamic = "force-dynamic"

interface PageProps {
  searchParams: Promise<{
    categoryId?: string;
  }>
}

export default async function Page({ searchParams }: PageProps) {
  const { categoryId } = await searchParams;

  const queryClient = getQueryClient();
  void queryClient.prefetchQuery(trpc.categories.getMany.queryOptions())
  //tip! prefetch 를할때 같이 HydarteClient 를 넣어줘서 실수로 까먹는걸 방지!
  return (
    <HydrateClient>
      <HomeView categoryId={categoryId} />
    </HydrateClient>
  );
}
