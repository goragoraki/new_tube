import SubscriptionsSection from "../sections/subscriptions-section";

export default function SubscriptionsView() {
    return (
        <div className="max-w-[1200px] px-4 pt-2.5 mb-10 flex flex-col gap-y-6 border mx-auto border-none">
            <div>
                <h1 className="text-2xl font-bold">
                    구독한 채널
                </h1>
            </div>
            <SubscriptionsSection />
        </div>
    );
}