import { useEffect } from 'react';
import { StopCircle, Activity, Mic, MicOff, Video, VideoOff, Settings2, Radio, TrendingUp, Hash, AlignLeft, Loader2 } from 'lucide-react';
import { useStreamManager } from '../../../hooks/useStreamManager';
import { useParams } from 'react-router-dom';
import Navbar from '../Navbar';
import { useAppSelector } from '../../../hooks/hooks';

const StreamerDashboard = () => {
    const { matchId } = useParams();
    const userId = useAppSelector((state) => state.auth.user?._id);
    const stream = useStreamManager(matchId || "", userId || '');

    useEffect(() => {
        const timer = setTimeout(() => {
            if (stream.status === 'live') {
                stream.syncMetadata();
            }
        }, 1000);
        return () => clearTimeout(timer);
    }, [stream.streamTitle, stream.streamDesc, stream.status]);

    const formatBitrate = (bitrate: number) => {
        if (bitrate >= 1000000) return `${(bitrate / 1000000).toFixed(1)} Mbps`;
        return `${(bitrate / 1000 || 0).toFixed(0)} Kbps`;
    };

    return (
        <div className="h-screen bg-background text-foreground flex flex-col overflow-hidden transition-colors duration-300">
            <Navbar />

            <main className="flex-1 grid grid-cols-12 gap-0 overflow-hidden">

                {/* 1. BROADCAST STAGE */}
                <div className="col-span-12 lg:col-span-8 xl:col-span-9 flex flex-col bg-background border-r border-border min-h-0">

                    <div className="flex-1 p-4 lg:p-6 flex flex-col min-h-0">
                        {/* HEADER STATS */}
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-3">
                                <div className="flex items-center gap-2 px-2 py-1 bg-primary/10 rounded border border-primary/20">
                                    <span className={`w-2 h-2 rounded-full ${stream.status === 'live' ? 'bg-destructive animate-pulse' : 'bg-muted-foreground'}`} />
                                    <span className="text-[10px] font-black uppercase tracking-tighter text-primary">
                                        {stream.status === 'connecting' ? 'Connecting...' : 'Program'}
                                    </span>
                                </div>
                                <span className="text-xs font-mono font-medium text-muted-foreground tracking-widest">{stream.elapsedTime}</span>
                            </div>

                            <div className="flex gap-4">
                                <div className="flex items-center gap-2 text-muted-foreground bg-muted/30 px-3 py-1 rounded-full border border-border/50">
                                    <Activity size={12} className="text-primary" />
                                    <span className="text-[10px] font-mono font-bold">{formatBitrate(stream.stats?.videoBitrate || 0)}</span>
                                </div>
                            </div>
                        </div>

                        {/* VIDEO VIEWPORT */}
                        <div className="relative w-full aspect-video max-h-[520px] bg-black rounded-xl overflow-hidden shadow-2xl ring-1 ring-border mx-auto group">
                            <video
                                ref={stream.localVideoRef}
                                autoPlay
                                muted
                                playsInline
                                className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${stream.localStream ? 'opacity-100' : 'opacity-20'}`}
                            />

                            {/* INITIALIZE UI */}
                            {!stream.localStream && (
                                <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-background/40 backdrop-blur-md">
                                    <div className="p-5 rounded-full bg-background border border-border shadow-xl">
                                        <VideoOff className="text-muted-foreground" size={32} />
                                    </div>
                                    <button
                                        onClick={stream.startPreview}
                                        className="px-8 py-3 bg-primary text-primary-foreground text-xs font-black rounded-xl hover:scale-105 active:scale-95 transition-all shadow-xl shadow-primary/20"
                                    >
                                        INITIALIZE CAMERA
                                    </button>
                                </div>
                            )}

                            {/* ERROR POPUP */}
                            {stream.errorMsg && (
                                <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-destructive text-destructive-foreground px-4 py-2 rounded-lg text-xs font-bold shadow-2xl flex items-center gap-2 z-50">
                                    <StopCircle size={14} /> {stream.errorMsg}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* 2. MASTER CONTROL SIDEBAR */}
                <div className="hidden lg:flex col-span-4 xl:col-span-3 bg-card border-l border-border flex-col overflow-y-auto custom-scrollbar">
                    <div className="p-6 space-y-8 pb-12">

                        {/* LIVE TOGGLE */}
                        <div className="space-y-4">
                            {stream.status !== 'live' ? (
                                <button
                                    onClick={stream.handleStartStream}
                                    disabled={!stream.localStream || stream.status === 'connecting'}
                                    className="w-full py-5 bg-primary text-primary-foreground disabled:opacity-40 rounded-2xl font-black text-xs tracking-[0.25em] transition-all flex items-center justify-center gap-3 shadow-xl shadow-primary/20 hover:shadow-primary/40 active:scale-95"
                                >
                                    {stream.status === 'connecting' ? <Loader2 className="animate-spin" size={20} /> : <Radio size={20} />}
                                    {stream.status === 'connecting' ? 'CONNECTING...' : 'GO LIVE NOW'}
                                </button>
                            ) : (
                                <button
                                    onClick={stream.handleEndStream}
                                    className="w-full py-5 bg-destructive text-destructive-foreground rounded-2xl font-black text-xs tracking-[0.25em] transition-all flex items-center justify-center gap-3 shadow-xl shadow-destructive/20 hover:shadow-destructive/40 active:scale-95"
                                >
                                    <StopCircle size={20} /> END SESSION
                                </button>
                            )}

                            <div className="grid grid-cols-2 gap-3">
                                <button onClick={stream.toggleVideo} className={`py-4 rounded-xl flex flex-col items-center gap-2 border-2 transition-all ${stream.isVideoEnabled ? 'bg-background border-border hover:bg-muted' : 'bg-destructive/10 border-destructive shadow-lg text-destructive'}`}>
                                    {stream.isVideoEnabled ? <Video size={18} /> : <VideoOff size={18} />}
                                    <span className="text-[10px] font-black uppercase tracking-tighter">Camera</span>
                                </button>
                                <button onClick={stream.toggleAudio} className={`py-4 rounded-xl flex flex-col items-center gap-2 border-2 transition-all ${stream.isAudioEnabled ? 'bg-background border-border hover:bg-muted' : 'bg-destructive/10 border-destructive shadow-lg text-destructive'}`}>
                                    {stream.isAudioEnabled ? <Mic size={18} /> : <MicOff size={18} />}
                                    <span className="text-[10px] font-black uppercase tracking-tighter">Mic</span>
                                </button>
                            </div>
                        </div>

                        {/* CONFIGURATION */}
                        <div className="space-y-6 bg-muted/20 p-4 rounded-2xl border border-border/50">
                            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-primary flex items-center gap-2">
                                <Settings2 size={14} /> Production Config
                            </h3>

                            <div className="space-y-5">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-muted-foreground uppercase flex items-center gap-1.5 ml-1">
                                        <Hash size={12} /> Broadcast Title
                                    </label>
                                    <input
                                        className="w-full bg-background border-2 border-border rounded-xl px-4 py-3 text-xs font-bold outline-none focus:border-primary transition-all placeholder:font-normal"
                                        placeholder="Match name, event name..."
                                        value={stream.streamTitle}
                                        onChange={(e) => stream.setStreamTitle(e.target.value)}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-muted-foreground uppercase flex items-center gap-1.5 ml-1">
                                        <AlignLeft size={12} /> Description
                                    </label>
                                    <textarea
                                        className="w-full bg-background border-2 border-border rounded-xl px-4 py-3 text-xs font-bold outline-none focus:border-primary transition-all min-h-[120px] resize-none placeholder:font-normal"
                                        placeholder="Broadcast details, team rosters, sponsor info..."
                                        value={stream.streamDesc}
                                        onChange={(e) => stream.setStreamDesc(e.target.value)}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-muted-foreground uppercase flex items-center gap-1.5 ml-1">
                                        <Video size={12} /> Camera Source
                                    </label>
                                    <select
                                        className="w-full bg-background border-2 border-border rounded-xl px-4 py-3 text-xs font-bold outline-none focus:border-primary cursor-pointer transition-all"
                                        onChange={(e) => stream.changeVideoDevice(e.target.value)}
                                        value={stream.selectedVideoDeviceId}
                                    >
                                        {stream.videoDevices.map(d => <option key={d.deviceId} value={d.deviceId}>{d.label || 'Default Camera'}</option>)}
                                    </select>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-muted-foreground uppercase flex items-center gap-1.5 ml-1">
                                        <Mic size={12} /> Mic Source
                                    </label>
                                    <select
                                        className="w-full bg-background border-2 border-border rounded-xl px-4 py-3 text-xs font-bold outline-none focus:border-primary cursor-pointer transition-all"
                                        onChange={(e) => stream.changeAudioDevice(e.target.value)}
                                        value={stream.selectedAudioDeviceId}
                                    >
                                        {stream.audioDevices.map(d => <option key={d.deviceId} value={d.deviceId}>{d.label || 'Default Microphone'}</option>)}
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* TELEMETRY */}
                        <div className="p-5 rounded-2xl bg-primary/[0.03] border-2 border-primary/10 space-y-5">
                            <div className="flex justify-between items-center">
                                <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Network Telemetry</span>
                                <div className="flex items-center gap-1.5">
                                    <div className={`w-2 h-2 rounded-full ${stream.status === 'live' ? 'bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]' : 'bg-muted-foreground opacity-50'}`} />
                                    <span className="text-[10px] font-black text-foreground uppercase">{stream.status === 'live' ? 'Optimal' : 'Offline'}</span>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-1">
                                    <p className="text-[9px] font-black text-muted-foreground uppercase tracking-tighter">Round Trip (RTT)</p>
                                    <p className="text-sm font-mono font-black tracking-tight text-primary">{Math.round(stream.stats?.rtt || 0)}ms</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[9px] font-black text-muted-foreground uppercase tracking-tighter">Active Viewers</p>
                                    <div className="flex items-center gap-1.5">
                                        <TrendingUp size={12} className="text-green-500" />
                                        <p className="text-sm font-mono font-black tracking-tight">{stream.viewerCount}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </main>
        </div>
    );
};

export default StreamerDashboard;