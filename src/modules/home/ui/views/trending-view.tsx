import TrendingVideosSection from "../sections/trending-videos-section";

export default function TrendingView() {
    return (
        <div className="max-w-[2400px] px-4 pt-2.5 mb-10 flex flex-col gap-y-6 border mx-auto border-none">
            <div>
                <h1 className="text-2xl font-bold">
                    트렌드
                </h1>
                <p className="text-xs text-muted-foreground">
                    이 순간 가장 인기있는 동영상
                </p>
            </div>
            <TrendingVideosSection />
        </div>
    );
}


// section 나누는 이유!
// 1. 각 섹션마다 에러 바운더리를 처리하기 위해
// 2. 독립적으로 로딩됨 -> 하나가 크래쉬 되어도 전체가 죽는걸 방지?