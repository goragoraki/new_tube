import { getQueryClient, HydrateClient, trpc } from "@/trpc/server";
import Client from "./client";
import { Suspense } from "react";
import { ErrorBoundary } from 'react-error-boundary'

export default async function Home() {
  const queryClient = getQueryClient();
  void queryClient.prefetchQuery(trpc.categories.getMany.queryOptions())

  return (
    <HydrateClient>
      <ErrorBoundary fallback={<p>You need login...</p>}>
        <Suspense fallback={<p>Loading....</p>}>
          <Client />
        </Suspense>
      </ErrorBoundary>
    </HydrateClient>
  );
}
