import { VideosSection } from "../ui/sections/videos-section";

export function StudioView() {
    return (
        <div className="flex flex-col gap-y-6 pt-2.5">
            <div className="px-4">
                <h1 className="text-2xl font-bold mb-1">채널 콘텐츠</h1>
                <p className="text-xs text-muted-foreground">채널을 관리해보세요.</p>
            </div>
            <VideosSection />
        </div>
    );
}