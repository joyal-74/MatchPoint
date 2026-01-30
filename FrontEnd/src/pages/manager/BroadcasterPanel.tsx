import { useState } from "react";
import { ResolutionSelector } from "../../components/manager/liveStream/ResolutionSelector";
import { StreamControls } from "../../components/manager/liveStream/StreamControls";
import { VideoPreview } from "../../components/manager/liveStream/VideoPreview";
import { useMediaDevices } from "../../hooks/manager/useMediaDevices";
import { useLiveStream } from "../../hooks/manager/useLiveStream";
import { type ResolutionKey } from "../../constants/resolutions";


export default function BroadcasterPanel({ matchId }: { matchId: string }) {
    const [stream, setStream] = useState<MediaStream | null>(null);
    const [resolution, setResolution] = useState<ResolutionKey>("auto");
    const { getStream } = useMediaDevices();
    const { startStream, stopStream } = useLiveStream(matchId);

    const start = async () => {
        if (stream) return;
        try {
            const media = await getStream(resolution); 
            
            setStream(media);
            await startStream(media);
        } catch (err) {
            console.error(err);
            alert("Unable to access camera or mic");
        }
    };

    const stop = () => {
        if (!stream) return;
        stopStream();
        stream.getTracks().forEach(t => t.stop());
        setStream(null);
    };

    return (
        <div className="space-y-4 p-4 bg-card rounded-2xl border border-border shadow-sm">
            <VideoPreview stream={stream} />
            <div className="flex items-center justify-between gap-4">
                <ResolutionSelector
                    value={resolution}
                    onChange={(val) => setResolution(val)}
                />
                <StreamControls onStart={start} onStop={stop} isLive={!!stream} />
            </div>
        </div>
    );
};