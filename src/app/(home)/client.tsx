'use client'

import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";

export default function Client() {
    const trpc = useTRPC();
    const { data } = useSuspenseQuery(trpc.categories.getMany.queryOptions());
    return (
        <div>
            {JSON.stringify(data)}
        </div>
    );
}