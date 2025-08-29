import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ListPlusIcon, MoreHorizontalIcon, ShareIcon, Trash2Icon } from "lucide-react";
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
    const onShare = () => {
        const fullUrl = `${process.env.VERCEL_URL || "http://localhost:3000"}/videos/${videoId}`
        navigator.clipboard.writeText(fullUrl);
        toast.success("링크 복사완료")
    }
    return (
        <DropdownMenu modal={false}>
            <DropdownMenuTrigger asChild>
                <Button
                    className="w-9 rounded-full"
                    variant={variant}
                >
                    <MoreHorizontalIcon />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" onClick={(e) => e.stopPropagation()}>
                <DropdownMenuItem onClick={onShare}>
                    <ShareIcon className="mr-2 size-4" />
                    공유
                </DropdownMenuItem>
                <DropdownMenuItem>
                    <ListPlusIcon className="mr-2 size-4" />
                    저장
                </DropdownMenuItem>
                {onRemove && (
                    <DropdownMenuItem>
                        <Trash2Icon className="mr-2 size-4" />
                        삭제
                    </DropdownMenuItem>
                )}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}