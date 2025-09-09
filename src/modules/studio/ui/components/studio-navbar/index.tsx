import { SidebarTrigger } from "@/components/ui/sidebar";
import Image from "next/image";
import Link from "next/link";
import SearchInput from "./search-input";
import { AuthButton } from "@/modules/auth/ui/components/auth-button";
import StudioUploadModal from "../studio-upload-modal";

export default function StudioNavbar() {
    return (
        <nav className="flex fixed h-16 top-0 left-0 right-0 px-2 pr-5 z-50 items-center bg-white border-b shadow-md">
            <div className="flex items-center w-full gap-4">
                {/** menu and logo */}
                <div className="flex items-center flex-shrink-0">
                    <SidebarTrigger />
                    <Link href='/studio' className="hidden md:block">
                        <div className="flex items-center gap-1 p-4">
                            <Image src='/logo.svg' alt="Logo" width={32} height={32} />
                            <p className="font-bold text-xl tracking-tight">Studio</p>
                        </div>
                    </Link>
                </div>
                {/** Search */}
                <div className="flex flex-1 max-w-[720px] mx-auto">
                    <SearchInput />
                </div>
                {/** Login Icon */}
                <div className="flex flex-shrink-0 items-center gap-4">
                    <StudioUploadModal />
                    <AuthButton />
                </div>
            </div>
        </nav>
    );
}