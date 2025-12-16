import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
    Play, Square, Wifi, Video, Mic, AlertCircle, Pause
} from 'lucide-react';
import { Device } from "mediasoup-client";
import type { DtlsParameters, MediaKind, Producer, RtpCapabilities, RtpParameters, Transport, TransportOptions } from 'mediasoup-client/types';
import { useParams } from 'react-router-dom';
import { getSocket } from '../../socket/socket';
import { useSocketEmit } from '../../hooks/useSocketEmit';


type StreamStatus = 'idle' | 'connecting' | 'live' | 'paused' | 'ending';

// 3. Define specific Request/Response types for your events
interface CreateTransportReq {
    matchId: string;
    direction: 'send' | 'recv';
}

interface ConnectTransportReq {
    matchId: string;
    transportId: string;
    dtlsParameters: DtlsParameters;
}

interface ProduceReq {
    matchId: string;
    transportId: string;
    kind: MediaKind;
    rtpParameters: RtpParameters;
}

interface ProduceRes {
    id: string;
}

const StreamManager: React.FC = () => {
    const { matchId } = useParams();

    const [status, setStatus] = useState<StreamStatus>('idle');
    const [viewerCount, setViewerCount] = useState(0);
    const [startTime, setStartTime] = useState<Date | null>(null);
    const [elapsedTime, setElapsedTime] = useState('00:00');
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const [localStream, setLocalStream] = useState<MediaStream | null>(null);
    const [isAudioEnabled, setIsAudioEnabled] = useState(true);
    const [isVideoEnabled, setIsVideoEnabled] = useState(true);
    const [isPaused, setIsPaused] = useState(false);

    const localVideoRef = useRef<HTMLVideoElement>(null);
    const deviceRef = useRef<Device | null>(null);
    const sendTransportRef = useRef<Transport | null>(null);
    const videoProducerRef = useRef<Producer | null>(null);
    const audioProducerRef = useRef<Producer | null>(null);

    const statsRef = useRef({
        videoBitrate: 0,
        rtt: 0,
        score: 100
    });

    const emitAsync = useSocketEmit();

    const lastBytesSentRef = useRef(0);
    const lastTimestampRef = useRef(0);

    useEffect(() => {
        const socket = getSocket();
        if (!socket) return;

        const join = () => setViewerCount(v => v + 1);
        const leave = () => setViewerCount(v => Math.max(0, v - 1));

        socket.on("consumer-joined", join);
        socket.on("consumer-left", leave);

        return () => {
            socket.off("consumer-joined", join);
            socket.off("consumer-left", leave);
        };
    }, []);

    useEffect(() => {
        if (status !== 'live' || !startTime || !videoProducerRef.current) return;

        const interval = setInterval(async () => {
            if (!videoProducerRef.current || videoProducerRef.current.closed) return;

            const diff = Date.now() - startTime.getTime();
            const m = Math.floor(diff / 60000);
            const s = Math.floor((diff % 60000) / 1000);
            setElapsedTime(`${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`);

            try {
                const stats = await videoProducerRef.current.getStats();
                stats.forEach((r) => {
                    if (r.type === 'outbound-rtp' && r.bytesSent) {
                        const dt = r.timestamp - lastTimestampRef.current;
                        if (dt > 0) {
                            const db = r.bytesSent - lastBytesSentRef.current;
                            statsRef.current.videoBitrate = Math.round((db * 8 / dt) * 1000);
                        }
                        lastTimestampRef.current = r.timestamp;
                        lastBytesSentRef.current = r.bytesSent;
                    }
                    if (r.type === 'transport' && r.currentRoundTripTime) {
                        statsRef.current.rtt = r.currentRoundTripTime * 1000;
                        statsRef.current.score = Math.max(0, 100 - statsRef.current.rtt / 10);
                    }
                });
            } catch {
                /* ignore transient stats errors */
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [status, startTime]);

    const handleStartStream = async () => {
        if (!matchId) return setErrorMsg("Missing matchId");
        const socket = getSocket();
        if (!socket) return setErrorMsg("Socket unavailable");

        try {
            setStatus("connecting");
            setErrorMsg(null);

            handleEndStream();

            const stream = await navigator.mediaDevices.getUserMedia({
                video: { width: 1280, height: 720, frameRate: 30 },
                audio: true
            });

            setLocalStream(stream);
            if (localVideoRef.current) {
                localVideoRef.current.srcObject = stream;
                localVideoRef.current.muted = true;
                await localVideoRef.current.play();
            }

            const device = new Device();
            deviceRef.current = device;

            const routerCaps = await emitAsync<RtpCapabilities, { matchId: string }>(
                socket,
                "live:get-rtp-capabilities",
                { matchId }
            );
            await device.load({ routerRtpCapabilities: routerCaps });

            const transportParams = await emitAsync<TransportOptions, CreateTransportReq>(
                socket,
                "live:create-transport",
                { matchId, direction: "send" }
            );

            const recvTransportParams = await emitAsync<TransportOptions, CreateTransportReq>(
                socket,
                "live:create-transport",
                { matchId, direction: "recv" }
            );

            const recvTransport = device.createRecvTransport(recvTransportParams);

            recvTransport.on("connect", async ({ dtlsParameters }, cb, eb) => {
                try {
                    await emitAsync<void, ConnectTransportReq>(
                        socket,
                        "transport:connect",
                        {
                            matchId,
                            transportId: sendTransport.id,
                            dtlsParameters
                        }
                    );
                    cb();
                } catch (e) {
                    eb(e as Error);
                }
            });


            const sendTransport = device.createSendTransport(transportParams);
            sendTransportRef.current = sendTransport;

            sendTransport.on("connect", async ({ dtlsParameters }, cb, eb) => {
                try {
                    await emitAsync<void, ConnectTransportReq>(
                        socket,
                        "transport:connect",
                        {
                            matchId,
                            transportId: recvTransport.id,
                            dtlsParameters
                        }
                    );
                    cb();
                } catch (e) {
                    eb(e as Error);
                }
            });

            sendTransport.on("produce", async ({ kind, rtpParameters }, cb, eb) => {
                try {
                    const { id } = await emitAsync<ProduceRes, ProduceReq>(
                        socket,
                        "live:produce",
                        {
                            matchId,
                            transportId: sendTransport.id,
                            kind,
                            rtpParameters
                        }
                    );
                    cb({ id });
                } catch (e) {
                    eb(e as Error);
                }
            });

            const videoTrack = stream.getVideoTracks()[0];
            const audioTrack = stream.getAudioTracks()[0];

            if (videoTrack) {
                videoProducerRef.current = await sendTransport.produce({ track: videoTrack });
            }
            if (audioTrack) {
                audioProducerRef.current = await sendTransport.produce({ track: audioTrack });
            }

            setStartTime(new Date());
            setStatus("live");

        } catch (e: unknown) {
            setErrorMsg((e as Error).message || "Failed to start");
            handleEndStream();
        }
    };

    const handleEndStream = useCallback(() => {
        setStatus("ending");

        const socket = getSocket();
        if (socket && matchId) {
            socket.emit("stream:end", { matchId });
        }

        try {
            videoProducerRef.current?.close();
            audioProducerRef.current?.close();
            sendTransportRef.current?.close();
        } catch (error) {
            console.error("Error closing mediasoup entities:", error);
        }

        localStream?.getTracks().forEach(t => t.stop());

        if (localVideoRef.current) localVideoRef.current.srcObject = null;

        videoProducerRef.current = null;
        audioProducerRef.current = null;
        sendTransportRef.current = null;
        deviceRef.current = null;

        setLocalStream(null);
        setElapsedTime("00:00");
        setIsPaused(false);
        setStatus("idle");

        statsRef.current = { videoBitrate: 0, rtt: 0, score: 100 };
    }, [localStream, matchId]);

    /* ================= PAUSE / RESUME ================= */
    const pauseStream = () => {
        videoProducerRef.current?.pause();
        audioProducerRef.current?.pause();

        const socket = getSocket();
        socket?.emit("producer:pause", {
            matchId,
            producerId: videoProducerRef.current?.id
        });

        setIsPaused(true);
        setStatus("paused");
    };


    const resumeStream = () => {
        videoProducerRef.current?.resume();
        audioProducerRef.current?.resume();

        const socket = getSocket();
        socket?.emit("producer:resume", {
            matchId,
            producerId: videoProducerRef.current?.id
        });
        setIsPaused(false);
        setStatus("live");
    };

    /* ================= TOGGLES ================= */
    const toggleAudio = () => {
        const t = localStream?.getAudioTracks()[0];
        if (!t) return;
        t.enabled = !t.enabled;
        setIsAudioEnabled(t.enabled);
        if (t.enabled) {
            audioProducerRef.current?.resume()
        } else {
            audioProducerRef.current?.pause();
        }
    };

    const toggleVideo = () => {
        const t = localStream?.getVideoTracks()[0];
        if (!t) return;
        t.enabled = !t.enabled;
        setIsVideoEnabled(t.enabled);
        if (t.enabled) {
            videoProducerRef.current?.resume()
        } else {
            videoProducerRef.current?.pause();
        }
    };


    const getQualityIndicator = (score: number) => {
        if (score >= 80) return 'bg-emerald-500';
        if (score >= 60) return 'bg-amber-500';
        return 'bg-red-500';
    };

    return (
        <div className="h-screen bg-neutral-900 text-white flex flex-col overflow-hidden">
            {/* Minimal Header */}
            <header className="flex items-center justify-between px-6 py-3 border-b border-neutral-800">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-neutral-800/50 rounded-full">
                        <Video size={18} className="text-blue-400" />
                    </div>
                    <div className="min-w-0">
                        <h1 className="text-sm font-semibold truncate">Live Stream</h1>
                        <p className="text-xs text-neutral-500 truncate">ID: {matchId}</p>
                    </div>
                </div>
                <div className={`px-3 py-1 rounded-full text-xs font-medium border ${status === 'live' ? 'bg-red-500/20 text-red-300 border-red-500/50' :
                    status === 'connecting' ? 'bg-yellow-500/20 text-yellow-300 border-yellow-500/50' :
                        'bg-neutral-800 text-neutral-400 border-neutral-700'
                    }`}>
                    {status.toUpperCase()}
                </div>
            </header>

            {/* Error Toast */}
            {errorMsg && (
                <div className="absolute top-4 right-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg flex items-center gap-2 text-red-200 text-sm z-50 max-w-sm">
                    <AlertCircle size={16} />
                    <span className="truncate">{errorMsg}</span>
                    <button onClick={() => setErrorMsg(null)} className="ml-auto">
                        <Square size={16} className="text-red-300" />
                    </button>
                </div>
            )}

            {/* Main Video Area */}
            <main className="flex-1 relative flex items-center justify-center p-4">
                <div className="relative w-full max-w-4xl aspect-video bg-neutral-800 rounded-xl overflow-hidden shadow-2xl">
                    <video
                        ref={localVideoRef}
                        autoPlay
                        muted
                        playsInline
                        className="absolute inset-0 w-full h-full object-cover"
                    />
                    {status === 'idle' && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center bg-neutral-800/50">
                            <Video size={48} className="text-neutral-500 mb-2" />
                            <p className="text-neutral-400 text-sm">Ready to go live</p>
                        </div>
                    )}
                    {status === 'live' && (
                        <div className="absolute inset-0 pointer-events-none">
                            <div className="absolute top-4 left-4 flex flex-col gap-2">
                                <div className="flex items-center gap-2 bg-black/50 backdrop-blur-sm px-3 py-1.5 rounded-full text-xs">
                                    <Wifi size={12} className="text-green-400" />
                                    <span>{Math.round(statsRef.current.rtt)} ms</span>
                                </div>
                                <div className="bg-black/50 backdrop-blur-sm px-3 py-1.5 rounded-full text-xs">
                                    {viewerCount} viewers
                                </div>
                            </div>
                            <div className="absolute bottom-4 right-4 bg-gradient-to-r from-red-500 to-pink-600 px-4 py-2 rounded-full text-xs font-bold shadow-lg">
                                LIVE
                            </div>
                            <div className="absolute bottom-4 left-4 flex items-center gap-2 bg-black/50 backdrop-blur-sm px-3 py-1.5 rounded-full text-xs">
                                <div className={`w-2 h-2 rounded-full ${getQualityIndicator(statsRef.current.score)}`}></div>
                                <span>{statsRef.current.score}%</span>
                            </div>
                        </div>
                    )}
                </div>
            </main>

            {/* Bottom Controls - Unified responsive */}
            <footer className="border-t border-neutral-800 p-4 bg-neutral-900/50">
                <div className="max-w-md mx-auto">
                    <div className="flex justify-center items-center gap-4 mb-4">
                        <button
                            onClick={toggleVideo}
                            disabled={!localStream || status === 'idle'}
                            className={`p-3 rounded-full transition-all ${!localStream || status === 'idle' ? 'opacity-50 cursor-not-allowed' :
                                isVideoEnabled ? 'bg-blue-500/20 text-blue-300 hover:bg-blue-500/30' : 'bg-red-500/20 text-red-300 hover:bg-red-500/30'
                                }`}
                            title={isVideoEnabled ? 'Disable Video' : 'Enable Video'}
                        >
                            <Video size={20} />
                        </button>
                        <button
                            onClick={toggleAudio}
                            disabled={!localStream || status === 'idle'}
                            className={`p-3 rounded-full transition-all ${!localStream || status === 'idle' ? 'opacity-50 cursor-not-allowed' :
                                isAudioEnabled ? 'bg-green-500/20 text-green-300 hover:bg-green-500/30' : 'bg-red-500/20 text-red-300 hover:bg-red-500/30'
                                }`}
                            title={isAudioEnabled ? 'Mute Audio' : 'Unmute Audio'}
                        >
                            <Mic size={20} />
                        </button>
                        <div className="flex-1 max-w-32">
                            {status === 'idle' || status === 'connecting' ? (
                                <button
                                    onClick={handleStartStream}
                                    disabled={status === 'connecting'}
                                    className={`w-full py-3 rounded-full font-medium text-sm transition-all ${status === 'connecting' ? 'bg-neutral-700 text-neutral-500 cursor-not-allowed' : 'bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 shadow-lg'
                                        }`}
                                >
                                    {status === 'connecting' ? (
                                        <>
                                            <div className="inline-block w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                                            Connecting...
                                        </>
                                    ) : (
                                        <span className="flex items-center justify-center gap-2">
                                            <Play size={18} />
                                            Go Live
                                        </span>
                                    )}
                                </button>
                            ) : (
                                <div className="flex gap-2">
                                    <button
                                        onClick={isPaused ? resumeStream : pauseStream}
                                        className={`flex-1 py-3 rounded-full font-medium text-sm transition-all ${isPaused ? 'bg-gradient-to-r from-green-600 to-green-700 text-white hover:from-green-700 hover:to-green-800 shadow-lg' :
                                            'bg-gradient-to-r from-yellow-600 to-yellow-700 text-white hover:from-yellow-700 hover:to-yellow-800 shadow-lg'
                                            }`}
                                    >
                                        {isPaused ? (
                                            <>
                                                <Play size={18} className="inline-block mr-1" />
                                            </>
                                        ) : (
                                            <>
                                                <Pause size={18} className="inline-block mr-1" />
                                            </>
                                        )}
                                    </button>
                                    <button
                                        onClick={handleEndStream}
                                        className="px-4 py-3 rounded-full bg-gradient-to-r from-red-600 to-red-700 text-white hover:from-red-700 hover:to-red-800 shadow-lg font-medium"
                                    >
                                        <Square size={18} />
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                    {status !== 'idle' && (
                        <div className="flex justify-between items-center text-xs text-neutral-500 text-center">
                            <span>{elapsedTime}</span>
                            <span className="mx-4 flex-1">•</span>
                            <span>{viewerCount} watching</span>
                            <span className="mx-4 flex-1">•</span>
                            <span className="font-mono">
                                {(statsRef.current.videoBitrate / 1000000).toFixed(1)} Mbps
                            </span>
                        </div>
                    )}
                </div>
            </footer>
        </div>
    );
};

export default StreamManager;