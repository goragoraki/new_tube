import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface VideoDescriptionProps {
    compactViews: string;
    expanededViews: string;
    compactDate: string;
    expandedDate: string;
    description?: string | null;
};

export default function VideoDiscription({
    compactViews,
    expanededViews,
    compactDate,
    expandedDate,
    description,

}: VideoDescriptionProps) {
    const [isExpanded, setIsExpanded] = useState(false);
    return (
        <div
            onClick={() => setIsExpanded((current) => !current)}
            className="bg-secondary/50 rounded-xl p-3 cursor-pointer hover:bg-secondary/70 transition"
        >
            <div className="flex gap-2 text-sm mb-2">
                <span className="font-medium">
                    조회수 {isExpanded ? expanededViews : compactViews}회
                </span>
                <span className="font-medium">
                    {isExpanded ? expandedDate : compactDate}
                </span>
            </div>
            <div className="relative">
                <p
                    className={cn(
                        "text-sm whitespace-pre-wrap",
                        !isExpanded && "line-clamp-2",
                    )}
                >
                    {description || "No description"}
                </p>
            </div>
            <div className="flex items-center gap-1 mt-4 text-sm font-medium">
                {isExpanded ? (
                    <>
                        간략히
                    </>
                ) : (
                    <>
                        ...더보기
                    </>
                )}
            </div>
        </div>
    );
}

export const VideoDescriptionSkeleton = () => {
    return (
        <div className="flex flex-col gap-2">
            <div className="flex gap-2">
                <Skeleton className="h-3 w-24" />
            </div>
            <Skeleton className="h-3 w-16" />
            <Skeleton className="h-3 w-10" />
        </div>
    )
}