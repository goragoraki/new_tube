"use client"

import { FilterCarousel } from "@/components/filter-carousel";
import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary"

interface CategoriesSectionProps {
    categoryId?: string;
    size?: "default" | "compact"
}

export default function CategoriesSection({ categoryId, size }: CategoriesSectionProps) {
    return (
        <Suspense fallback={<CategoriesSkeleton />}>
            <ErrorBoundary fallback={<p>something error..</p>}>
                <CategoriesSectionSuspense categoryId={categoryId} size={size} />
            </ErrorBoundary>
        </Suspense>
    );
}

const CategoriesSkeleton = () => {
    return <FilterCarousel isLoading data={[]} onSelect={() => { }} />
}

function CategoriesSectionSuspense({ categoryId, size }: CategoriesSectionProps) {
    const { data: categories } = useSuspenseQuery(useTRPC().categories.getMany.queryOptions())
    const data = categories.map(category => ({
        value: category.id,
        label: category.name
    }))
    const router = useRouter();
    const onSelect = (value: string | null) => {
        const url = new URL(window.location.href);

        if (value) {
            url.searchParams.set("categoryId", value);
        } else {
            url.searchParams.delete("categoryId");
        }
        router.push(url.toString());
    }
    return (
        <FilterCarousel value={categoryId} data={data} onSelect={onSelect} size={size} />
    );
}