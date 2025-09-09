import { useTRPC } from "@/trpc/client";
import { useClerk } from "@clerk/nextjs";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

interface UseSubscriptionsProps {
    userId: string;
    isSubscribed: boolean;
    fromVideoId?: string;
}

export const useSubscriptions = ({
    userId,
    isSubscribed,
    fromVideoId
}: UseSubscriptionsProps) => {
    const clerk = useClerk();
    const trpc = useTRPC();
    const queryClient = useQueryClient();
    const subscribe = useMutation(trpc.subscriptions.create.mutationOptions({
        onSuccess: () => {
            toast.success("구독함");
            queryClient.invalidateQueries(trpc.users.getOne.queryFilter({ id: userId }))
            queryClient.invalidateQueries(trpc.videos.getManySubscribed.queryFilter());
            if (fromVideoId) {
                queryClient.invalidateQueries(trpc.videos.getOne.queryFilter({ id: fromVideoId }));
            }
        },
        onError: (error) => {
            toast.error("구독 실패, 다시 시도해주세요")

            if (error.data?.code === "UNAUTHORIZED") {
                clerk.openSignIn();
            }
        }
    }))

    const unsubscribe = useMutation(trpc.subscriptions.remove.mutationOptions({
        onSuccess: () => {
            toast.success("구독취소함");
            queryClient.invalidateQueries(trpc.users.getOne.queryFilter({ id: userId }))
            queryClient.invalidateQueries(trpc.videos.getManySubscribed.queryFilter());
            if (fromVideoId) {
                queryClient.invalidateQueries(trpc.videos.getOne.queryFilter({ id: fromVideoId }));
            }
        },
        onError: (error) => {
            toast.error("구독 취소 실패, 다시 시도해주세요")

            if (error.data?.code === "UNAUTHORIZED") {
                clerk.openSignIn();
            }
        }
    }))

    const isPending = subscribe.isPending || unsubscribe.isPending;

    const onClick = () => {
        if (!isSubscribed) {
            subscribe.mutate({ id: userId });
        } else {
            unsubscribe.mutate({ id: userId });
        }
    }

    return {
        isPending,
        onClick,
    }
}