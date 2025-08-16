"use client"

import { Button } from "@/components/ui/button";
import { BatteryPlusIcon, PlusIcon } from "lucide-react";

export default function StudioUploadModal() {
    return (
        <Button variant="secondary" className="flex items-center border rounded-full [&_svg]:size-5 bg-gray-50 hover:bg-gray-100">
            <BatteryPlusIcon />
            <p className="font-semibold">만들기</p>
        </Button>
    );
}