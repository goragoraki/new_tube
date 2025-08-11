import { SidebarTrigger } from "@/components/ui/sidebar";
import Image from "next/image";
import Link from "next/link";
import { SearchInput } from "./search-input";

export function HomeNavbar() {
    return (
        <nav className="fixed top-0 left-0 right-0 h-16 bg-white flex">
            <div className="flex items-center gap-4 w-full">
                {/*menu and Logo*/}
                <div className="flex items-center flex-shrink-0">
                    <SidebarTrigger />
                    <Link href="/">
                        <div className="flex p-4 gap-1 items-center">
                            <Image src="/logo.svg" alt="Logo" width={32} height={32} />
                            <p className="text-xl font-semibold tracking-tight">NewTube</p>
                        </div>
                    </Link>
                </div>
                {/* Search */}
                <div className="flex-1 flex justify-center max-w-[720px] mx-auto">
                    <SearchInput />
                </div>
            </div>
        </nav>
    );
}