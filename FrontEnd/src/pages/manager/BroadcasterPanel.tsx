import { useState } from "react";
import { ResolutionSelector } from "../../components/manager/liveStream/ResolutionSelector";
import { StreamControls } from "../../components/manager/liveStream/StreamControls";
import { VideoPreview } from "../../components/manager/liveStream/VideoPreview";
import { useMediaDevices } from "../../hooks/manager/useMediaDevices";
import { useLiveStream } from "../../hooks/manager/useLiveStream";
import { RESOLUTIONS, type ResolutionKey } from "../../constants/resolutions";

export default function BroadcasterPanel({ matchId }: { matchId: string }) {
    const [stream, setStream] = useState<MediaStream | null>(null);
    const [resolution, setResolution] = useState<ResolutionKey>("auto");
    const { getStream } = useMediaDevices();
    const { startStream, stopStream } = useLiveStream(matchId);

    const start = async () => {
        if (stream) return;
        try {
            const media = await getStream(RESOLUTIONS[resolution]);
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
        <>
            <VideoPreview stream={stream} />
            <ResolutionSelector value={resolution} onChange={setResolution} />
            <StreamControls onStart={start} onStop={stop} isLive={!!stream} />
        </>
    );
};