import { Button, ButtonProps } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { Bell, BellIcon, BellOffIcon, BellRingIcon, ChevronDownIcon, UserMinus } from "lucide-react";

interface SubscriptionsButtonProps {
    onClick: () => void;
    disabled: boolean;
    isSubscribed: boolean;
    className?: string;
    size?: ButtonProps["size"];
};

export default function SubscriptionsButton({
    onClick,
    disabled,
    isSubscribed,
    className,
    size,
}: SubscriptionsButtonProps) {

    return (
        <>
            {isSubscribed ? (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button
                            variant="secondary"
                            className={cn("rounded-full outline-none focus:outline-none", className)}
                        >
                            <BellIcon />
                            <p>구독중</p>
                            <ChevronDownIcon />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent side="bottom" align="start">
                        <DropdownMenuItem>
                            <BellRingIcon />
                            <p>전체</p>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                            <Bell />
                            <p>맞춤설정</p>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                            <BellOffIcon />
                            <p>없음</p>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            onClick={(e) => {
                                e.preventDefault();
                                onClick();
                            }}>
                            <UserMinus />
                            <p>구독취소</p>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            ) : (
                <Button
                    size={size}
                    variant="default"
                    className={cn("rounded-full", className)}
                    disabled={disabled}
                    onClick={(e) => {
                        e.preventDefault();
                        onClick();
                    }}
                >
                    구독
                </Button>
            )}
        </>
    );
}