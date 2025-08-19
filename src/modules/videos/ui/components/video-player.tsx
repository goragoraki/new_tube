
interface VideoPlayerProps {
    playbackId?: string | null | undefined;
    thumbnailUrl?: string | null | undefined;
    autoPlay?: boolean;
    onPlay?: () => void
}
export default function VideoPlayer({
    playbackId,
    thumbnailUrl,
    autoPlay,
    onPlay,
}: VideoPlayerProps) {
    if (!playbackId) return null;

    return (
        <div>
        </div>
    );
}