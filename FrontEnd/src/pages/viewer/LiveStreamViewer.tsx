import { useParams } from "react-router-dom";
import { useState } from "react";
import {
    Volume2, VolumeX, AlertCircle, Maximize, Minimize,
    Radio, Loader2, Coffee, Flag, Share2, ThumbsUp,
    MoreHorizontal, Eye, Settings, Wifi
} from "lucide-react";
import { useMediasoupViewer } from "../../hooks/viewer/useMediasoupViewer";
import Navbar from "../../components/viewer/Navbar";

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
        metadata,
    } = useMediasoupViewer(matchId);

    // Show video logic: Live or Paused (but buffer/resume might still show video frame)
    const showVideo = state === "live" || state === "paused";

    const formatViewers = (num: number) => {
        return num >= 1000 ? `${(num / 1000).toFixed(1)}k` : num;
    };

    if (!matchId) return <div className="text-white text-center mt-20">Invalid Match ID</div>;

    return (
        <>
            {!fullscreen && <Navbar />}
            <div className={`flex flex-col w-full bg-neutral-900 text-white min-h-screen ${fullscreen ? "overflow-hidden" : ""}`}>

                {/* === VIDEO PLAYER CONTAINER === */}
                <div className={`
                    relative bg-black group transition-all duration-300 flex flex-col justify-center
                    ${fullscreen ? "fixed inset-0 z-50 h-screen w-screen" : "w-full max-w-[1600px] mx-auto aspect-video max-h-[90vh] lg:rounded-b-xl overflow-hidden shadow-2xl"}
                `}>

                    {/* 1. The Video Element */}
                    <video
                        ref={videoRef}
                        autoPlay
                        playsInline
                        muted={muted}
                        className={`w-full h-full object-contain bg-black transition-opacity duration-500 ${showVideo ? "opacity-100" : "opacity-0"}`}
                    />

                    {/* 2. Status Overlays */}
                    {state !== "live" && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center z-20 backdrop-blur-sm bg-black/60">
                            
                            {state === "connecting" && (
                                <div className="flex flex-col items-center gap-4">
                                    <Loader2 className="animate-spin text-red-500" size={48} />
                                    <p className="text-white font-medium tracking-widest text-sm animate-pulse">CONNECTING TO LIVE FEED</p>
                                </div>
                            )}

                            {state === "waiting" && (
                                <div className="text-center">
                                    <div className="relative inline-flex items-center justify-center mb-6">
                                        <div className="absolute inset-0 bg-red-500/20 blur-2xl animate-pulse rounded-full" />
                                        <Wifi className="text-red-500/50 w-24 h-24 absolute animate-ping" />
                                        <Radio className="text-red-500 relative z-10" size={64} />
                                    </div>
                                    <h3 className="text-2xl font-bold text-white">Stream Starting Soon</h3>
                                    <p className="text-neutral-400 mt-2">The arena is being prepped. Stay tuned.</p>
                                </div>
                            )}

                            {state === "paused" && (
                                <div className="text-center bg-neutral-900/80 p-8 rounded-2xl border border-white/10 backdrop-blur-md">
                                    <Coffee className="text-yellow-500 mx-auto mb-4" size={48} />
                                    <h3 className="text-xl font-bold text-white">Coverage Paused</h3>
                                    <p className="text-neutral-400">We'll be right back.</p>
                                </div>
                            )}

                            {state === "ended" && (
                                <div className="text-center">
                                    <Flag className="text-neutral-500 mx-auto mb-4" size={64} />
                                    <h3 className="text-2xl font-bold text-white">Stream Ended</h3>
                                    <p className="text-neutral-400 mt-2">Thank you for watching!</p>
                                </div>
                            )}

                            {state === "error" && (
                                <div className="text-center max-w-md px-6">
                                    <AlertCircle className="text-red-500 mx-auto mb-4" size={56} />
                                    <h3 className="text-xl font-bold text-red-500">Connection Failed</h3>
                                    <p className="text-white/80 mt-2 bg-red-900/20 p-3 rounded border border-red-500/20 font-mono text-sm">
                                        {error || "Unable to establish connection to the media server."}
                                    </p>
                                </div>
                            )}
                        </div>
                    )}

                    {/* 3. Live Indicators (Top Left) */}
                    {state === "live" && (
                        <div className="absolute top-6 left-6 z-30 flex items-center gap-3">
                            <div className="flex items-center gap-2 bg-red-600 text-white px-3 py-1 rounded-md text-xs font-bold tracking-wider shadow-lg shadow-red-900/20">
                                <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
                                LIVE
                            </div>
                            <div className="flex items-center gap-2 bg-black/60 backdrop-blur-md text-white px-3 py-1 rounded-md text-xs font-bold border border-white/10">
                                <Eye size={14} className="text-white/70" />
                                {formatViewers(metadata.viewers)}
                            </div>
                        </div>
                    )}

                    {/* 4. Controls Bar */}
                    <div className="absolute bottom-0 left-0 right-0 z-30 px-6 pb-6 pt-24 bg-gradient-to-t from-black/90 via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="flex justify-between items-end">
                            <div className="flex items-center gap-4">
                                <button onClick={() => setMuted(m => !m)} className="text-white/90 hover:text-white p-2 hover:bg-white/10 rounded-full transition">
                                    {muted ? <VolumeX size={24} /> : <Volume2 size={24} />}
                                </button>
                            </div>

                            <div className="flex items-center gap-3">
                                {/* Quality Dropdown */}
                                <div className="relative group/quality">
                                    <button className="flex items-center gap-1.5 text-white/90 hover:text-white px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-white/10 transition">
                                        <Settings size={18} />
                                        <span className="uppercase">{quality}</span>
                                    </button>
                                    <div className="absolute bottom-full right-0 mb-2 w-32 bg-neutral-900 border border-neutral-700 rounded-lg shadow-xl overflow-hidden hidden group-hover/quality:block">
                                        {(["auto", "high", "medium", "low"] as Quality[]).map((q) => (
                                            <button
                                                key={q}
                                                onClick={() => setQuality(q)}
                                                className={`w-full text-left px-4 py-2 text-xs font-bold uppercase hover:bg-white/10 ${quality === q ? "text-red-500" : "text-white"}`}
                                            >
                                                {q}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <button onClick={() => setFullscreen(f => !f)} className="text-white/90 hover:text-white p-2 hover:bg-white/10 rounded-full transition">
                                    {fullscreen ? <Minimize size={24} /> : <Maximize size={24} />}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* === STREAM INFO === */}
                {!fullscreen && (
                    <div className="w-full max-w-[1600px] mx-auto p-6">
                        <div className="flex flex-col lg:flex-row gap-8 justify-between items-start border-b border-neutral-800 pb-8">
                            <div className="flex-1 space-y-4">
                                <h1 className="text-3xl font-bold">{metadata.title}</h1>
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-full bg-neutral-800 flex items-center justify-center font-bold text-red-500 border border-neutral-700">
                                        {metadata.streamerName.charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                        <h3 className="font-semibold">{metadata.streamerName}</h3>
                                        <p className="text-xs text-neutral-400 uppercase">Official Broadcast</p>
                                    </div>
                                    <button className="ml-4 px-4 py-1.5 bg-red-600 hover:bg-red-700 text-white text-sm font-semibold rounded-full transition">
                                        Follow
                                    </button>
                                </div>
                                <div className="p-4 bg-neutral-800/50 rounded-xl border border-neutral-800 text-neutral-300 text-sm">
                                    {metadata.description || "No description provided."}
                                </div>
                            </div>

                            <div className="flex gap-3">
                                <button className="flex items-center gap-2 bg-neutral-800 hover:bg-neutral-700 text-white px-6 py-3 rounded-xl font-medium border border-neutral-700 transition">
                                    <ThumbsUp size={18} /> Like
                                </button>
                                <button className="flex items-center gap-2 bg-neutral-800 hover:bg-neutral-700 text-white px-6 py-3 rounded-xl font-medium border border-neutral-700 transition">
                                    <Share2 size={18} /> Share
                                </button>
                                <button className="w-12 flex items-center justify-center bg-neutral-800 hover:bg-neutral-700 text-white rounded-xl border border-neutral-700 transition">
                                    <MoreHorizontal size={20} />
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}