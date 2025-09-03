import HistoryVideosSection from "../sections/history-videos-section";

export default function HistoryView() {
    return (
        <div className="max-w-[1200px] px-4 pt-2.5 mb-10 flex flex-col gap-y-6 border mx-auto border-none">
            <div>
                <h1 className="text-2xl font-bold">
                    시청기록
                </h1>
                <p className="text-xs text-muted-foreground">
                    이전에 시청한 동영상
                </p>
            </div>
            <HistoryVideosSection />
        </div>
    );
}