import { useState } from 'react';
import {
    Play, StopCircle,
    Layers, Check, Info, Activity, Eye, Mic, MicOff, Video, VideoOff,
    Settings2, Radio, Clock, Zap, Pause, RotateCcw
} from 'lucide-react';
import { useStreamManager } from '../../../hooks/useStreamManager';
import { useParams } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { EliteBroadcastOverlay } from './overlay/EliteBroadcastOverlay';
import { CyberDashboardOverlay } from './overlay/CyberDashboardOverlay';

const StreamerDashboard = () => {
    const { matchId } = useParams();
    const stream = useStreamManager(matchId || "");
    const [selectedOverlay, setSelectedOverlay] = useState('cricket_pro');

    const overlays = [
        { id: 'cricket_pro', name: 'Cricket Pro Bar', preview: 'Classic bottom-third scoreboard' },
        { id: 'minimal_top', name: 'Minimal Dark', preview: 'Top-left sleek score indicator' },
        { id: 'full_stats', name: 'Full Stats Card', preview: 'Side-panel detailed statistics' },
    ];

    return (
        <div className="min-h-screen bg-background text-foreground font-sans">
            {/* Header */}
            <header className="h-14 border-b border-border bg-card/50 backdrop-blur-xl flex items-center justify-between px-6 sticky top-0 z-50">
                <div className="flex items-center gap-4">
                    <div className="bg-primary p-2 rounded-xl shadow-lg shadow-primary/20">
                        <Radio size={18} className="text-primary-foreground" />
                    </div>
                    <div className="flex flex-col">
                        <h1 className="font-black text-xs tracking-tighter uppercase leading-none italic">Live Studio</h1>
                        <span className="text-[9px] text-muted-foreground font-mono uppercase tracking-widest">{stream.status} Mode</span>
                    </div>
                </div>

                <div className="flex bg-muted rounded-full p-1 border border-border">
                    <button onClick={() => stream.setStreamMode('webrtc')} className={`px-5 py-1.5 text-[10px] font-black rounded-full transition-all ${stream.streamMode === 'webrtc' ? 'bg-primary text-primary-foreground shadow-lg' : 'text-muted-foreground'}`}>WEBRTC</button>
                    <button onClick={() => stream.setStreamMode('external')} className={`px-5 py-1.5 text-[10px] font-black rounded-full transition-all ${stream.streamMode === 'external' ? 'bg-primary text-primary-foreground shadow-lg' : 'text-muted-foreground'}`}>EXTERNAL</button>
                </div>
            </header>

            <main className="p-6 grid grid-cols-12 gap-6 h-[calc(100vh-3.5rem)] overflow-hidden">
                {/* LEFT: Production Stage */}
                <div className="col-span-12 lg:col-span-9 flex flex-col gap-6">

                    {/* THE STAGE: This is the container where the video AND overlays live */}
                    <div className="relative flex-1 bg-black rounded-[2.5rem] shadow-2xl border border-white/5 overflow-hidden group">

                        {/* HUD Metrics */}
                        <div className="absolute top-8 left-8 z-20 flex gap-3">
                            <div className={`${stream.status === 'live' ? 'bg-destructive' : 'bg-muted'} px-4 py-2 rounded-xl text-[10px] font-black uppercase flex items-center gap-2 border border-white/10 shadow-2xl`}>
                                {stream.status === 'live' && <Zap size={12} className="fill-current animate-pulse text-white" />}
                                {stream.status}
                            </div>
                            {stream.status === 'live' && (
                                <div className="bg-black/60 backdrop-blur-md text-white px-4 py-2 rounded-xl text-[10px] font-bold border border-white/10 flex items-center gap-2">
                                    <Activity size={12} className="text-primary" />
                                    {((stream.stats?.videoBitrate || 0) / 1000).toFixed(0)} KB/S
                                </div>
                            )}
                        </div>

                        {/* Video Element */}
                        <video ref={stream.localVideoRef} autoPlay muted playsInline className={`absolute inset-0 w-full h-full object-cover transition-all duration-1000 ${stream.localStream ? 'opacity-100 scale-100' : 'opacity-20 scale-110'}`} />

                        {/* === DYNAMIC OVERLAY LAYER (MOVED HERE) === */}
                        <div className="absolute inset-0 z-30 pointer-events-none flex flex-col justify-end items-start">
                            <AnimatePresence mode="wait">
                                {selectedOverlay === 'cricket_pro' && (
                                    <EliteBroadcastOverlay key="pro" data={stream.matchScore} />
                                )}

                                {selectedOverlay === 'minimal_top' && (
                                    <CyberDashboardOverlay data={stream.matchScore} />
                                )}

                            </AnimatePresence>
                        </div>

                        {/* Media Controls HUD */}
                        <div className="absolute bottom-8 left-8 z-20 flex gap-3">
                            <button onClick={stream.toggleVideo} className={`p-4 rounded-2xl backdrop-blur-xl border border-white/10 transition-all hover:scale-105 active:scale-95 ${stream.isVideoEnabled ? 'bg-black/40' : 'bg-destructive text-white shadow-lg shadow-destructive/40'}`}>
                                {stream.isVideoEnabled ? <Video size={20} /> : <VideoOff size={20} />}
                            </button>
                            <button onClick={stream.toggleAudio} className={`p-4 rounded-2xl backdrop-blur-xl border border-white/10 transition-all hover:scale-105 active:scale-95 ${stream.isAudioEnabled ? 'bg-black/40' : 'bg-destructive text-white shadow-lg shadow-destructive/40'}`}>
                                {stream.isAudioEnabled ? <Mic size={20} /> : <MicOff size={20} />}
                            </button>
                        </div>
                    </div>

                    {/* EXTENDED CONTROL DOCK */}
                    <div className="bg-card border border-border p-6 rounded-[2.5rem] flex items-center justify-between shadow-2xl">
                        <div className="flex items-center gap-8 px-4">
                            <div className="flex flex-col">
                                <label className="text-[10px] uppercase font-black text-muted-foreground tracking-widest mb-1 italic">Ping</label>
                                <span className="text-sm font-mono font-bold flex items-center gap-2 text-primary">{Math.round(stream.stats?.rtt || 0)}ms</span>
                            </div>
                            <div className="h-10 w-px bg-border/50" />
                            <div className="flex flex-col">
                                <label className="text-[10px] uppercase font-black text-muted-foreground tracking-widest mb-1 italic">Audience</label>
                                <div className="flex items-center gap-2 text-sm font-bold"><Eye size={16} className="text-sky-400" /> {stream.viewerCount}</div>
                            </div>
                            <div className="h-10 w-px bg-border/50" />
                            <div className="flex flex-col">
                                <label className="text-[10px] uppercase font-black text-muted-foreground tracking-widest mb-1 italic">Uptime</label>
                                <span className="text-sm font-mono font-bold flex items-center gap-2 text-primary tracking-tighter"><Clock size={16} /> {stream.elapsedTime}</span>
                            </div>
                        </div>

                        <div className="flex gap-4">
                            {stream.status === 'live' && (
                                <button
                                    onClick={stream.isPaused ? stream.resumeStream : stream.pauseStream}
                                    className="px-6 py-4 rounded-2xl bg-muted hover:bg-accent text-foreground font-black text-[10px] tracking-widest transition-all flex items-center gap-3 border border-border"
                                >
                                    {stream.isPaused ? <><Play size={16} className="fill-current" /> RESUME</> : <><Pause size={16} className="fill-current" /> PAUSE</>}
                                </button>
                            )}

                            {stream.status === 'idle' && stream.streamMode === 'webrtc' && (
                                <button onClick={stream.startPreview} className="px-8 py-4 rounded-2xl font-black text-[10px] tracking-widest bg-secondary text-secondary-foreground hover:opacity-90 transition-all flex items-center gap-3">
                                    <RotateCcw size={16} /> PREVIEW HARDWARE
                                </button>
                            )}

                            <button
                                onClick={stream.status === 'live' ? stream.handleEndStream : stream.handleStartStream}
                                className={`px-12 py-4 rounded-2xl font-black text-[10px] tracking-[0.2em] transition-all shadow-xl active:scale-95 flex items-center gap-3 ${stream.status === 'live' ? 'bg-destructive text-white' : 'bg-primary text-primary-foreground ring-4 ring-primary/10'
                                    }`}
                            >
                                {stream.status === 'live' ? <><StopCircle size={18} /> END SESSION</> : <><Play size={18} /> GO LIVE NOW</>}
                            </button>
                        </div>
                    </div>
                </div>

                {/* RIGHT: Production Sidebar */}
                <div className="col-span-12 lg:col-span-3 flex flex-col gap-6 overflow-y-auto pr-1 custom-scrollbar">

                    {/* OVERLAY GALLERY (Controls what is shown on the video) */}
                    <section className="bg-card border border-border rounded-3xl p-6 space-y-4 shadow-sm">
                        <h3 className="text-[10px] font-black uppercase tracking-widest text-primary flex items-center gap-2"><Layers size={14} /> Overlay Gallery</h3>
                        <div className="grid gap-3">
                            {overlays.map(o => (
                                <button
                                    key={o.id}
                                    onClick={() => setSelectedOverlay(o.id)}
                                    className={`text-left p-4 rounded-2xl border transition-all ${selectedOverlay === o.id ? 'bg-primary/10 border-primary ring-1 ring-primary' : 'bg-background hover:bg-muted border-border'
                                        }`}
                                >
                                    <div className="flex justify-between items-center mb-1">
                                        <span className={`text-[11px] font-black uppercase ${selectedOverlay === o.id ? 'text-primary' : ''}`}>{o.name}</span>
                                        {selectedOverlay === o.id && <Check size={14} className="text-primary" />}
                                    </div>
                                    <p className="text-[10px] text-muted-foreground leading-tight italic">{o.preview}</p>
                                </button>
                            ))}
                        </div>
                    </section>

                    {/* SOURCE SELECT */}
                    {stream.streamMode === 'webrtc' && (
                        <section className="bg-card border border-border rounded-3xl p-6 space-y-4">
                            <h3 className="text-[10px] font-black uppercase tracking-widest text-primary flex items-center gap-2"><Settings2 size={14} /> Source Select</h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="text-[9px] font-black text-muted-foreground uppercase mb-1 block">Video Input</label>
                                    <select value={stream.selectedVideoDeviceId} onChange={(e) => stream.changeVideoDevice(e.target.value)} className="w-full bg-background border border-input rounded-xl px-4 py-3 text-xs font-bold focus:ring-1 focus:ring-primary outline-none appearance-none">
                                        {stream.videoDevices.map(d => <option key={d.deviceId} value={d.deviceId}>{d.label || 'Camera'}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="text-[9px] font-black text-muted-foreground uppercase mb-1 block">Audio Ingest</label>
                                    <select value={stream.selectedAudioDeviceId} onChange={(e) => stream.changeAudioDevice(e.target.value)} className="w-full bg-background border border-input rounded-xl px-4 py-3 text-xs font-bold focus:ring-1 focus:ring-primary outline-none appearance-none">
                                        {stream.audioDevices.map(d => <option key={d.deviceId} value={d.deviceId}>{d.label || 'Microphone'}</option>)}
                                    </select>
                                </div>
                            </div>
                        </section>
                    )}

                    {/* METADATA */}
                    <section className="bg-card border border-border rounded-3xl p-6 space-y-5">
                        <h3 className="text-[10px] font-black uppercase tracking-widest text-primary flex items-center gap-2"><Info size={14} /> Broadcast Meta</h3>
                        <div className="space-y-4">
                            <div className="space-y-1">
                                <label className="text-[9px] font-black text-muted-foreground uppercase px-1">Stream Title</label>
                                <input value={stream.streamTitle} onChange={(e) => stream.setStreamTitle(e.target.value)} className="w-full bg-background border border-input rounded-xl px-4 py-3 text-xs font-bold outline-none focus:border-primary transition-colors" placeholder="Broadcast Title..." />
                            </div>
                            <div className="space-y-1">
                                <label className="text-[9px] font-black text-muted-foreground uppercase px-1">Description</label>
                                <textarea value={stream.streamDesc} onChange={(e) => stream.setStreamDesc(e.target.value)} className="w-full bg-background border border-input rounded-xl px-4 py-3 text-xs outline-none focus:border-primary h-24 resize-none transition-colors" placeholder="Live coverage description..." />
                            </div>
                        </div>
                    </section>
                </div>
            </main>
        </div>
    );
};

export default StreamerDashboard;