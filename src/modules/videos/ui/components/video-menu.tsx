'use client'

import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { APP_URL } from "@/constants";
import PlaylistAddModal from "@/modules/playlists/ui/component/playlist-add-modal";
import { ListPlusIcon, MoreHorizontalIcon, ShareIcon, Trash2Icon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";


interface VideoMenuProps {
    videoId: string;
    variant?: "ghost" | "secondary";
    onRemove?: () => void;
}
export default function VideoMenu({
    videoId,
    variant = "ghost",
    onRemove,
}: VideoMenuProps) {
    const [openPlaylistAddModal, setIsOpenPlaylistAddModal] = useState(false);

    const onShare = () => {
        const fullUrl = `${APP_URL}/videos/${videoId}`
        navigator.clipboard.writeText(fullUrl);
        toast.success("링크 복사완료")
    }
    return (
        <>
            <PlaylistAddModal
                open={openPlaylistAddModal}
                onOpenChange={setIsOpenPlaylistAddModal}
                videoId={videoId}
            />
            <DropdownMenu modal={false}>
                <DropdownMenuTrigger asChild>
                    <Button
                        className="w-9 rounded-full"
                        variant={variant}
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                        }}
                    >
                        <MoreHorizontalIcon />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" onClick={(e) => e.stopPropagation()}>
                    <DropdownMenuItem onClick={onShare}>
                        <ShareIcon className="mr-2 size-4" />
                        공유
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => {
                        setIsOpenPlaylistAddModal(true);
                    }}>
                        <ListPlusIcon className="mr-2 size-4" />
                        저장
                    </DropdownMenuItem>
                    {onRemove && (
                        <DropdownMenuItem
                            onClick={onRemove}
                        >
                            <Trash2Icon className="mr-2 size-4" />
                            삭제
                        </DropdownMenuItem>
                    )}
                </DropdownMenuContent>
            </DropdownMenu>
        </>
    );
}