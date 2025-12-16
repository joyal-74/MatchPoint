import { useParams } from "react-router-dom";
import { useState } from "react";
import {
    Volume2, VolumeX, AlertCircle, Maximize, Minimize,
    Radio, Loader2, Coffee, Flag
} from "lucide-react";
import { useMediasoupViewer } from "../../hooks/viewer/useMediasoupViewer";

type Quality = "auto" | "low" | "medium" | "high";

export default function LiveStreamViewer() {
    const { matchId } = useParams();
    const [fullscreen, setFullscreen] = useState(false);

    const {
        videoRef,
        state,
        error,
        muted,
        setMuted,
        quality,
        setQuality,
    } = useMediasoupViewer(matchId);

    // Helper to determine if we should show the video element
    const showVideo = state === "live" || state === "paused";

    return (
        <div className={`relative w-full aspect-video bg-zinc-900 group ${
            fullscreen ? "fixed inset-0 z-50" : ""
        }`}>
            {/* ✅ FIX: We conditionally render the video or hide it.
               When 'ended', we hide it so the frozen frame is gone.
            */}
            <video
                ref={videoRef}
                autoPlay
                playsInline
                muted={muted}
                className={`w-full h-full object-cover ${showVideo ? "block" : "hidden"}`}
            />

            {/* OVERLAYS */}
            {state !== "live" && (
                <div className={`absolute inset-0 flex flex-col items-center justify-center z-10 
                    ${state === "paused" ? "bg-black/80 backdrop-blur-sm" : "bg-zinc-900"}
                `}>
                    {/* CONNECTING */}
                    {state === "connecting" && (
                        <Loader2 className="animate-spin text-white" size={48} />
                    )}

                    {/* WAITING */}
                    {state === "waiting" && (
                        <>
                            <Radio className="text-blue-400 animate-pulse" size={48} />
                            <p className="mt-4 font-medium text-lg text-white">Waiting for broadcast</p>
                            <p className="text-sm text-neutral-400">Streamer is setting up...</p>
                        </>
                    )}

                    {/* PAUSED */}
                    {state === "paused" && (
                        <>
                            <Coffee className="text-yellow-400" size={48} />
                            <p className="mt-4 font-medium text-lg text-white">Be right back</p>
                            <p className="text-sm text-neutral-400">Stream paused by broadcaster</p>
                        </>
                    )}

                    {/* ENDED - This will now have a clean solid background */}
                    {state === "ended" && (
                        <>
                            <Flag className="text-neutral-500" size={48} />
                            <p className="mt-4 font-medium text-lg text-white">Stream Ended</p>
                            <p className="text-sm text-neutral-400">Thank you for watching</p>
                        </>
                    )}

                    {/* ERROR */}
                    {state === "error" && (
                        <>
                            <AlertCircle className="text-red-500" size={48} />
                            <p className="mt-4 font-medium text-lg text-red-400">Connection Error</p>
                            <p className="text-sm text-red-300/80">{error || "Stream unavailable"}</p>
                        </>
                    )}
                </div>
            )}

            {/* CONTROLS - Visible on Hover when Live or Paused */}
            {showVideo && (
                <div className="absolute bottom-0 left-0 right-0 p-4 flex justify-between items-center bg-gradient-to-t from-black/90 to-transparent transition-opacity opacity-0 group-hover:opacity-100 z-20">
                    <button onClick={() => setMuted(m => !m)} className="text-white hover:text-blue-400">
                        {muted ? <VolumeX size={24} /> : <Volume2 size={24} />}
                    </button>

                    <div className="flex items-center gap-3">
                        <select
                            value={quality}
                            onChange={e => setQuality(e.target.value as Quality)}
                            className="bg-black/50 border border-white/20 text-white text-xs rounded px-2 py-1 outline-none cursor-pointer"
                        >
                            <option value="auto">Auto</option>
                            <option value="high">720p</option>
                            <option value="medium">480p</option>
                            <option value="low">360p</option>
                        </select>

                        <button onClick={() => setFullscreen(f => !f)} className="text-white hover:text-blue-400">
                            {fullscreen ? <Minimize size={24} /> : <Maximize size={24} />}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}