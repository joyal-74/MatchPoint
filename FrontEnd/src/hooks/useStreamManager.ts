import { useState, useEffect, useRef, useCallback } from "react";
import { Device } from "mediasoup-client";
import { getSocket } from "../socket/socket"; 

type StreamStatus = "idle" | "connecting" | "live" | "paused";
type StreamMode = "webrtc" | "external";

export const useStreamManager = (matchId: string) => {
    // === 1. BROADCAST & METADATA ===
    const [status, setStatus] = useState<StreamStatus>("idle");
    const [streamMode, setStreamMode] = useState<StreamMode>("webrtc");
    const [streamTitle, setStreamTitle] = useState("");
    const [streamDesc, setStreamDesc] = useState(""); // Re-added Description
    const [viewerCount, setViewerCount] = useState(0);
    const [elapsedTime, setElapsedTime] = useState("00:00:00");
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const [stats, setStats] = useState({ videoBitrate: 0, rtt: 0, score: 10 });

    // === 2. MEDIA & HARDWARE ===
    const [localStream, setLocalStream] = useState<MediaStream | null>(null);
    const [isAudioEnabled, setIsAudioEnabled] = useState(true);
    const [isVideoEnabled, setIsVideoEnabled] = useState(true);
    const [videoDevices, setVideoDevices] = useState<MediaDeviceInfo[]>([]);
    const [audioDevices, setAudioDevices] = useState<MediaDeviceInfo[]>([]);
    const [selectedVideoDeviceId, setSelectedVideoDeviceId] = useState("");
    const [selectedAudioDeviceId, setSelectedAudioDeviceId] = useState("");

    // === 3. REFS ===
    const localVideoRef = useRef<HTMLVideoElement>(null);
    const transportRef = useRef<any>(null);
    const producerRef = useRef<any>(null);
    const audioProducerRef = useRef<any>(null);
    const socket = getSocket();
    const lastBytesSentRef = useRef(0);
    const lastTimestampRef = useRef(0);

    // === 4. DEVICE DISCOVERY (Manual Selection) ===
    const fetchDevices = useCallback(async () => {
        try {
            // We request a temporary stream just to trigger the permission prompt
            const tempStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
            const devices = await navigator.mediaDevices.enumerateDevices();
            
            const vInputs = devices.filter(d => d.kind === "videoinput");
            const aInputs = devices.filter(d => d.kind === "audioinput");

            setVideoDevices(vInputs);
            setAudioDevices(aInputs);

            if (vInputs.length) setSelectedVideoDeviceId(vInputs[0].deviceId);
            if (aInputs.length) setSelectedAudioDeviceId(aInputs[0].deviceId);

            // Stop temp tracks immediately
            tempStream.getTracks().forEach(t => t.stop());
        } catch (err) {
            setErrorMsg("Camera/Mic permissions denied.");
        }
    }, []);

    useEffect(() => {
        fetchDevices();
        navigator.mediaDevices.addEventListener("devicechange", fetchDevices);
        return () => navigator.mediaDevices.removeEventListener("devicechange", fetchDevices);
    }, [fetchDevices]);

    // === 5. PREVIEW LOGIC (Not Auto-Live) ===
    const startPreview = async () => {
        if (!selectedVideoDeviceId) return;
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: { deviceId: { exact: selectedVideoDeviceId } },
                audio: { deviceId: { exact: selectedAudioDeviceId } }
            });
            setLocalStream(stream);
            if (localVideoRef.current) localVideoRef.current.srcObject = stream;
        } catch (e) {
            setErrorMsg("Failed to access selected hardware.");
        }
    };

    // === 6. STATS LOOP ===
    useEffect(() => {
        if (status !== 'live' || !producerRef.current) return;
        const interval = setInterval(async () => {
            try {
                const report = await producerRef.current.getStats();
                report.forEach((stat: any) => {
                    if (stat.type === 'outbound-rtp') {
                        const now = stat.timestamp;
                        const dt = (now - lastTimestampRef.current) / 1000;
                        if (dt > 0) {
                            const bitrate = Math.floor(((stat.bytesSent - lastBytesSentRef.current) * 8) / dt);
                            setStats(prev => ({ ...prev, videoBitrate: bitrate }));
                        }
                        lastBytesSentRef.current = stat.bytesSent;
                        lastTimestampRef.current = now;
                    }
                    if (stat.type === 'remote-inbound-rtp') {
                        setStats(prev => ({ ...prev, rtt: stat.roundTripTime * 1000 }));
                    }
                });
            } catch (e) {}
        }, 2000);
        return () => clearInterval(interval);
    }, [status]);

    // === 7. BROADCAST HANDLERS ===
    const handleStartStream = async () => {
        if (streamMode === 'external') {
            setStatus("live");
            socket.emit("stream:start-external", { matchId, title: streamTitle, description: streamDesc });
            return;
        }
        if (!localStream) return await startPreview(); // Start camera if not on

        setStatus("connecting");
        try {
            const rtpCaps = await new Promise<any>(res => socket.emit("stream:get-capabilities", { matchId }, res));
            const device = new Device();
            await device.load({ routerRtpCapabilities: rtpCaps });
            const transportParams = await new Promise<any>(res => socket.emit("stream:create-transport", { matchId }, res));
            const transport = device.createSendTransport(transportParams);
            transportRef.current = transport;

            transport.on("connect", ({ dtlsParameters }, cb) => socket.emit("stream:connect-transport", { matchId, dtlsParameters }, cb));
            transport.on("produce", ({ kind, rtpParameters }, cb) => 
                socket.emit("stream:produce", { matchId, kind, rtpParameters }, ({ id }: any) => cb({ id }))
            );

            producerRef.current = await transport.produce({ track: localStream.getVideoTracks()[0] });
            audioProducerRef.current = await transport.produce({ track: localStream.getAudioTracks()[0] });
            setStatus("live");
        } catch (e: any) { setStatus("idle"); setErrorMsg(e.message); }
    };

    return {
        streamTitle, setStreamTitle, streamDesc, setStreamDesc,
        status, streamMode, setStreamMode, stats,
        elapsedTime, viewerCount, errorMsg,
        localStream, localVideoRef, isAudioEnabled, isVideoEnabled,
        videoDevices, audioDevices, selectedVideoDeviceId, setSelectedVideoDeviceId,
        selectedAudioDeviceId, setSelectedAudioDeviceId,
        handleStartStream, 
        handleEndStream: () => { transportRef.current?.close(); socket.emit("stream:stop", { matchId }); setStatus("idle"); },
        startPreview,
        toggleVideo: () => { const t = localStream?.getVideoTracks()[0]; if (t) { t.enabled = !t.enabled; setIsVideoEnabled(t.enabled); } },
        toggleAudio: () => { const t = localStream?.getAudioTracks()[0]; if (t) { t.enabled = !t.enabled; setIsAudioEnabled(t.enabled); } }
    };
};