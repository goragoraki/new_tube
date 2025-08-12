"use client"

import { SidebarGroup, SidebarGroupContent, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";
import { FlameIcon, HomeIcon, PlaySquareIcon } from "lucide-react"
import Link from "next/link";

const items = [
    {
        title: "홈",
        url: "/",
        icon: HomeIcon
    },
    {
        title: "구독",
        url: "/feed/subscriptions",
        icon: PlaySquareIcon,
        auth: true
    },
    {
        title: "트렌드",
        url: "/feed/trending",
        icon: FlameIcon
    }
]

export function MainSection() {
    return (
        <SidebarGroup>
            <SidebarGroupContent>
                <SidebarMenu>
                    {items.map(item => (
                        <SidebarMenuItem key={item.title}>
                            <SidebarMenuButton
                                asChild // 이걸써서 밑에 링크가 렌더될수있도록함
                                isActive={false} // todo : chanage to look at current pathname
                                onClick={() => { }} // todo: do something to click
                            >
                                <Link href={item.url} className="flex items-center gap-4">
                                    <item.icon />
                                    <span className="text-sm">{item.title}</span>
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    ))}

                </SidebarMenu>
            </SidebarGroupContent>
        </SidebarGroup>
    );
}