import { useParams } from "react-router-dom";
import { useState } from "react";
import {
    Volume2, VolumeX, AlertCircle, Maximize, Minimize,
    Radio, Loader2, Coffee, Flag, Share2, ThumbsUp, 
    MoreHorizontal, Eye, Settings
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
        metadata,
    } = useMediasoupViewer(matchId);

    // Helper: Only show video element if active (prevents frozen frames on end)
    const showVideo = state === "live" || state === "paused";

    // Format Viewers
    const formatViewers = (num: number) => {
        return num >= 1000 ? `${(num / 1000).toFixed(1)}k` : num;
    };

    return (
        <div className={`flex flex-col w-full bg-[#09090b] text-zinc-100 min-h-screen ${fullscreen ? "overflow-hidden" : ""}`}>
            
            {/* === VIDEO PLAYER CONTAINER === */}
            <div className={`relative w-full bg-black group transition-all duration-300 ${
                fullscreen ? "fixed inset-0 z-50 h-screen" : "w-full max-w-[1600px] mx-auto aspect-video max-h-[70vh]"
            }`}>
                
                {/* 1. The Video Element */}
                <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted={muted}
                    className={`w-full h-full object-contain bg-black ${showVideo ? "block" : "hidden"}`}
                />

                {/* 2. Status Overlays (Connecting, Error, etc) */}
                {state !== "live" && (
                    <div className={`absolute inset-0 flex flex-col items-center justify-center z-20 backdrop-blur-sm transition-all duration-500
                        ${state === "paused" ? "bg-black/60" : "bg-zinc-900"}
                    `}>
                        {state === "connecting" && (
                            <div className="flex flex-col items-center gap-4">
                                <Loader2 className="animate-spin text-blue-500" size={56} />
                                <p className="text-blue-200 font-medium tracking-wide animate-pulse">ESTABLISHING CONNECTION</p>
                            </div>
                        )}

                        {state === "waiting" && (
                            <div className="text-center">
                                <div className="relative inline-block">
                                    <div className="absolute inset-0 bg-blue-500 blur-xl opacity-20 animate-pulse rounded-full"></div>
                                    <Radio className="text-blue-400 relative z-10" size={64} />
                                </div>
                                <h3 className="mt-6 text-2xl font-bold text-white">Stream Starting Soon</h3>
                                <p className="text-zinc-400 mt-2">The broadcaster is setting up the stage.</p>
                            </div>
                        )}

                        {state === "paused" && (
                            <div className="text-center bg-black/40 p-8 rounded-2xl border border-white/5 backdrop-blur-md">
                                <Coffee className="text-yellow-400 mx-auto mb-4" size={48} />
                                <h3 className="text-xl font-bold text-white">Be Right Back</h3>
                                <p className="text-zinc-300">Stream paused by broadcaster.</p>
                            </div>
                        )}

                        {state === "ended" && (
                            <div className="text-center">
                                <Flag className="text-zinc-600 mx-auto mb-4" size={64} />
                                <h3 className="text-2xl font-bold text-zinc-200">Stream Ended</h3>
                                <p className="text-zinc-500 mt-2">Thanks for watching!</p>
                            </div>
                        )}

                        {state === "error" && (
                            <div className="text-center max-w-md px-6">
                                <AlertCircle className="text-red-500 mx-auto mb-4" size={56} />
                                <h3 className="text-xl font-bold text-red-500">Connection Failed</h3>
                                <p className="text-red-200/70 mt-2 bg-red-950/30 p-3 rounded border border-red-900/50 font-mono text-sm">
                                    {error || "Unknown error occurred"}
                                </p>
                            </div>
                        )}
                    </div>
                )}

                {/* 3. Live UI Badge (Top Left) */}
                {state === "live" && (
                    <div className="absolute top-6 left-6 z-30 flex items-center gap-3 animate-in fade-in duration-500">
                        <div className="flex items-center gap-2 bg-red-600/90 text-white px-3 py-1 rounded text-xs font-bold tracking-wider shadow-[0_0_15px_rgba(220,38,38,0.5)]">
                            <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
                            LIVE
                        </div>
                        <div className="flex items-center gap-2 bg-black/60 backdrop-blur-md text-zinc-200 px-3 py-1 rounded text-xs font-bold border border-white/10">
                            <Eye size={14} className="text-zinc-400" />
                            {formatViewers(metadata.viewers)}
                        </div>
                    </div>
                )}

                {/* 4. Controls Bar (Bottom) */}
                {showVideo && (
                    <div className="absolute bottom-0 left-0 right-0 z-30 px-6 pb-4 pt-16 bg-gradient-to-t from-black/90 via-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="flex justify-between items-end">
                            {/* Left Controls */}
                            <div className="flex items-center gap-4">
                                <button 
                                    onClick={() => setMuted(m => !m)} 
                                    className="text-zinc-200 hover:text-white hover:bg-white/10 p-2 rounded-full transition-colors"
                                >
                                    {muted ? <VolumeX size={24} /> : <Volume2 size={24} />}
                                </button>
                                
                                <div className="flex items-center gap-2 text-xs font-medium text-red-500 uppercase tracking-widest">
                                    <div className="w-1.5 h-1.5 rounded-full bg-red-500" />
                                    Live Sync
                                </div>
                            </div>

                            {/* Right Controls */}
                            <div className="flex items-center gap-3">
                                <div className="relative group/quality">
                                    <button className="flex items-center gap-1.5 text-zinc-200 hover:text-white hover:bg-white/10 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors">
                                        <Settings size={18} />
                                        <span className="uppercase">{quality}</span>
                                    </button>
                                    
                                    {/* Quality Popup */}
                                    <div className="absolute bottom-full right-0 mb-2 w-32 bg-zinc-900 border border-zinc-800 rounded-lg shadow-xl overflow-hidden hidden group-hover/quality:block">
                                        {(["auto", "high", "medium", "low"] as Quality[]).map((q) => (
                                            <button
                                                key={q}
                                                onClick={() => setQuality(q)}
                                                className={`w-full text-left px-4 py-2 text-xs font-medium uppercase hover:bg-zinc-800 transition-colors ${
                                                    quality === q ? "text-blue-400 bg-blue-500/10" : "text-zinc-400"
                                                }`}
                                            >
                                                {q}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <button 
                                    onClick={() => setFullscreen(f => !f)} 
                                    className="text-zinc-200 hover:text-white hover:bg-white/10 p-2 rounded-full transition-colors"
                                >
                                    {fullscreen ? <Minimize size={24} /> : <Maximize size={24} />}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* === STREAM INFO SECTION (Hidden in Fullscreen) === */}
            {!fullscreen && (
                <div className="w-full max-w-[1600px] mx-auto p-6 lg:p-8">
                    <div className="flex flex-col lg:flex-row gap-6 justify-between items-start border-b border-zinc-800 pb-8">
                        
                        {/* Title & Desc */}
                        <div className="flex-1 space-y-4">
                            <h1 className="text-2xl md:text-3xl font-bold text-white leading-tight">
                                {metadata.title}
                            </h1>
                            
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-xl shadow-lg">
                                    {metadata.streamerName.charAt(0)}
                                </div>
                                <div>
                                    <h3 className="text-base font-semibold text-zinc-100">{metadata.streamerName}</h3>
                                    <p className="text-xs text-zinc-500">Sports & Competition</p>
                                </div>
                                <button className="ml-4 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold rounded-full transition-colors">
                                    Subscribe
                                </button>
                            </div>

                            <div className="p-4 bg-zinc-900/50 rounded-xl border border-zinc-800/50 mt-4">
                                <p className="text-zinc-300 text-sm leading-relaxed whitespace-pre-wrap">
                                    {metadata.description}
                                </p>
                            </div>
                        </div>

                        {/* Actions Sidebar */}
                        <div className="flex lg:flex-col items-center lg:items-end gap-3 w-full lg:w-auto">
                            <div className="flex items-center gap-2 w-full lg:w-auto">
                                <button className="flex-1 lg:flex-none flex items-center justify-center gap-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 px-6 py-2.5 rounded-full font-medium transition-all">
                                    <ThumbsUp size={18} />
                                    <span>Like</span>
                                </button>
                                <button className="flex-1 lg:flex-none flex items-center justify-center gap-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 px-6 py-2.5 rounded-full font-medium transition-all">
                                    <Share2 size={18} />
                                    <span>Share</span>
                                </button>
                                <button className="hidden lg:flex items-center justify-center w-10 h-10 bg-zinc-800 hover:bg-zinc-700 text-zinc-400 rounded-full transition-all">
                                    <MoreHorizontal size={20} />
                                </button>
                            </div>
                            
                            <div className="hidden lg:block text-right mt-2">
                                <div className="text-xs text-zinc-500 font-mono">Match ID: {matchId}</div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}