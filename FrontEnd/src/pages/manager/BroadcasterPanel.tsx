import { useState } from "react";
import { ResolutionSelector } from "../../components/manager/liveStream/ResolutionSelector";
import { StreamControls } from "../../components/manager/liveStream/StreamControls";
import { VideoPreview } from "../../components/manager/liveStream/VideoPreview";
import { useMediaDevices } from "../../hooks/manager/useMediaDevices";
import { useLiveStream } from "../../hooks/manager/useLiveStream";

export default function BroadcasterPanel ({ matchId }) {
    const [stream, setStream] = useState<MediaStream | null>(null);
    const [resolution, setResolution] = useState("auto");
    const { getStream } = useMediaDevices();
    const { startStream, stopStream } = useLiveStream(matchId);

    const start = async () => {
        const media = await getStream(RESOLUTIONS[resolution]);
        setStream(media);
        await startStream(media);
    };

    const stop = async () => {
        stopStream();
        stream?.getTracks().forEach(t => t.stop());
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