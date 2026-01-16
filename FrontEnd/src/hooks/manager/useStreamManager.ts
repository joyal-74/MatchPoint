import { useState, useEffect, useRef, useCallback } from 'react';
import { Device } from "mediasoup-client";
import type { MediaKind, Producer, RtpCapabilities, RtpParameters, Transport, TransportOptions } from 'mediasoup-client/types';
import { getSocket } from '../../socket/socket';
import { useSocketEmit } from '../../hooks/useSocketEmit';
import { useAppSelector } from '../hooks';

type StreamStatus = 'idle' | 'connecting' | 'live' | 'paused' | 'ending';
interface CreateTransportReq { matchId: string; direction: 'send' | 'recv'; }
interface ProduceReq { matchId: string; transportId: string; kind: MediaKind; rtpParameters: RtpParameters; }
interface ProduceRes { id: string; }

export const useStreamManager = (matchId: string | undefined) => {
    // UI State
    const [streamTitle, setStreamTitle] = useState("");
    const [streamDesc, setStreamDesc] = useState("");

    const userId = useAppSelector((state) => state.auth.user?._id)

    // Logic State
    const [status, setStatus] = useState<StreamStatus>('idle');
    const [viewerCount, setViewerCount] = useState(0);
    const [startTime, setStartTime] = useState<Date | null>(null);
    const [elapsedTime, setElapsedTime] = useState('00:00:00');
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const [localStream, setLocalStream] = useState<MediaStream | null>(null);
    const [isAudioEnabled, setIsAudioEnabled] = useState(true);
    const [isVideoEnabled, setIsVideoEnabled] = useState(true);
    const [isPaused, setIsPaused] = useState(false);
    const [stats, setStats] = useState({ videoBitrate: 0, rtt: 0, score: 0 });

    // Refs
    const localVideoRef = useRef<HTMLVideoElement>(null);
    const deviceRef = useRef<Device | null>(null);
    const sendTransportRef = useRef<Transport | null>(null);
    const recvTransportRef = useRef<Transport | null>(null);
    const videoProducerRef = useRef<Producer | null>(null);
    const audioProducerRef = useRef<Producer | null>(null);
    const lastBytesSentRef = useRef(0);
    const lastTimestampRef = useRef(0);

    const emitAsync = useSocketEmit();

    /* --- Logic Hooks (Socket & Stats) --- */
    useEffect(() => {
        if (!matchId) return;
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
    }, [matchId]);

    useEffect(() => {
        if (status !== 'live' || !startTime || !videoProducerRef.current) return;
        const interval = setInterval(async () => {
            if (!videoProducerRef.current || videoProducerRef.current.closed) return;
            // Timer logic
            const diff = Date.now() - startTime.getTime();
            const h = Math.floor(diff / 3600000);
            const m = Math.floor((diff % 3600000) / 60000);
            const s = Math.floor((diff % 60000) / 1000);
            setElapsedTime(`${h > 0 ? h + ':' : ''}${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`);
            // Stats logic
            try {
                const statsReport = await videoProducerRef.current.getStats();
                let newBitrate = stats.videoBitrate;
                let newRtt = stats.rtt;
                let newScore = stats.score;
                statsReport.forEach((r) => {
                    if (r.type === 'outbound-rtp' && r.bytesSent !== undefined) {
                        const dt = r.timestamp - lastTimestampRef.current;
                        if (dt > 0) {
                            const db = r.bytesSent - lastBytesSentRef.current;
                            newBitrate = Math.round((db * 8 / dt) * 1000);
                        }
                        lastTimestampRef.current = r.timestamp;
                        lastBytesSentRef.current = r.bytesSent;
                    }
                    if (r.type === 'transport' && r.currentRoundTripTime !== undefined) {
                        newRtt = r.currentRoundTripTime * 1000;
                        const rawScore = Math.max(0, 100 - newRtt / 10);
                        newScore = Math.floor(rawScore / 10);
                    }
                });
                setStats({ videoBitrate: newBitrate, rtt: newRtt, score: newScore });
            } catch { /* ignore */ }
        }, 1000);
        return () => clearInterval(interval);
    }, [status, startTime, stats]);

    const cleanupLocal = useCallback(() => {
        try {
            videoProducerRef.current?.close();
            audioProducerRef.current?.close();
            sendTransportRef.current?.close();
            recvTransportRef.current?.close();
        } catch (error) { console.error(error); }

        localStream?.getTracks().forEach(t => t.stop());
        if (localVideoRef.current) localVideoRef.current.srcObject = null;

        videoProducerRef.current = null;
        audioProducerRef.current = null;
        sendTransportRef.current = null;
        recvTransportRef.current = null;
        deviceRef.current = null;
        setLocalStream(null);
        setElapsedTime("00:00:00");
        setIsPaused(false);
        setStats({ videoBitrate: 0, rtt: 0, score: 0 });
    }, [localStream]);

    /* --- Handlers --- */
    const handleStartStream = async () => {
        if (!matchId) return setErrorMsg("Missing matchId");
        if (!streamTitle.trim()) return setErrorMsg("Stream title is required.");
        const socket = getSocket();
        if (!socket) return setErrorMsg("Connection error.");
        
        try {
            setStatus("connecting");
            setErrorMsg(null);

            await emitAsync(socket, "live:start", { 
                matchId, 
                title: streamTitle, 
                description: streamDesc ,
                userId
            });
            
            cleanupLocal();

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
                socket, "live:get-rtp-capabilities", { matchId }
            );
            await device.load({ routerRtpCapabilities: routerCaps });

            // 1. Create SEND Transport
            const transportParams = await emitAsync<TransportOptions, CreateTransportReq>(
                socket, "live:create-transport", { matchId, direction: "send" }
            );
            const sendTransport = device.createSendTransport(transportParams);
            sendTransportRef.current = sendTransport;

            sendTransport.on("connect", async ({ dtlsParameters }, cb, eb) => {
                try {
                    await emitAsync(socket, "transport:connect", { matchId, transportId: sendTransport.id, dtlsParameters });
                    cb();
                } catch (e) { eb(e as Error); }
            });

            sendTransport.on("produce", async ({ kind, rtpParameters }, cb, eb) => {
                try {
                    const { id } = await emitAsync<ProduceRes, ProduceReq>(
                        socket, "live:produce", { matchId, transportId: sendTransport.id, kind, rtpParameters }
                    );
                    cb({ id });
                } catch (e) { eb(e as Error); }
            });

            // 2. ✅ Fix: Create RECV Transport (This makes the 'loopback' valid on server)
            const recvTransportParams = await emitAsync<TransportOptions, CreateTransportReq>(
                socket, "live:create-transport", { matchId, direction: "recv" }
            );
            const recvTransport = device.createRecvTransport(recvTransportParams);
            recvTransportRef.current = recvTransport;

            recvTransport.on("connect", async ({ dtlsParameters }, cb, eb) => {
                try {
                    await emitAsync(socket, "transport:connect", { matchId, transportId: recvTransport.id, dtlsParameters });
                    cb();
                } catch (e) { eb(e as Error); }
            });

            const videoTrack = stream.getVideoTracks()[0];
            const audioTrack = stream.getAudioTracks()[0];
            if (videoTrack) videoProducerRef.current = await sendTransport.produce({ track: videoTrack });
            if (audioTrack) audioProducerRef.current = await sendTransport.produce({ track: audioTrack });

            setStartTime(new Date());
            setStatus("live");
        } catch (e: unknown) {
            setErrorMsg((e as Error).message || "Stream failed to initialize");
            cleanupLocal();
            setStatus("idle");
        }
    };

    const handleEndStream = useCallback(() => {
        setStatus("ending");
        const socket = getSocket();
        // ✅ Fix: Only emit 'stream:end' when user EXPLICITLY clicks End
        if (socket && matchId) socket.emit("stream:end", { matchId });
        
        cleanupLocal();
        setStatus("idle");
    }, [cleanupLocal, matchId]);

    const pauseStream = () => {
        videoProducerRef.current?.pause();
        audioProducerRef.current?.pause();
        getSocket()?.emit("producer:pause", { matchId, producerId: videoProducerRef.current?.id });
        setIsPaused(true);
        setStatus("paused");
    };

    const resumeStream = () => {
        videoProducerRef.current?.resume();
        audioProducerRef.current?.resume();
        getSocket()?.emit("producer:resume", { matchId, producerId: videoProducerRef.current?.id });
        setIsPaused(false);
        setStatus("live");
    };

    const toggleAudio = () => {
        const t = localStream?.getAudioTracks()[0];
        if (t) {
            t.enabled = !t.enabled;
            setIsAudioEnabled(t.enabled);
            if (t.enabled) {
                audioProducerRef.current?.resume()
            } else {
                audioProducerRef.current?.pause();
            }
        }
    };

    const toggleVideo = () => {
        const t = localStream?.getVideoTracks()[0];
        if (t) {
            t.enabled = !t.enabled;
            setIsVideoEnabled(t.enabled);
            if (t.enabled) {
                videoProducerRef.current?.resume()
            } else {
                videoProducerRef.current?.pause();
            }
        }
    };

    return {
        // UI State
        streamTitle,
        setStreamTitle,
        streamDesc,
        setStreamDesc,
        // Logic State
        status,
        viewerCount,
        elapsedTime,
        errorMsg,
        localStream,
        isAudioEnabled,
        isVideoEnabled,
        isPaused,
        stats,
        localVideoRef,
        // Handlers
        handleStartStream,
        handleEndStream,
        pauseStream,
        resumeStream,
        toggleAudio,
        toggleVideo,
    };
};