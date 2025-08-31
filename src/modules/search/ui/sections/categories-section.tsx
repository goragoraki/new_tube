"use client"

import { FilterCarousel } from "@/components/filter-carousel";
import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary"

interface CategoriesSectionProps {
    categoryId?: string
}

export default function CategoriesSection({ categoryId }: CategoriesSectionProps) {
    return (
        <Suspense fallback={<CategoriesSkeleton />}>
            <ErrorBoundary fallback={<p>something error..</p>}>
                <CategoriesSectionSuspense categoryId={categoryId} />
            </ErrorBoundary>
        </Suspense>
    );
}

const CategoriesSkeleton = () => {
    return <FilterCarousel isLoading data={[]} onSelect={() => { }} size="compact" />
}

function CategoriesSectionSuspense({ categoryId }: CategoriesSectionProps) {
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
        <FilterCarousel value={categoryId} data={data} onSelect={onSelect} />
    );
}

//이렇게 suspense를 home view에서 감싸지 않고 여기서 따로 만들어서 해주는이유?
// useSuspenseQuery를 사용할때 suspense errorboundary를 까먹지 않기위해서