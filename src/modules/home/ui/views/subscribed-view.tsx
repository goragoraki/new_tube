import SubscribedVideosSection from "../sections/subscribed-videos-section";

export default function SubscribedView() {
    return (
        <div className="max-w-[2400px] px-4 pt-2.5 mb-10 flex flex-col gap-y-6 border mx-auto border-none">
            <div>
                <h1 className="text-2xl font-bold">
                    최신순
                </h1>
            </div>
            <SubscribedVideosSection />
        </div>
    );
}


// section 나누는 이유!
// 1. 각 섹션마다 에러 바운더리를 처리하기 위해
// 2. 독립적으로 로딩됨 -> 하나가 크래쉬 되어도 전체가 죽는걸 방지?