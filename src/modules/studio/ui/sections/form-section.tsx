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
import { CopyCheckIcon, CopyIcon, Globe2Icon, LockIcon, MoreVerticalIcon, TrashIcon } from "lucide-react";

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
        <p>
            loading....
        </p>
    )
}

function FormSectionSuspense({ videoId }: FormSectionProps) {
    const router = useRouter();
    const trpc = useTRPC();
    const { data: video } = useSuspenseQuery(trpc.studio.getOne.queryOptions({
        id: videoId
    }))
    const { data: categories } = useSuspenseQuery(trpc.categories.getMany.queryOptions())
    const queryClient = useQueryClient();

    const update = useMutation(trpc.videos.update.mutationOptions({
        onSuccess: async () => {
            await queryClient.invalidateQueries(
                trpc.studio.getMany.queryFilter(),
            )
            await queryClient.invalidateQueries(
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
                                        제목
                                        {/** todo add ai generate button */}
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
                        {/** todo: 섬네일 사진 필드 추가 */}
                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>
                                        영상설명
                                        {/** todo add ai generate button */}
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
                                                    <SelectItem key={category.id} value={category.name}>
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
    );
}