"use client"
import {
    CarouselApi,
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselPrevious,
    CarouselNext,
} from "@/components/ui/carousel"
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { Skeleton } from "./ui/skeleton";


interface FilterCarouselProps {
    value?: string | null;
    isLoading?: boolean;
    onSelect: (value: string | null) => void;
    data: {
        value: string;
        label: string;
    }[];
    size?: "default" | "compact"
}

export const FilterCarousel = ({
    value,
    isLoading,
    onSelect,
    data,
    size = "default"
}: FilterCarouselProps) => {
    console.log(value)
    const [api, setApi] = useState<CarouselApi>();
    const [count, setCount] = useState(0);
    const [current, setCurrent] = useState(0);

    useEffect(() => {
        if (!api) {
            return;
        }

        setCount(api.scrollSnapList().length);
        setCurrent(api.selectedScrollSnap() + 1);

        api.on("select", () => {
            setCurrent(api.selectedScrollSnap() + 1)
        })
    }, [api])

    return (
        <div className="w-full relative">
            {/** left fade */}
            <div
                className={cn(
                    size === "default" && "absolute left-12 top-0 bottom-0 w-12 z-10 bg-gradient-to-r from-white to-transparent pointer-events-none",
                    size === "compact" && "absolute left-8 top-0 bottom-0 w-12 z-10 bg-gradient-to-r from-white to-transparent pointer-events-none",
                    current <= 2 && "hidden",
                )}
            />
            <Carousel
                setApi={setApi}
                opts={{
                    align: "start",
                    dragFree: true,
                }}
                className={cn(
                    size === "default" && "w-full px-12",
                    size === "compact" && "pr-8 w-full",
                    current !== 1 && size === "compact" && "px-8"
                )}

            >
                <CarouselContent className="-ml-3">
                    {!isLoading && (
                        <CarouselItem
                            className="pl-4 basis-auto"
                            onClick={() => onSelect(null)}
                        >
                            <Badge
                                variant={!value ? "default" : "secondary"}
                                className="rounded-lg px-3 py-1 cursor-pointer whitespace-nowrap text-sm"
                            >
                                전체
                            </Badge>
                        </CarouselItem>
                    )}
                    {/** skeleton */}
                    {isLoading && (
                        Array.from({ length: 14 }).map((_, idx) => (
                            <CarouselItem key={idx} className="pl-4 basis-auto">
                                <Skeleton className="rounded-lg px-3 py-1 w-[50px] text-sm font-semibold">
                                    &nbsp;
                                </Skeleton>
                            </CarouselItem>
                        ))
                    )}

                    {!isLoading && data.map((item) => (
                        <CarouselItem
                            key={item.value}
                            className="pl-4 basis-auto"
                            onClick={() => onSelect(item.value)}
                        >
                            <Badge
                                variant={value === item.value ? "default" : "secondary"}
                                className="rounded-lg px-3 py-1 cursor-pointer whitespace-nowrap text-sm"
                            >
                                {item.label}
                            </Badge>
                        </CarouselItem>
                    ))}
                </CarouselContent>
                <CarouselPrevious className="left-0 z-20" variant="ghost" />
                <CarouselNext className="right-0 z-20" variant="ghost" />
            </Carousel>

            {/** right fade */}
            <div
                className={cn(
                    size === "default" && "absolute right-12 top-0 bottom-0 w-12 z-10 bg-gradient-to-l from-white to-transparent pointer-events-none",
                    size === "compact" && "absolute right-8 top-0 bottom-0 w-12 z-10 bg-gradient-to-l from-white to-transparent pointer-events-none",
                    current === count && "hidden"
                )}
            />
        </div>
    )
}

