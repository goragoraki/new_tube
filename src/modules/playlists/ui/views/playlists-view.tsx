'use client'

import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import { useState } from "react";
import PlaylistCreateModal from "../component/playlist-create-modal";
import PlaylistsSection from "../sections/playlists-section";

export default function PlaylistsView() {
    const [createModalOpen, setCreateModalOpen] = useState(false);

    return (
        <div className="max-w-[1200px] px-4 pt-2.5 mb-10 flex flex-col gap-y-6 border mx-auto border-none">
            <PlaylistCreateModal
                open={createModalOpen}
                onOpenChange={setCreateModalOpen}
            />
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold">
                        재생목록
                    </h1>
                    <p className="text-xs text-muted-foreground">
                        생성한 재생목록
                    </p>
                </div>
                <Button
                    variant="outline"
                    size="icon"
                    className="rounded-full"
                    onClick={() => setCreateModalOpen(true)}
                >
                    <PlusIcon />
                </Button>
            </div>
            <PlaylistsSection />
        </div>
    );
}