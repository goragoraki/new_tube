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
    onSuccess?: () => void;
}

export default function CommentForm({
    videoId,
    onSuccess,
}: CommentFormProps) {
    const { user } = useUser();
    const clerk = useClerk();
    const trpc = useTRPC();
    const queryClient = useQueryClient();

    const form = useForm<z.infer<typeof commentsInsertSchema>>({
        resolver: zodResolver(commentsInsertSchema),
        defaultValues: {
            videoId,
            value: "",
        },
    })

    const create = useMutation(trpc.comments.create.mutationOptions({
        onSuccess: () => {
            queryClient.invalidateQueries(trpc.comments.getMany.queryFilter({ videoId }));
            form.reset();
            toast.success("댓글 저장 완료");
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
                                        placeholder="댓글 추가...."
                                        className="resize-none bg-transparent overflow-hidden min-h-0"
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <div className="flex justify-end gap-2 mt-2">
                        <Button
                            disabled={create.isPending || !form.getValues("value")}
                            type="submit"
                            size="sm"
                        >
                            댓글
                        </Button>
                    </div>
                </div>
            </form>
        </Form>
    );
}