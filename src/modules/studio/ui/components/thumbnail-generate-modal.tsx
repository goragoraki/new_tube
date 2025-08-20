'use client'
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { ResponsiveModal } from "@/components/reponsive-dialog";
import { UploadButton, UploadDropzone } from "@/lib/uploadthing";
import { useTRPC } from "@/trpc/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { useForm } from "react-hook-form";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Loader2Icon } from "lucide-react";

interface ThumbnailGenerateProps {
    videoId: string;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

const formSchema = z.object({
    prompt: z.string().min(10),
})

export default function ThumbnailGenerateModal({
    videoId,
    open,
    onOpenChange,
}: ThumbnailGenerateProps) {
    const trpc = useTRPC();
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            prompt: ""
        }
    })

    const generateThumbnail = useMutation(trpc.videos.generateThumbnail.mutationOptions({
        onSuccess: () => {
            toast.success("생성요청 완료", { description: "열심히 이미지 생성중..." })
            form.reset();
            onOpenChange(false);
        },
        onError: (error) => {
            toast.error(error.message)
        }
    }))

    const onSubmit = (values: z.infer<typeof formSchema>) => {
        generateThumbnail.mutate({
            prompt: values.prompt,
            id: videoId,
        });
    }

    return (
        <ResponsiveModal
            title="썸네일 AI로 만들기"
            open={open}
            onOpenChange={onOpenChange}
        >
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="flex flex-col gap-4"
                >
                    <FormField
                        control={form.control}
                        name="prompt"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>프롬프트</FormLabel>
                                <FormControl>
                                    <Textarea
                                        {...field}
                                        className="resize-none"
                                        cols={30}
                                        rows={5}
                                        placeholder="만들고 싶은 썸네일을 입력하세요."
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <div className="flex justify-end">
                        <Button
                            type="submit"
                            disabled={generateThumbnail.isPending}
                        >
                            <div className="flex items-center gap-x-2">
                                {generateThumbnail.isPending
                                    ?? <Loader2Icon className="animate-spin" />
                                }
                                생성하기
                            </div>
                        </Button>
                    </div>
                </form>
            </Form>
        </ResponsiveModal>
    );
}

