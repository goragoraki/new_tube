'use client'

import { Button } from "@/components/ui/button";
import { UserCircleIcon } from "lucide-react";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";

export function AuthButton() {
    // todo: add different auth states
    return (
        <>
            {/** 로그인 후 */}
            <SignedIn>
                <UserButton />
                {/** Add menu items for Studio and User profile */}
            </SignedIn>

            {/** 로그인 전 */}
            <SignedOut>
                <SignInButton mode="modal">
                    <Button
                        variant="outline"
                        className="shadow-none bg-white text-sm text-blue-500 border rounded-full px-4 py-2 font-medium hover:text-blue-500 border-blue-500/20
                    hover:bg-blue-100 [&_svg]:size-5
                        ">
                        <UserCircleIcon />
                        로그인
                    </Button>
                </SignInButton>
            </SignedOut>
        </>
    );
}