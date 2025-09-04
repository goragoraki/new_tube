'use client'

import { ResponsiveModal } from "@/components/reponsive-dialog";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useTRPC } from "@/trpc/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";

interface PlaylistCreateModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

const formSchema = z.object({
    name: z.string().min(1),
})

export default function PlaylistCreateModal({
    open,
    onOpenChange,
}: PlaylistCreateModalProps) {
    const trpc = useTRPC();
    const queryClient = useQueryClient();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: ""
        }
    })

    const create = useMutation(trpc.playlists.create.mutationOptions({
        onSuccess: async () => {
            await queryClient.invalidateQueries(trpc.playlists.getMany.infiniteQueryFilter())
            form.reset();
            onOpenChange(false);
            toast.success("재생목록 생성 완료");
        }
    }))

    const onSubmit = (values: z.infer<typeof formSchema>) => {
        create.mutate(values);
    }
    return (
        <ResponsiveModal
            title="재생목록 생성하기"
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
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>이름</FormLabel>
                                <FormControl>
                                    <Input
                                        {...field}
                                        className="resize-none"
                                        placeholder="재생목록 이름 입력"
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <div className="flex justify-end">
                        <Button
                            disabled={create.isPending}
                            type="submit"
                        >
                            저장
                        </Button>
                    </div>
                </form>
            </Form>
        </ResponsiveModal>
    );
}