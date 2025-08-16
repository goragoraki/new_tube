"use client"

import { Separator } from "@/components/ui/separator";
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";
import { LogOutIcon, VideoIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import StudioSidebarHedaer from "./studio-sidebar-header";

export default function StudioSidebar() {
    const pathName = usePathname();

    return (
        <Sidebar className="pt-16 z-40" collapsible="icon">
            <SidebarContent className="bg-background">
                <SidebarGroup>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            <StudioSidebarHedaer />
                            <SidebarMenuItem>
                                <SidebarMenuButton tooltip="content" isActive={pathName === "/studio"} asChild>
                                    <Link href='/studio'>
                                        <VideoIcon className="size-5" />
                                        <span className="text-sm">콘텐츠</span>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                            <Separator />
                            <SidebarMenuItem>
                                <SidebarMenuButton tooltip="Exit studio" asChild>
                                    <Link href='/'>
                                        <LogOutIcon className="size-5" />
                                        <span className="text-sm">Exit</span>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
        </Sidebar>
    );
}