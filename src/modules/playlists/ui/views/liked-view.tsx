import LikedVideosSection from "../sections/liked-videos-section";

export default function LikedView() {
    return (
        <div className="max-w-[1200px] px-4 pt-2.5 mb-10 flex flex-col gap-y-6 border mx-auto border-none">
            <div>
                <h1 className="text-2xl font-bold">
                    좋아요 표시한 동영상
                </h1>
            </div>
            <LikedVideosSection />
        </div>
    );
}