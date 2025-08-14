import { useTRPC } from "@/trpc/client";
import { getQueryClient, HydrateClient, trpc } from "@/trpc/server";
import { useQuery } from "@tanstack/react-query";
import Client from "./client";
import { Suspense } from "react";
import { ErrorBoundary } from 'react-error-boundary'

export default async function Home() {
  const queryClient = getQueryClient();
  void queryClient.prefetchQuery(trpc.hello.queryOptions({ text: "an1" }))

  return (
    <HydrateClient>
      <ErrorBoundary fallback={<p>something wrong...</p>}>
        <Suspense fallback={<p>Loading....</p>}>
          <Client />
        </Suspense>
      </ErrorBoundary>
    </HydrateClient>
  );
}
