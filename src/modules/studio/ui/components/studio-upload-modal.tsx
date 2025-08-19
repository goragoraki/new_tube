"use client"

import { ResponsiveModal } from "@/components/reponsive-dialog";
import { Button } from "@/components/ui/button";
import { useTRPC } from "@/trpc/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { BatteryPlusIcon, Loader2Icon, PlusIcon } from "lucide-react";
import { toast } from "sonner";
import { StudioUploader } from "./studio-uploader";

export default function StudioUploadModal() {
    const trpc = useTRPC();
    const queryClient = useQueryClient();

    const create = useMutation(trpc.videos.create.mutationOptions(
        {
            onSuccess: async () => {
                await queryClient.invalidateQueries(
                    trpc.studio.getMany.infiniteQueryFilter()
                )
                toast.success("비디오 업로드 완료")
            },
            onError: (error) => {
                toast.error(error.message);
            }
        }
    ))
    return (
        <>
            <ResponsiveModal
                title="비디오 업로드"
                open={!!create.data}
                onOpenChange={() => { create.reset() }}
            >
                {create.data?.url
                    ? <StudioUploader endPoint={create.data.url} onSuccess={() => { }} />
                    : <Loader2Icon className="animate-spin" />
                }
            </ResponsiveModal>
            <Button variant="secondary"
                className="flex items-center border rounded-full [&_svg]:size-5 bg-gray-50 hover:bg-gray-100"
                onClick={() => create.mutate()}
                disabled={create.isPending}
            >
                {create.isPending ? <Loader2Icon className="animate-spin" /> : <BatteryPlusIcon />}
                <p className="font-semibold">만들기</p>
            </Button>

        </>
    );
}