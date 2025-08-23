'use client'

import { InfiniteScroll } from "@/components/inifinite-scroll";
import { DEFAULT_LIMIT } from "@/constants";
import { useTRPC } from "@/trpc/client";
import { useSuspenseInfiniteQuery } from "@tanstack/react-query";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import {
    Table,
    TableHeader,
    TableBody,
    TableFooter,
    TableHead,
    TableRow,
    TableCell,
    TableCaption,
} from '@/components/ui/table'
import Link from "next/link";
import { VideoTumbnail } from "@/modules/videos/ui/components/video-thumbnail";
import { snakeCaseToTitle } from "@/lib/utils";
import { format } from "date-fns";
import { Globe2Icon, LockIcon } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";


export const VideosSection = () => {
    return (
        <Suspense fallback={<VideoSectionSkeleton />}>
            <ErrorBoundary fallback={<p>Error...</p>}>
                <VideosSectionSuspense />
            </ErrorBoundary>
        </Suspense>
    )
}

export function VideoSectionSkeleton() {
    return (
        <div>
            <div className="border-y">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="pl-6 w-[510px]">동영상</TableHead>
                            <TableHead>공개상태</TableHead>
                            <TableHead>제한사항</TableHead>
                            <TableHead>날짜</TableHead>
                            <TableHead>조회수</TableHead>
                            <TableHead>댓글</TableHead>
                            <TableHead>좋아요</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {Array.from({ length: 5 }).map((_, idx) => (
                            <TableRow key={idx}>
                                <TableCell className="pl-6">
                                    <div className="flex items-center gap-4">
                                        <Skeleton className="h-20 w-36" />
                                        <div className="flex flex-col gap-y-2">
                                            <Skeleton className="h-4 w-[100px]" />
                                            <Skeleton className="h-3 w-[150px]" />
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-2">
                                        <Skeleton className="w-[1rem] h-4 rounded-full" />
                                        <Skeleton className="w-[45px] h-3" />
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div className="flex items-center">
                                        <Skeleton className="w-[50px] h-3" />
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div className="flex items-center">
                                        <Skeleton className="w-[50px] h-3" />
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div className="flex items-center">
                                        <Skeleton className="w-[1.5rem] h-3" />
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div className="flex items-center">
                                        <Skeleton className="w-[1.5rem] h-3" />
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div className="flex items-center">
                                        <Skeleton className="w-[1.5rem] h-3" />
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}

                    </TableBody>
                </Table>
            </div>
        </div>
    )
}

export function VideosSectionSuspense() {
    const { data, hasNextPage, isFetchingNextPage, fetchNextPage } = useSuspenseInfiniteQuery(useTRPC().studio.getMany.infiniteQueryOptions({
        limit: DEFAULT_LIMIT,
    }, {
        getNextPageParam: (lastPage) => lastPage.nextCursor,
    }))

    return (
        <div>
            <div className="border-y">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="pl-6 w-[510px]">동영상</TableHead>
                            <TableHead>공개상태</TableHead>
                            <TableHead>제한사항</TableHead>
                            <TableHead>날짜</TableHead>
                            <TableHead>조회수</TableHead>
                            <TableHead>댓글</TableHead>
                            <TableHead>좋아요</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {data.pages.flatMap((page) => page.items).map((video) => (
                            <Link href={`/studio/videos/${video.id}`} key={video.id} legacyBehavior>
                                <TableRow className=" cursor-pointer">
                                    <TableCell className="pl-6">
                                        <div className="flex items-center gap-4">
                                            <div className="flex flex-shrink-0 aspect-video w-36">
                                                <VideoTumbnail
                                                    title={video.title}
                                                    duration={video.duration || 0}
                                                    imageUrl={video.thumbnailUrl ?? undefined}
                                                    previewUrl={video.previewUrl ?? undefined}
                                                />
                                            </div>
                                            <div className="flex flex-col overflow-hidden gap-y-1">
                                                <span className="text-sm line-clamp-1">{video.title}</span>
                                                <span className="text-xs text-muted-foreground line-clamp-2">{video.description || "No description"}</span>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center">
                                            {video.visibility === "private" ? (
                                                <LockIcon className="size-4 mr-2" />
                                            ) : (
                                                <Globe2Icon className="size-4 mr-2 text-muted-foreground" />
                                            )
                                            }
                                            {video.visibility}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center">
                                            {snakeCaseToTitle(video.muxStatus || "error")}
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-sm truncate">
                                        <div>
                                            {format(new Date(video.createdAt), "yy.MM.dd")}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        view
                                    </TableCell>
                                    <TableCell>
                                        comment
                                    </TableCell>
                                    <TableCell>
                                        liked
                                    </TableCell>
                                </TableRow>
                            </Link>
                        ))}
                    </TableBody>
                </Table>
            </div>
            <InfiniteScroll
                hasNextPage={hasNextPage}
                isFetchingNextPage={isFetchingNextPage}
                fetchNextPage={fetchNextPage}
            />
        </div>
    );
} 
