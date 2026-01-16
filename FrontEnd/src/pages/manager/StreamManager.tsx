import React from 'react';
import { 
    X, Activity, Eye, Mic, MicOff, Video, VideoOff, 
    Settings2, Play, Pause, Square, AlertCircle, Radio,
    ChevronDown 
} from 'lucide-react';

interface CompactStreamDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    streamData: any; 
}

const SignalStrength = ({ score }: { score: number }) => (
    <div className="flex gap-0.5 items-end h-3">
        {[...Array(5)].map((_, i) => (
            <div
                key={i}
                className={`w-0.5 rounded-sm transition-all duration-300 ${
                    i < (score / 2)
                        ? (score > 8 ? 'bg-emerald-500 h-full' : score > 5 ? 'bg-yellow-500 h-3/4' : 'bg-destructive h-1/2')
                        : 'bg-muted h-1'
                }`}
            />
        ))}
    </div>
);

const StreamManager: React.FC<CompactStreamDrawerProps> = ({ isOpen, onClose, streamData }) => {
    const {
        // UI State
        streamTitle, setStreamTitle,
        streamDesc, setStreamDesc,
        // Logic State
        status, viewerCount, elapsedTime, errorMsg,
        localStream, isAudioEnabled, isVideoEnabled, isPaused,
        stats, localVideoRef,
        // Handlers
        handleStartStream, handleEndStream, pauseStream, resumeStream,
        toggleAudio, toggleVideo,
        // Device Data (NEW)
        videoDevices, audioDevices, selectedVideoDeviceId, selectedAudioDeviceId, switchDevice
    } = streamData;

    return (
        <>
            {/* Backdrop */}
            <div 
                className={`fixed inset-0 bg-background/80 backdrop-blur-sm z-40 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                onClick={onClose}
            />

            {/* Slide-over Panel */}
            <div 
                className={`
                    fixed inset-y-0 right-0 w-full md:w-[480px] bg-card border-l border-border 
                    shadow-2xl transform transition-transform duration-300 ease-in-out z-50 flex flex-col
                    ${isOpen ? 'translate-x-0' : 'translate-x-full'}
                `}
            >
                {/* --- HEADER --- */}
                <div className="px-6 py-4 border-b border-border flex justify-between items-center bg-muted/30 backdrop-blur-md">
                    <div>
                        <div className="flex items-center gap-2 mb-0.5">
                            <Radio className={`w-4 h-4 ${status === 'live' ? 'text-destructive animate-pulse' : 'text-primary'}`} />
                            <h2 className="font-bold text-foreground uppercase tracking-wider text-sm">Stream Control</h2>
                        </div>
                        <p className="text-[10px] text-muted-foreground font-mono">
                            STATUS: <span className={status === 'live' ? 'text-destructive font-bold' : 'text-muted-foreground'}>{status.toUpperCase()}</span>
                        </p>
                    </div>
                    <button 
                        onClick={onClose} 
                        className="p-2 -mr-2 hover:bg-muted rounded-lg text-muted-foreground hover:text-foreground transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* --- SCROLLABLE CONTENT --- */}
                <div className="flex-1 overflow-y-auto p-6 space-y-8 scrollbar-thin scrollbar-thumb-muted">
                    
                    {/* 1. MONITOR SECTION */}
                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                                <Activity className="w-3 h-3" /> Output Monitor
                            </h3>
                            {status === 'live' && <span className="text-[10px] font-mono text-emerald-500">connection: stable</span>}
                        </div>

                        {/* Video Player Container */}
                        <div className="relative aspect-video bg-black rounded-xl overflow-hidden border border-border shadow-lg group">
                            {/* Glow Effect */}
                            {status === 'live' && <div className="absolute inset-0 bg-primary/10 blur-xl rounded-full opacity-50"></div>}
                            
                            <video 
                                ref={localVideoRef} 
                                autoPlay muted playsInline 
                                className={`relative z-10 w-full h-full object-cover transition-opacity duration-700 ${localStream ? 'opacity-100' : 'opacity-0'}`} 
                            />
                            
                            {/* Fallback Screen */}
                            {!localStream && (
                                <div className="absolute inset-0 flex flex-col items-center justify-center bg-muted/10 backdrop-blur-sm z-20">
                                    <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-2 border border-border">
                                        <VideoOff className="w-5 h-5 text-muted-foreground" />
                                    </div>
                                    <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">No Signal</p>
                                </div>
                            )}

                            {/* Live Overlays */}
                            {status === 'live' && (
                                <div className="absolute inset-0 z-30 pointer-events-none p-3 flex flex-col justify-between">
                                    <div className="self-end flex items-center gap-1.5 bg-black/60 backdrop-blur-md px-2 py-1 rounded text-xs border border-white/10">
                                        <Eye size={12} className="text-primary" /> 
                                        <span className="font-bold text-white">{viewerCount}</span>
                                    </div>
                                    <div className="self-start flex items-center gap-2">
                                        <div className="bg-destructive text-destructive-foreground text-[10px] px-1.5 py-0.5 rounded font-bold shadow-lg animate-pulse">REC</div>
                                        <span className="font-mono text-sm text-white drop-shadow-md font-medium">{elapsedTime}</span>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* 2. SOURCE CONTROLS */}
                    <div className="space-y-3">
                        <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                            <Settings2 className="w-3 h-3" /> Sources
                        </h3>
                        
                        <div className="grid grid-cols-1 gap-4">
                            
                            {/* CAMERA CONTROL BLOCK */}
                            <div className="p-3 rounded-xl border border-border bg-muted/10 space-y-3">
                                <div className="flex items-center gap-3">
                                    <button 
                                        onClick={toggleVideo}
                                        disabled={status === 'idle' && !localStream}
                                        className={`
                                            p-2 rounded-lg transition-colors shrink-0
                                            ${isVideoEnabled ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}
                                        `}
                                    >
                                        {isVideoEnabled ? <Video size={18} /> : <VideoOff size={18} />}
                                    </button>
                                    
                                    <div className="flex-1 relative">
                                        <label className="text-[10px] font-bold text-muted-foreground uppercase absolute -top-1.5 left-0">Video Input</label>
                                        <div className="relative mt-2">
                                            <select 
                                                value={selectedVideoDeviceId}
                                                onChange={(e) => switchDevice('video', e.target.value)}
                                                className="w-full bg-background border border-border text-foreground text-xs rounded-lg pl-2 pr-8 py-2 appearance-none focus:outline-none focus:ring-1 focus:ring-primary truncate"
                                            >
                                                {videoDevices.map((dev: MediaDeviceInfo) => (
                                                    <option key={dev.deviceId} value={dev.deviceId}>
                                                        {dev.label || `Camera ${dev.deviceId.slice(0,5)}...`}
                                                    </option>
                                                ))}
                                            </select>
                                            <ChevronDown className="absolute right-2 top-2.5 w-3 h-3 text-muted-foreground pointer-events-none" />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* MICROPHONE CONTROL BLOCK */}
                            <div className="p-3 rounded-xl border border-border bg-muted/10 space-y-3">
                                <div className="flex items-center gap-3">
                                    <button 
                                        onClick={toggleAudio}
                                        disabled={status === 'idle' && !localStream}
                                        className={`
                                            p-2 rounded-lg transition-colors shrink-0
                                            ${isAudioEnabled ? 'bg-emerald-500 text-white' : 'bg-muted text-muted-foreground'}
                                        `}
                                    >
                                        {isAudioEnabled ? <Mic size={18} /> : <MicOff size={18} />}
                                    </button>
                                    
                                    <div className="flex-1 relative">
                                        <label className="text-[10px] font-bold text-muted-foreground uppercase absolute -top-1.5 left-0">Audio Input</label>
                                        <div className="relative mt-2">
                                            <select 
                                                value={selectedAudioDeviceId}
                                                onChange={(e) => switchDevice('audio', e.target.value)}
                                                className="w-full bg-background border border-border text-foreground text-xs rounded-lg pl-2 pr-8 py-2 appearance-none focus:outline-none focus:ring-1 focus:ring-primary truncate"
                                            >
                                                {audioDevices.map((dev: MediaDeviceInfo) => (
                                                    <option key={dev.deviceId} value={dev.deviceId}>
                                                        {dev.label || `Mic ${dev.deviceId.slice(0,5)}...`}
                                                    </option>
                                                ))}
                                            </select>
                                            <ChevronDown className="absolute right-2 top-2.5 w-3 h-3 text-muted-foreground pointer-events-none" />
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>

                    {/* 3. METADATA INPUTS */}
                    <div className="space-y-4 pt-2 border-t border-border">
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-muted-foreground uppercase">Broadcast Title</label>
                            <input 
                                type="text" 
                                value={streamTitle}
                                onChange={(e) => setStreamTitle(e.target.value)}
                                disabled={status !== 'idle'}
                                className="w-full bg-background border border-border rounded-lg px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all disabled:opacity-50"
                                placeholder="e.g. Finals: Team A vs Team B"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-muted-foreground uppercase">Description</label>
                            <textarea 
                                value={streamDesc}
                                onChange={(e) => setStreamDesc(e.target.value)}
                                disabled={status !== 'idle'}
                                className="w-full bg-background border border-border rounded-lg px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all resize-none h-20 disabled:opacity-50"
                                placeholder="Describe the match..."
                            />
                        </div>
                    </div>

                    {/* 4. HEALTH STATS (Visible when Live) */}
                    {(status === 'live' || status === 'paused') && (
                        <div className="bg-muted/20 rounded-xl p-4 border border-border space-y-3">
                            <div className="flex items-center justify-between pb-2 border-b border-border/50">
                                <span className="text-[10px] font-bold text-muted-foreground uppercase">Stream Health</span>
                                <SignalStrength score={stats.score} />
                            </div>
                            
                            {/* Bitrate */}
                            <div className="space-y-1">
                                <div className="flex justify-between text-[10px]">
                                    <span className="text-muted-foreground">Bitrate</span>
                                    <span className="text-foreground font-mono">{(stats.videoBitrate / 1000).toFixed(0)} kbps</span>
                                </div>
                                <div className="w-full bg-muted h-1 rounded-full overflow-hidden">
                                    <div className="bg-primary h-full transition-all duration-500" style={{ width: `${Math.min(100, (stats.videoBitrate / 3000000) * 100)}%` }} />
                                </div>
                            </div>

                            {/* Latency */}
                            <div className="space-y-1">
                                <div className="flex justify-between text-[10px]">
                                    <span className="text-muted-foreground">Latency</span>
                                    <span className="text-foreground font-mono">{Math.round(stats.rtt)} ms</span>
                                </div>
                                <div className="w-full bg-muted h-1 rounded-full overflow-hidden">
                                    <div className={`h-full transition-all duration-500 ${stats.rtt < 100 ? 'bg-emerald-500' : 'bg-amber-500'}`} style={{ width: `${Math.min(100, (stats.rtt / 500) * 100)}%` }} />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* ERROR MSG */}
                    {errorMsg && (
                        <div className="flex items-start gap-2 text-xs text-destructive bg-destructive/10 p-3 rounded-lg border border-destructive/20">
                            <AlertCircle size={14} className="shrink-0 mt-0.5" />
                            <span>{errorMsg}</span>
                        </div>
                    )}
                </div>

                {/* --- FOOTER ACTIONS --- */}
                <div className="p-6 border-t border-border bg-card">
                    {status === 'idle' || status === 'connecting' ? (
                        <button
                            onClick={handleStartStream}
                            disabled={status === 'connecting'}
                            className={`
                                w-full relative overflow-hidden rounded-xl p-[1px] focus:outline-none focus:ring-2 focus:ring-primary transition-transform active:scale-[0.98]
                                ${status === 'connecting' ? 'cursor-not-allowed opacity-80' : ''}
                            `}
                        >
                            <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,transparent_0%,var(--color-primary)_50%,transparent_100%)] opacity-0 hover:opacity-100 transition-opacity" />
                            <span className={`relative flex h-full w-full items-center justify-center rounded-xl px-8 py-3.5 text-sm font-bold transition-all bg-primary text-primary-foreground hover:opacity-90`}>
                                {status === 'connecting' ? (
                                    <>
                                        <div className="w-3 h-3 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin mr-2" />
                                        Connecting...
                                    </>
                                ) : (
                                    'START BROADCAST'
                                )}
                            </span>
                        </button>
                    ) : (
                        <div className="flex gap-3">
                            <button 
                                onClick={isPaused ? resumeStream : pauseStream} 
                                className="flex-1 py-3.5 rounded-xl bg-secondary text-secondary-foreground hover:bg-secondary/80 font-bold text-sm border border-border flex items-center justify-center gap-2 transition-all"
                            >
                                {isPaused ? <Play size={14} className="fill-current" /> : <Pause size={14} className="fill-current" />}
                                {isPaused ? 'Resume' : 'Pause'}
                            </button>
                            <button 
                                onClick={handleEndStream} 
                                className="flex-1 py-3.5 rounded-xl bg-destructive text-destructive-foreground hover:opacity-90 font-bold text-sm shadow-md shadow-destructive/20 flex items-center justify-center gap-2 transition-all"
                            >
                                <Square size={14} className="fill-current" />
                                End
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default StreamManager;