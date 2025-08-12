import { Button } from "@/components/ui/button";
import { UserCircleIcon } from "lucide-react";

export function AuthButton() {
    // todo: add different auth states
    return (
        <Button
            variant="outline"
            className="shadow-none bg-white text-sm text-blue-600 border rounded-full px-4 py-2 font-medium hover:text-blue-500 border-blue-500/20">
            <UserCircleIcon />
            Sign in
        </Button>
    );
}