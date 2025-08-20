'use client'

import { Button } from "@/components/ui/button";
import { z } from "zod"
import { useTRPC } from "@/trpc/client";
import { useMutation, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { Suspense, useState } from "react";
import { ErrorBoundary } from "react-error-boundary";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CopyCheckIcon, CopyIcon, Globe2Icon, ImagePlusIcon, Loader2Icon, LockIcon, MoreVerticalIcon, RotateCcwIcon, SparklesIcon, TrashIcon } from "lucide-react";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod"
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
    Form,
    FormControl,
    FormField,
    FormLabel,
    FormMessage,
    FormItem
} from "@/components/ui/form"

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { videoUpdateSchema } from "@/db/schema";
import { toast } from "sonner";
import VideoPlayer from "@/modules/videos/ui/components/video-player";
import Link from "next/link";
import { snakeCaseToTitle } from "@/lib/utils";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { THUMBNAIL_FALLBACK } from "@/modules/videos/constants";
import ThumbnailUploadModal from "../components/thumbnail-upload-modal";
import ThumbnailGenerateModal from "../components/thumbnail-generate-modal";
import { Skeleton } from "@/components/ui/skeleton";

interface FormSectionProps {
    videoId: string
}

export default function FormSection({ videoId }: FormSectionProps) {

    return (
        <Suspense fallback={<FormSectionSkeleton />}>
            <ErrorBoundary fallback={<p>error...</p>}>
                <FormSectionSuspense videoId={videoId} />
            </ErrorBoundary>
        </Suspense>
    );
}

function FormSectionSkeleton() {
    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <div className="space-y-2">
                    <Skeleton className="h-7 w-32" />
                    <Skeleton className="h-4 w-40" />
                </div>
                <div className="flex items-center gap-x-2 space-x-2 mr-2">
                    <Skeleton className="h-9 w-14" />
                    <Skeleton className="h-5 w-2" />
                </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                <div className="space-y-8 lg:col-span-3">
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-8" />
                        <Skeleton className="h-8 w-full" />
                    </div>
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-12" />
                        <Skeleton className="h-64 w-full" />
                    </div>
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-10" />
                        <Skeleton className="h-40 w-80" />
                    </div>
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-8" />
                        <Skeleton className="h-8 w-full" />
                    </div>
                </div>
                <div className="space-y-8 lg:col-span-2">
                    <div className="flex flex-col gap-4 bg-[#F9F9F9] rounded-xl overflow-hidden">
                        <Skeleton className=" aspect-video" />
                        <div className="p-4 space-y-6">
                            <div className="flex flex-col gap-y-2">
                                <Skeleton className="h-3 w-20" />
                                <Skeleton className="h-5 w-full" />
                            </div>
                            <div className="flex flex-col gap-y-2">
                                <Skeleton className="h-3 w-16" />
                                <Skeleton className="h-5 w-12" />
                            </div>
                            <div className="flex flex-col gap-y-2">
                                <Skeleton className="h-3 w-14" />
                                <Skeleton className="h-5 w-12" />
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col gap-y-2">
                        <Skeleton className="h-4 w-16" />
                        <Skeleton className="h-6 w-full" />
                    </div>
                </div>
            </div>
        </div>
    )
}

