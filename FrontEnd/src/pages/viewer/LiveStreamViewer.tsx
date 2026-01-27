import { useParams } from "react-router-dom";
import { useState, useRef } from "react";
import {
    Volume2, VolumeX, AlertCircle, Maximize, Minimize,
    Radio, Loader2, Coffee, Flag, Settings, Wifi, Eye
} from "lucide-react";
import { useMediasoupViewer } from "../../hooks/viewer/useMediasoupViewer";
import Navbar from "../../components/viewer/Navbar";

type Quality = "auto" | "low" | "medium" | "high";

export default function LiveStreamViewer() {
    const { matchId } = useParams();
    const [fullscreen, setFullscreen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

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

    const toggleFullscreen = () => {
        if (!document.fullscreenElement) {
            containerRef.current?.requestFullscreen();
            setFullscreen(true);
        } else {
            document.exitFullscreen();
            setFullscreen(false);
        }
    };

    const showVideo = state === "live" || state === "paused";

    const formatViewers = (num: number) => {
        return num >= 1000 ? `${(num / 1000).toFixed(1)}k` : num;
    };

    if (!matchId) return <div className="text-primary text-center mt-20">Invalid Match ID</div>;

    return (
        <>
            {!fullscreen && <Navbar />}
            <div className="flex flex-col w-full bg-background text-foreground min-h-screen">

                {/* === VIDEO PLAYER CONTAINER === */}
                <div 
                    ref={containerRef}
                    className={`
                        relative bg-black group transition-all duration-300 flex flex-col justify-center
                        ${fullscreen ? "h-screen w-screen" : "w-full max-w-[1600px] mx-auto aspect-video max-h-[90vh] lg:rounded-b-xl overflow-hidden shadow-2xl"}
                    `}
                >

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
                                    <Loader2 className="animate-spin text-primary" size={48} />
                                    <p className="text-white font-medium tracking-widest text-sm animate-pulse">CONNECTING TO LIVE FEED</p>
                                </div>
                            )}

                            {state === "waiting" && (
                                <div className="text-center">
                                    <div className="relative inline-flex items-center justify-center mb-6">
                                        <div className="absolute inset-0 bg-primary/20 blur-2xl animate-pulse rounded-full" />
                                        <Wifi className="text-primary/50 w-24 h-24 absolute animate-ping" />
                                        <Radio className="text-primary relative z-10" size={64} />
                                    </div>
                                    <h3 className="text-2xl font-bold text-white">Stream Starting Soon</h3>
                                    <p className="text-muted-foreground mt-2">The arena is being prepped. Stay tuned.</p>
                                </div>
                            )}

                            {state === "paused" && (
                                <div className="text-center bg-card/80 p-8 rounded-2xl border border-border backdrop-blur-md">
                                    <Coffee className="text-primary mx-auto mb-4" size={48} />
                                    <h3 className="text-xl font-bold text-white">Coverage Paused</h3>
                                    <p className="text-muted-foreground">We'll be right back.</p>
                                </div>
                            )}

                            {state === "ended" && (
                                <div className="text-center">
                                    <Flag className="text-muted-foreground mx-auto mb-4" size={64} />
                                    <h3 className="text-2xl font-bold text-white">Stream Ended</h3>
                                    <p className="text-muted-foreground mt-2">Thank you for watching!</p>
                                </div>
                            )}

                            {state === "error" && (
                                <div className="text-center max-w-md px-6">
                                    <AlertCircle className="text-destructive mx-auto mb-4" size={56} />
                                    <h3 className="text-xl font-bold text-destructive">Connection Failed</h3>
                                    <p className="text-white/80 mt-2 bg-destructive/10 p-3 rounded border border-destructive/20 font-mono text-sm">
                                        {error || "Unable to establish connection to the media server."}
                                    </p>
                                </div>
                            )}
                        </div>
                    )}

                    {/* 3. Live Indicators */}
                    {state === "live" && (
                        <div className="absolute top-6 left-6 z-30 flex items-center gap-3">
                            <div className="flex items-center gap-2 bg-primary text-primary-foreground px-3 py-1 rounded-md text-xs font-bold tracking-wider shadow-lg">
                                <span className="w-2 h-2 bg-current rounded-full animate-pulse" />
                                LIVE
                            </div>
                            <div className="flex items-center gap-2 bg-black/60 backdrop-blur-md text-white px-3 py-1 rounded-md text-xs font-bold border border-white/10">
                                <Eye size={14} className="text-white/70" />
                                {formatViewers(metadata.viewers)}
                            </div>
                        </div>
                    )}

                    {/* 4. Controls Bar */}
                    <div className="absolute bottom-0 left-0 right-0 z-30 px-6 pb-6 pt-24 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="flex justify-between items-center">
                            <div className="flex items-center gap-4">
                                <button onClick={() => setMuted(m => !m)} className="text-white/90 hover:text-white p-2 hover:bg-white/10 rounded-full transition">
                                    {muted ? <VolumeX size={24} /> : <Volume2 size={24} />}
                                </button>
                            </div>

                            <div className="flex items-center gap-3">
                                <div className="relative group/quality">
                                    <button className="flex items-center gap-1.5 text-white/90 hover:text-white px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-white/10 transition">
                                        <Settings size={18} />
                                        <span className="uppercase">{quality}</span>
                                    </button>
                                    <div className="absolute bottom-full right-0 mb-2 w-32 bg-popover border border-border rounded-lg shadow-xl overflow-hidden hidden group-hover/quality:block">
                                        {(["auto", "high", "medium", "low"] as Quality[]).map((q) => (
                                            <button
                                                key={q}
                                                onClick={() => setQuality(q)}
                                                className={`w-full text-left px-4 py-2 text-xs font-bold uppercase hover:bg-accent hover:text-accent-foreground ${quality === q ? "text-primary" : "text-popover-foreground"}`}
                                            >
                                                {q}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <button onClick={toggleFullscreen} className="text-white/90 hover:text-white p-2 hover:bg-white/10 rounded-full transition">
                                    {fullscreen ? <Minimize size={24} /> : <Maximize size={24} />}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* === STREAM INFO === */}
                {!fullscreen && (
                    <div className="w-full max-w-[1600px] mx-auto p-6">
                        <div className="flex flex-col gap-4 border-b border-border pb-8">
                            <h1 className="text-3xl font-bold text-foreground">{metadata.title}</h1>
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center font-bold text-primary border border-border text-lg">
                                    {metadata.streamerName.charAt(0).toUpperCase()}
                                </div>
                                <div>
                                    <h3 className="font-semibold text-foreground text-lg">{metadata.streamerName}</h3>
                                    <p className="text-xs text-muted-foreground uppercase tracking-wider">Official Broadcast</p>
                                </div>
                            </div>
                            <div className="mt-4 p-5 bg-card rounded-xl border border-border text-muted-foreground text-sm leading-relaxed">
                                {metadata.description || "No description provided."}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}