'use client'

import { ResponsiveModal } from "@/components/reponsive-dialog";
import { UploadDropzone } from "@/lib/uploadthing";
import { useTRPC } from "@/trpc/client";
import { useQueryClient } from "@tanstack/react-query";

interface BannerUploadModalProps {
    userId: string;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export default function BannerUploadModal({
    userId,
    open,
    onOpenChange,
}: BannerUploadModalProps) {
    const trpc = useTRPC();
    const queryClient = useQueryClient();

    const onUploadComplete = () => {
        queryClient.invalidateQueries(
            trpc.users.getOne.queryFilter({ id: userId })
        )
        onOpenChange(false);
    }


    return (
        <ResponsiveModal
            title="배너 업로드"
            open={open}
            onOpenChange={onOpenChange}
        >
            <UploadDropzone
                className="border-neutral-500"
                endpoint="bannerUploader"
                onClientUploadComplete={onUploadComplete}
            />
        </ResponsiveModal>
    );
}

