import { Button } from "@/components/ui/button";
import MuxUploader, { MuxUploaderDrop, MuxUploaderFileSelect, MuxUploaderProgress, MuxUploaderStatus } from "@mux/mux-uploader-react"
import { UploadIcon } from "lucide-react";

interface StudioUploaderProps {
    endPoint?: string | null;
    onSuccess: () => void;
}

const UPLOADER_ID = "video-uploader"

export const StudioUploader = ({
    endPoint,
    onSuccess,
}: StudioUploaderProps) => {

    return (
        <div>
            <MuxUploader
                endpoint={endPoint}
                onSuccess={onSuccess}
                id={UPLOADER_ID}
                className="hidden group/uploader"
            />
            <MuxUploaderDrop muxUploader={UPLOADER_ID} className="group/drop">
                <div slot="heading" className="flex flex-col items-center gap-6">
                    <div className="flex items-center justify-center gap-2 rounded-full bg-muted h-32 w-32">
                        <UploadIcon className="size-10 text-muted-foreground group/drop-[&[active]]:animate-bounce transition-all duration-300" />
                    </div>
                    <div className="flex flex-col gap-2 text-center">
                        <p className="text-sm">드래그엔 드롭으로 비디오를 업로드하세요</p>
                    </div>
                    <MuxUploaderFileSelect muxUploader={UPLOADER_ID}>
                        <Button type="button" className="rounded-full">
                            파일선택
                        </Button>
                    </MuxUploaderFileSelect>
                </div>
                <span slot="separator" className="hidden" />
                <MuxUploaderStatus
                    muxUploader={UPLOADER_ID}
                    className="text-sm"
                />
                <MuxUploaderProgress
                    muxUploader={UPLOADER_ID}
                    className="text-sm"
                    type="percentage"
                />
                <MuxUploaderProgress
                    muxUploader={UPLOADER_ID}
                    type="bar"
                />
            </MuxUploaderDrop>
        </div>
    )
}
