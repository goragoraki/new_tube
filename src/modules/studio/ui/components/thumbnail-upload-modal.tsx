'use client'

import { ResponsiveModal } from "@/components/reponsive-dialog";
import { UploadDropzone } from "@/lib/uploadthing";
import { useTRPC } from "@/trpc/client";
import { useQueryClient } from "@tanstack/react-query";

interface ThumbnailUploadModalProps {
    videoId: string;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export default function ThumbnailUploadModal({
    videoId,
    open,
    onOpenChange,
}: ThumbnailUploadModalProps) {
    const trpc = useTRPC();
    const queryClient = useQueryClient();

    const onUploadComplete = () => {
        queryClient.invalidateQueries(
            trpc.studio.getOne.queryFilter({ id: videoId })
        )
        queryClient.invalidateQueries(
            trpc.studio.getMany.infiniteQueryFilter()
        )
        onOpenChange(false);
    }


    return (
        <ResponsiveModal
            title="썸네일 업로드"
            open={open}
            onOpenChange={onOpenChange}
        >
            <UploadDropzone
                className="border-neutral-500"
                endpoint="thumbnailUploader"
                input={{ videoId }}
                onClientUploadComplete={onUploadComplete}
            />
        </ResponsiveModal>
    );
}

