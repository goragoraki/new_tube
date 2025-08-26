"use client"
import z from "zod"

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { UserAvatar } from "@/components/user-avatar";
import { useClerk, useUser } from "@clerk/nextjs";
import { useForm } from "react-hook-form";
import { commentsInsertSchema } from "@/db/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTRPC } from "@/trpc/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";

interface CommentFormProps {
    videoId: string;
    parentId?: string;
    onSuccess?: () => void;
    onCancel?: () => void;
    variant?: "comment" | "reply";
}

export default function CommentForm({
    videoId,
    parentId,
    onSuccess,
    onCancel,
    variant = "comment"
}: CommentFormProps) {
    const { user } = useUser();
    const clerk = useClerk();
    const trpc = useTRPC();
    const queryClient = useQueryClient();

    const form = useForm<z.infer<typeof commentsInsertSchema>>({
        resolver: zodResolver(commentsInsertSchema),
        defaultValues: {
            parentId: parentId,
            videoId,
            value: "",
        },
    })

    const create = useMutation(trpc.comments.create.mutationOptions({
        onSuccess: (variables) => {
            queryClient.invalidateQueries(trpc.comments.getMany.infiniteQueryFilter({ videoId }));
            form.reset();
            let successMessage = "댓글 작성 완료"
            if (variables.parentId) {
                successMessage = "답글 작성 완료"
            }
            toast.success(successMessage);
            onSuccess?.();
        },
        onError: (error) => {
            if (error.data?.code === "UNAUTHORIZED") {
                clerk.openSignIn();
            }
        }
    }))

    const handleSubmit = (values: z.infer<typeof commentsInsertSchema>) => {
        create.mutate(values)
    }

    const handleCancel = () => {
        form.reset();
        onCancel?.();
    }

    return (
        <Form {...form}>
            <form
                className="flex gap-4 group"
                onSubmit={form.handleSubmit(handleSubmit)}
            >
                <UserAvatar
                    name={user?.username || "User"}
                    imageUrl={user?.imageUrl || "/user-placeholder.svg"}
                    size="lg"
                />
                <div className="flex-1">
                    <FormField
                        name="value"
                        control={form.control}
                        render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                    <Textarea
                                        {...field}
                                        placeholder={variant === "reply" ? "답글 추가..." : "댓글 추가..."}
                                        className="resize-none bg-transparent overflow-hidden min-h-0"
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <div className="flex justify-end gap-2 mt-2">
                        {
                            onCancel && (
                                <Button
                                    type="button"
                                    size="sm"
                                    onClick={handleCancel}
                                    className="rounded-full px-4 py-2"
                                >
                                    취소
                                </Button>
                            )
                        }
                        <Button
                            disabled={create.isPending || !form.getValues("value")}
                            type="submit"
                            size="sm"
                            className="bg-[#48a9f8] text-black/80 disabled:bg-gray-500 disabled:text-white hover:bg-opacity-80 rounded-full px-4 py-2"
                        >
                            {variant === "reply" ? "답글" : "댓글"}
                        </Button>
                    </div>
                </div>
            </form>
        </Form>
    );
}