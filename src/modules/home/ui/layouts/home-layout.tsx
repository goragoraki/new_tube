import { SidebarProvider } from "@/components/ui/sidebar";
import { HomeNavbar } from "../components/home-navbar";

interface LayoutProps {
    children: React.ReactNode;
}
export function HomeLayout({ children }: LayoutProps) {
    return (
        <SidebarProvider>
            <div>
                <HomeNavbar />
            </div>
            <div>
                {children}
            </div>
        </SidebarProvider>
    );
}