import React from 'react';
import { 
    X, Activity, Eye, Mic, MicOff, Video, VideoOff, 
    Settings2, Play, Pause, Square, AlertCircle, Radio 
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
                        ? (score > 8 ? 'bg-emerald-400 h-full' : score > 5 ? 'bg-yellow-400 h-3/4' : 'bg-red-500 h-1/2')
                        : 'bg-neutral-700 h-1'
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
    } = streamData;

    return (
        <>
            <div 
                className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                onClick={onClose}
            />

            {/* Slide-over Panel */}
            <div 
                className={`
                    fixed inset-y-0 right-0 w-full md:w-[480px] bg-[#0a0a0a] border-l border-white/10 
                    shadow-2xl transform transition-transform duration-300 ease-in-out z-50 flex flex-col
                    ${isOpen ? 'translate-x-0' : 'translate-x-full'}
                `}
            >
                {/* --- HEADER --- */}
                <div className="px-6 py-4 border-b border-white/5 flex justify-between items-center bg-neutral-900/50 backdrop-blur-md">
                    <div>
                        <div className="flex items-center gap-2 mb-0.5">
                            <Radio className={`w-4 h-4 ${status === 'live' ? 'text-red-500 animate-pulse' : 'text-indigo-400'}`} />
                            <h2 className="font-bold text-white uppercase tracking-wider text-sm">Stream Control</h2>
                        </div>
                        <p className="text-[10px] text-neutral-500 font-mono">
                            STATUS: <span className={status === 'live' ? 'text-red-500 font-bold' : 'text-neutral-400'}>{status.toUpperCase()}</span>
                        </p>
                    </div>
                    <button 
                        onClick={onClose} 
                        className="p-2 -mr-2 hover:bg-white/5 rounded-lg text-neutral-400 hover:text-white transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* --- SCROLLABLE CONTENT --- */}
                <div className="flex-1 overflow-y-auto p-6 space-y-8 scrollbar-thin scrollbar-thumb-neutral-800">
                    
                    {/* 1. MONITOR SECTION */}
                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <h3 className="text-xs font-bold text-neutral-500 uppercase tracking-wider flex items-center gap-2">
                                <Activity className="w-3 h-3" /> Output Monitor
                            </h3>
                            {status === 'live' && <span className="text-[10px] font-mono text-emerald-500">connection: stable</span>}
                        </div>

                        <div className="relative aspect-video bg-neutral-950 rounded-xl overflow-hidden border border-neutral-800 shadow-2xl group">
                            {/* Glow Effect */}
                            {status === 'live' && <div className="absolute inset-0 bg-indigo-500/10 blur-xl rounded-full opacity-50"></div>}
                            
                            <video 
                                ref={localVideoRef} 
                                autoPlay muted playsInline 
                                className={`relative z-10 w-full h-full object-cover transition-opacity duration-700 ${localStream ? 'opacity-100' : 'opacity-0'}`} 
                            />
                            
                            {/* Fallback Screen */}
                            {!localStream && (
                                <div className="absolute inset-0 flex flex-col items-center justify-center bg-neutral-900/50 backdrop-blur-sm z-20">
                                    <div className="w-12 h-12 rounded-full bg-neutral-800 flex items-center justify-center mb-2 border border-neutral-700">
                                        <VideoOff className="w-5 h-5 text-neutral-600" />
                                    </div>
                                    <p className="text-[10px] text-neutral-500 uppercase tracking-widest font-bold">No Signal</p>
                                </div>
                            )}

                            {/* Live Overlays */}
                            {status === 'live' && (
                                <div className="absolute inset-0 z-30 pointer-events-none p-3 flex flex-col justify-between">
                                    <div className="self-end flex items-center gap-1.5 bg-black/60 backdrop-blur-md px-2 py-1 rounded text-xs border border-white/5">
                                        <Eye size={12} className="text-sky-400" /> 
                                        <span className="font-bold text-white">{viewerCount}</span>
                                    </div>
                                    <div className="self-start flex items-center gap-2">
                                        <div className="bg-red-600 text-white text-[10px] px-1.5 py-0.5 rounded font-bold shadow-lg animate-pulse">REC</div>
                                        <span className="font-mono text-sm text-white drop-shadow-md font-medium">{elapsedTime}</span>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* 2. SOURCE CONTROLS */}
                    <div className="space-y-3">
                        <h3 className="text-xs font-bold text-neutral-500 uppercase tracking-wider flex items-center gap-2">
                            <Settings2 className="w-3 h-3" /> Sources
                        </h3>
                        <div className="grid grid-cols-2 gap-3">
                            {/* Camera Toggle */}
                            <button 
                                onClick={toggleVideo} 
                                disabled={status === 'idle'}
                                className={`
                                    p-3 rounded-xl border text-left transition-all relative overflow-hidden group
                                    ${isVideoEnabled && status !== 'idle' ? 'bg-indigo-500/10 border-indigo-500/50' : 'bg-neutral-800/50 border-neutral-800'}
                                    ${status === 'idle' ? 'opacity-50 cursor-not-allowed' : 'hover:border-neutral-600'}
                                `}
                            >
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-2 ${isVideoEnabled ? 'bg-indigo-500 text-white' : 'bg-neutral-700 text-neutral-400'}`}>
                                    {isVideoEnabled ? <Video size={14} /> : <VideoOff size={14} />}
                                </div>
                                <div className="text-xs font-bold text-neutral-300">Camera</div>
                                <div className="text-[10px] text-neutral-500">{isVideoEnabled ? 'Active' : 'Muted'}</div>
                            </button>

                            {/* Mic Toggle */}
                            <button 
                                onClick={toggleAudio} 
                                disabled={status === 'idle'}
                                className={`
                                    p-3 rounded-xl border text-left transition-all relative overflow-hidden group
                                    ${isAudioEnabled && status !== 'idle' ? 'bg-emerald-500/10 border-emerald-500/50' : 'bg-neutral-800/50 border-neutral-800'}
                                    ${status === 'idle' ? 'opacity-50 cursor-not-allowed' : 'hover:border-neutral-600'}
                                `}
                            >
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-2 ${isAudioEnabled ? 'bg-emerald-500 text-white' : 'bg-neutral-700 text-neutral-400'}`}>
                                    {isAudioEnabled ? <Mic size={14} /> : <MicOff size={14} />}
                                </div>
                                <div className="text-xs font-bold text-neutral-300">Microphone</div>
                                <div className="text-[10px] text-neutral-500">{isAudioEnabled ? 'Active' : 'Muted'}</div>
                            </button>
                        </div>
                    </div>

                    {/* 3. METADATA INPUTS */}
                    <div className="space-y-4 pt-2 border-t border-white/5">
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-neutral-500 uppercase">Broadcast Title</label>
                            <input 
                                type="text" 
                                value={streamTitle}
                                onChange={(e) => setStreamTitle(e.target.value)}
                                disabled={status !== 'idle'}
                                className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-2.5 text-sm text-white placeholder-neutral-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all disabled:opacity-50"
                                placeholder="e.g. Finals: Team A vs Team B"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-neutral-500 uppercase">Description</label>
                            <textarea 
                                value={streamDesc}
                                onChange={(e) => setStreamDesc(e.target.value)}
                                disabled={status !== 'idle'}
                                className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-2.5 text-sm text-white placeholder-neutral-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all resize-none h-20 disabled:opacity-50"
                                placeholder="Describe the match..."
                            />
                        </div>
                    </div>

                    {/* 4. HEALTH STATS (Visible when Live) */}
                    {(status === 'live' || status === 'paused') && (
                        <div className="bg-neutral-900/80 rounded-xl p-4 border border-neutral-800 space-y-3">
                            <div className="flex items-center justify-between pb-2 border-b border-white/5">
                                <span className="text-[10px] font-bold text-neutral-400 uppercase">Stream Health</span>
                                <SignalStrength score={stats.score} />
                            </div>
                            
                            {/* Bitrate */}
                            <div className="space-y-1">
                                <div className="flex justify-between text-[10px]">
                                    <span className="text-neutral-500">Bitrate</span>
                                    <span className="text-white font-mono">{(stats.videoBitrate / 1000).toFixed(0)} kbps</span>
                                </div>
                                <div className="w-full bg-neutral-800 h-1 rounded-full overflow-hidden">
                                    <div className="bg-indigo-500 h-full transition-all duration-500" style={{ width: `${Math.min(100, (stats.videoBitrate / 3000000) * 100)}%` }} />
                                </div>
                            </div>

                            {/* Latency */}
                            <div className="space-y-1">
                                <div className="flex justify-between text-[10px]">
                                    <span className="text-neutral-500">Latency</span>
                                    <span className="text-white font-mono">{Math.round(stats.rtt)} ms</span>
                                </div>
                                <div className="w-full bg-neutral-800 h-1 rounded-full overflow-hidden">
                                    <div className={`h-full transition-all duration-500 ${stats.rtt < 100 ? 'bg-emerald-500' : 'bg-amber-500'}`} style={{ width: `${Math.min(100, (stats.rtt / 500) * 100)}%` }} />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* ERROR MSG */}
                    {errorMsg && (
                        <div className="flex items-start gap-2 text-xs text-red-400 bg-red-900/10 p-3 rounded-lg border border-red-500/20">
                            <AlertCircle size={14} className="shrink-0 mt-0.5" />
                            <span>{errorMsg}</span>
                        </div>
                    )}
                </div>

                {/* --- FOOTER ACTIONS --- */}
                <div className="p-6 border-t border-white/5 bg-neutral-900">
                    {status === 'idle' || status === 'connecting' ? (
                        <button
                            onClick={handleStartStream}
                            disabled={status === 'connecting'}
                            className="group relative w-full overflow-hidden rounded-xl bg-white p-[1px] focus:outline-none focus:ring-2 focus:ring-indigo-400 transition-transform active:scale-[0.98]"
                        >
                            <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2E8F0_0%,#312e81_50%,#E2E8F0_100%)] opacity-0 group-hover:opacity-100 transition-opacity" />
                            <span className={`relative flex h-full w-full items-center justify-center rounded-xl px-8 py-3.5 text-sm font-bold text-white transition-all ${status === 'connecting' ? 'bg-neutral-800' : 'bg-neutral-900 group-hover:bg-neutral-800'}`}>
                                {status === 'connecting' ? (
                                    <>
                                        <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
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
                                className="flex-1 py-3.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white font-bold text-sm border border-neutral-700 flex items-center justify-center gap-2 transition-all"
                            >
                                {isPaused ? <Play size={14} className="fill-current" /> : <Pause size={14} className="fill-current" />}
                                {isPaused ? 'Resume' : 'Pause'}
                            </button>
                            <button 
                                onClick={handleEndStream} 
                                className="flex-1 py-3.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-sm shadow-lg shadow-red-900/20 flex items-center justify-center gap-2 transition-all"
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