function FormSectionSuspense({ videoId }: FormSectionProps) {
    const router = useRouter();
    const trpc = useTRPC();

    const [thumbnailModalOpen, setThumbnailModalOpen] = useState(false);
    const [thumbnailGenerateModalOpen, setThumbnailGenerateModalOpen] = useState(false);

    const { data: video } = useSuspenseQuery(trpc.studio.getOne.queryOptions({
        id: videoId
    }))
    const { data: categories } = useSuspenseQuery(trpc.categories.getMany.queryOptions())

    const queryClient = useQueryClient();

    const restoreThumbnail = useMutation(trpc.videos.restoreThumbnail.mutationOptions({
        onSuccess: () => {
            queryClient.invalidateQueries(
                trpc.studio.getMany.infiniteQueryFilter()
            )
            queryClient.invalidateQueries(
                trpc.studio.getOne.queryFilter({ id: videoId })
            )
        },
        onError: (error) => {
            toast.error(error.message)
        }
    }))

    const update = useMutation(trpc.videos.update.mutationOptions({
        onSuccess: () => {
            queryClient.invalidateQueries(
                trpc.studio.getMany.infiniteQueryFilter(),
            )
            queryClient.invalidateQueries(
                trpc.studio.getOne.queryFilter({ id: videoId })
            )
            toast.success("비디오 세부사항 수정 완료")
        },
        onError: (error) => {
            toast.error(error.message)
        }
    }))

    const remove = useMutation(trpc.videos.remove.mutationOptions({
        onSuccess: () => {
            queryClient.invalidateQueries(
                trpc.studio.getMany.queryFilter()
            )
            toast.success("비디오 삭제 완료");
            router.push(`/studio`)
        }
    }))

    const generateTitle = useMutation(trpc.videos.generateTitle.mutationOptions({
        onSuccess: () => {
            toast.success("백그라운드 잡이 실행되었습니다.", { description: "제목 열심히 만드는 중" })
        },
        onError: (error) => {
            toast.error(error.message)
        }
    }))

    const generateDescription = useMutation(trpc.videos.generateDescription.mutationOptions({
        onSuccess: () => {
            toast.success("백그라운드 잡이 실행되었습니다.", { description: "영상 설명 열심히 만드는 중" })
        },
        onError: (error) => {
            toast.error(error.message)
        }
    }))

    const form = useForm<z.infer<typeof videoUpdateSchema>>({
        resolver: zodResolver(videoUpdateSchema),
        defaultValues: video,
    })

    const onSubmit = (data: z.infer<typeof videoUpdateSchema>) => {
        update.mutate(data) // isPending으로 대체 가능 
        //await update.mutateAsync(data) // mutateAsync를 하면 isSubmitting 사용가능 
    }

    // Todo: vercel로 배포시 바꿔줘야함 
    const fullUrl = `${process.env.VERCEL_URL || "http://localhosts:3000"}/videos/${videoId}`
    const [isCopied, setIsCopied] = useState(false);

    const onCopy = async () => {
        await navigator.clipboard.writeText(fullUrl);
        setIsCopied(true);

        setTimeout(() => {
            setIsCopied(false);
        }, 2000)
    }

    return (
        <>
            <ThumbnailGenerateModal
                videoId={videoId}
                open={thumbnailGenerateModalOpen}
                onOpenChange={setThumbnailGenerateModalOpen}
            />
            <ThumbnailUploadModal
                open={thumbnailModalOpen}
                onOpenChange={setThumbnailModalOpen}
                videoId={videoId}
            />
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h1 className="text-2xl font-bold">동영상 세부사항</h1>
                            <p className="text-xs text-muted-foreground">동영상 세부사항을 수정해보세요</p>
                        </div>
                        <div className="flex items-center gap-x-2">
                            <Button type="submit" disabled={update.isPending}>
                                저장
                            </Button>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon">
                                        <MoreVerticalIcon />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuItem onClick={() => remove.mutate({ id: videoId })} className=" cursor-pointer">
                                        <TrashIcon className="size-4 mr-2" />
                                        <p>삭제</p>
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                        <div className="space-y-8 lg:col-span-3">
                            <FormField
                                control={form.control}
                                name="title"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            <div className="flex items-center gap-x-2">
                                                제목
                                                <Button
                                                    type="button"
                                                    size="icon"
                                                    variant="outline"
                                                    className="rounded-full size-6 [&_svg]:size-3"
                                                    onClick={() => generateTitle.mutate({ id: videoId })}
                                                    disabled={generateTitle.isPending || !video.muxTrackId}
                                                >
                                                    {generateTitle.isPending
                                                        ? <Loader2Icon className="animate-spin" />
                                                        : <SparklesIcon />
                                                    }
                                                </Button>
                                            </div>

                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                {...field}
                                                placeholder="제목을 작성해주세요"
                                            />
                                        </FormControl>
                                        <FormMessage

                                        />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="description"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            <div className="flex items-center gap-x-2">
                                                영상설명
                                                <Button
                                                    type="button"
                                                    size="icon"
                                                    variant="outline"
                                                    className="rounded-full size-6 [&_svg]:size-3"
                                                    onClick={() => generateDescription.mutate({ id: videoId })}
                                                    disabled={generateDescription.isPending || !video.muxTrackId}
                                                >
                                                    {generateDescription.isPending
                                                        ? <Loader2Icon className="animate-spin" />
                                                        : <SparklesIcon />
                                                    }
                                                </Button>
                                            </div>
                                        </FormLabel>
                                        <FormControl>
                                            <Textarea
                                                {...field}
                                                value={field.value ?? ""}
                                                rows={10}
                                                className="resize-none pr-10"
                                                placeholder="영상을 설명해주세요"
                                            />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="thumbnailUrl"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            썸네일
                                        </FormLabel>
                                        <FormControl>
                                            <div className="p-0.5 border border-dashed border-neutral-400 h-[168px] w-[306px] relative group">
                                                <Image
                                                    src={video.thumbnailUrl ?? THUMBNAIL_FALLBACK}
                                                    fill
                                                    alt="Thumbnail"
                                                />
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button
                                                            type="button"
                                                            size="icon"
                                                            className="bg-black/50 hover:bg-black/40 absolute right-1 top-1 rounded-full opacity-100 md:opacity-0
                                                        group-hover:opacity-100 size-7 outline-none border-none"
                                                        >
                                                            <MoreVerticalIcon className="text-white" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="start" side="right">
                                                        <DropdownMenuItem onClick={() => setThumbnailModalOpen(true)}>
                                                            <ImagePlusIcon className="size-4 mr-1" />
                                                            수정
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem
                                                            onClick={() => setThumbnailGenerateModalOpen(true)}
                                                        >
                                                            <SparklesIcon className="size-4 mr-1" />
                                                            AI로 생성하기
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem onClick={() => restoreThumbnail.mutate({ id: videoId })}>
                                                            <RotateCcwIcon className="size-4 mr-1" />
                                                            복구하기
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </div>
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="categoryId"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            카테고리
                                        </FormLabel>
                                        <Select
                                            onValueChange={field.onChange}
                                            defaultValue={field.value ?? undefined}
                                        >
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="카테고리를 선택하세요" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {
                                                    categories.map((category) => (
                                                        <SelectItem key={category.id} value={category.id}>
                                                            {category.name}
                                                        </SelectItem>
                                                    ))
                                                }
                                            </SelectContent>
                                        </Select>
                                    </FormItem>
                                )}
                            />
                        </div>
                        <div className="flex flex-col gap-y-8 lg:col-span-2">
                            <div className="flex flex-col gap-4 bg-[#F9F9F9] rounded-xl overflow-hidden h-fit">

                                <div className="aspect-video overflow-hidden relative">
                                    <VideoPlayer
                                        playbackId={video.muxPlayBackId}
                                        thumbnailUrl={video.thumbnailUrl}
                                    />
                                </div>

                                <div className="p-4 flex flex-col gap-y-6">
                                    <div className="flex justify-between items-center gap-x-2">
                                        <div className="flex flex-col gap-y-1">
                                            <p className="text-xs text-muted-foreground">
                                                비디오 링크
                                            </p>
                                            <div className="flex items-center gap-x-2">
                                                <Link href={`/videos/${video.id}`}>
                                                    <p className="line-clamp-1 text-sm text-blue-500">
                                                        {fullUrl}
                                                    </p>
                                                </Link>
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="icon"
                                                    className="shrink-0"
                                                    onClick={onCopy}
                                                    disabled={isCopied}
                                                >
                                                    {isCopied ? <CopyCheckIcon /> : <CopyIcon />}
                                                </Button>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex justify-between items-center">
                                        <div className="flex flex-col gap-y-1">
                                            <p className="text-muted-foreground text-xs">
                                                비디오 상태
                                            </p>
                                            <p className="text-sm">
                                                {snakeCaseToTitle(video.muxStatus || "Preparing")}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex justify-between items-center">
                                        <div className="flex flex-col gap-y-1">
                                            <p className="text-muted-foreground text-xs">
                                                자막 상태
                                            </p>
                                            <p className="text-sm">
                                                {snakeCaseToTitle(video.muxTrackStatus || "None")}
                                            </p>
                                        </div>
                                    </div>

                                </div>
                            </div>

                            <FormField
                                control={form.control}
                                name="visibility"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>공개범위</FormLabel>
                                        <Select
                                            onValueChange={field.onChange}
                                            defaultValue={field.value}
                                        >
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder={video.visibility} />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="public">
                                                    <div className="flex items-center">
                                                        <Globe2Icon className="size-4 mr-1" />
                                                        Public
                                                    </div>
                                                </SelectItem>
                                                <SelectItem value="private">
                                                    <div className="flex items-center">
                                                        <LockIcon className="size-4 mr-1" />
                                                        Private
                                                    </div>
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </FormItem>
                                )}

                            />
                        </div>
                    </div>
                </form>
            </Form>
        </>
    );
}