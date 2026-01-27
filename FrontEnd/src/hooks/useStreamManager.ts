import { useState, useEffect, useRef, useCallback } from "react";
import { Device } from "mediasoup-client";
import { getSocket } from "../socket/socket";

type StreamStatus = "idle" | "connecting" | "live";

export const useStreamManager = (matchId: string, userId: string) => {
    /* ================= STATE ================= */
    const [status, setStatus] = useState<StreamStatus>("idle");
    const [streamTitle, setStreamTitle] = useState("");
    const [streamDesc, setStreamDesc] = useState("");
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    const [localStream, setLocalStream] = useState<MediaStream | null>(null);
    const [isVideoEnabled, setIsVideoEnabled] = useState(true);
    const [isAudioEnabled, setIsAudioEnabled] = useState(true);

    const [videoDevices, setVideoDevices] = useState<MediaDeviceInfo[]>([]);
    const [audioDevices, setAudioDevices] = useState<MediaDeviceInfo[]>([]);
    const [selectedVideoDeviceId, setSelectedVideoDeviceId] = useState("");
    const [selectedAudioDeviceId, setSelectedAudioDeviceId] = useState("");

    const [elapsedTime, setElapsedTime] = useState("00:00:00");
    const [stats, setStats] = useState({ videoBitrate: 0, rtt: 0 });

    // NEW: Added missing state required by Dashboard
    const [viewerCount, setViewerCount] = useState(0);
    const [matchScore, setMatchScore] = useState<any>(null);

    /* ================= REFS ================= */
    const socket = getSocket();
    const localVideoRef = useRef<HTMLVideoElement>(null);
    const deviceRef = useRef<Device | null>(null);
    const transportRef = useRef<any>(null);
    const videoProducerRef = useRef<any>(null);
    const audioProducerRef = useRef<any>(null);
    const streamStartRef = useRef<number | null>(null);

    /* ================= SOCKET LISTENERS ================= */
    useEffect(() => {
        if (!matchId || !socket) return;

        // Listen for viewer count updates
        socket.on("viewer-count-update", ({ count }: { count: number }) => {
            setViewerCount(count);
        });

        socket.on("match:score-update", (data: any) => {
            setMatchScore(data);
        });

        return () => {
            socket.off("viewer-count-update");
            socket.off("match:score-update");
        };
    }, [matchId, socket]);

    /* ================= DEVICE DISCOVERY ================= */
    const fetchDevices = useCallback(async () => {
        try {
            const devices = await navigator.mediaDevices.enumerateDevices();
            const cams = devices.filter(d => d.kind === "videoinput");
            const mics = devices.filter(d => d.kind === "audioinput");
            setVideoDevices(cams);
            setAudioDevices(mics);
            if (!selectedVideoDeviceId && cams[0]) setSelectedVideoDeviceId(cams[0].deviceId);
            if (!selectedAudioDeviceId && mics[0]) setSelectedAudioDeviceId(mics[0].deviceId);
        } catch (e) { console.error(e); }
    }, [selectedVideoDeviceId, selectedAudioDeviceId]);

    useEffect(() => {
        fetchDevices();
        navigator.mediaDevices.addEventListener("devicechange", fetchDevices);
        return () => navigator.mediaDevices.removeEventListener("devicechange", fetchDevices);
    }, [fetchDevices]);

    /* ================= PREVIEW & SYNC ================= */
    const startPreview = async () => {
        if (localStream) localStream.getTracks().forEach(t => t.stop());
        const stream = await navigator.mediaDevices.getUserMedia({
            video: { deviceId: selectedVideoDeviceId ? { exact: selectedVideoDeviceId } : undefined },
            audio: { deviceId: selectedAudioDeviceId ? { exact: selectedAudioDeviceId } : undefined }
        });
        setLocalStream(stream);
        if (localVideoRef.current) localVideoRef.current.srcObject = stream;
    };

    const syncMetadata = useCallback(() => {
        if (status !== "live" || !socket) return;
        socket.emit("live:start", { matchId, title: streamTitle, description: streamDesc, userId });
    }, [status, matchId, streamTitle, streamDesc, userId, socket]);

    /* ================= STREAM ACTIONS ================= */
    const handleStartStream = async () => {
        if (!socket) return setErrorMsg("Socket connection not available");
        if (!localStream) return setErrorMsg("Start preview first");

        try {
            setErrorMsg(null);
            setStatus("connecting");
            console.log("🎬 Starting stream handshake...");

            // 1. Get Router Capabilities
            const rtpCaps = await new Promise<any>((res, rej) => {
                socket.emit("live:get-rtp-capabilities", { matchId }, (data: any) => {
                    if(data?.error) {
                        rej(new Error(data.error))
                    }else {
                        res(data)
                    }
                });
            });

            // 2. Load Device
            const device = new Device();
            await device.load({ routerRtpCapabilities: rtpCaps });
            deviceRef.current = device;
            console.log("✅ Mediasoup Device Loaded");

            // 3. Create Send Transport
            const transportParams = await new Promise<any>((res, rej) => {
                socket.emit("live:create-transport", { matchId, direction: "send" }, (data: any) => {
                    if(data?.error) {
                        rej(new Error(data.error))
                    }else {
                        res(data)
                    }
                });
            });

            const transport = device.createSendTransport(transportParams);
            transportRef.current = transport;

            // 4. Transport Handshake Listeners
            transport.on("connect", ({ dtlsParameters }, cb, err) => {
                console.log("🤝 Connecting transport...");
                socket.emit("transport:connect", {
                    matchId,
                    transportId: transport.id, 
                    dtlsParameters
                }, (response: any) => {
                    if (response?.error) {
                        console.error("❌ Transport Connect Error:", response.error);
                        return err(response.error);
                    }
                    cb();
                });
            });

            transport.on("produce", ({ kind, rtpParameters }, cb, err) => {
                console.log(`📤 Producing ${kind} track...`);
                socket.emit("live:produce", {
                    matchId,
                    transportId: transport.id,
                    kind,
                    rtpParameters
                }, (response: any) => {
                    if (response?.error) {
                        console.error(`❌ Produce ${kind} Error:`, response.error);
                        return err(response.error);
                    }
                    cb({ id: response.id });
                });
            });

            // 5. Produce Tracks
            const videoTrack = localStream.getVideoTracks()[0];
            const audioTrack = localStream.getAudioTracks()[0];

            if (videoTrack) {
                videoProducerRef.current = await transport.produce({
                    track: videoTrack,
                    encodings: [{ maxBitrate: 1500000 }]
                });
                console.log("🎥 Video Producer Created");
            }

            if (audioTrack) {
                audioProducerRef.current = await transport.produce({ track: audioTrack });
                console.log("🎤 Audio Producer Created");
            }

            // 6. Signal Server that Stream is Live (Final Step)
            await new Promise((res, rej) => {
                socket.emit("live:start", { matchId, title: streamTitle, description: streamDesc, userId }, (response: any) => {
                    if(response?.error) {
                        rej(new Error(response.error))
                    }else {
                        res(response)
                    }
                });
            });

            streamStartRef.current = Date.now();
            setStatus("live");
            console.log("🚀 STREAM IS LIVE");

        } catch (err) {
            console.error("🛑 Stream Start Failed:", err);
            setErrorMsg(err.message || "Failed to establish stream connection");
            setStatus("idle");
            // Clean up transport if it failed halfway
            transportRef.current?.close();
        }
    };

    const handleEndStream = useCallback(() => {
        if (!socket) return 'Socket not provided'
        videoProducerRef.current?.close();
        audioProducerRef.current?.close();
        transportRef.current?.close();
        localStream?.getTracks().forEach(t => t.stop());
        setLocalStream(null);
        socket.emit("stream:end", { matchId });
        setStatus("idle");
    }, [localStream, matchId, socket]);

    /* ================= TOGGLES & SWITCHING ================= */
    const toggleVideo = () => {
        const track = localStream?.getVideoTracks()[0];
        if (!track) return;
        track.enabled = !track.enabled;
        setIsVideoEnabled(track.enabled);
        if (track.enabled) {
            videoProducerRef.current?.resume()
        } else {
            videoProducerRef.current?.pause();
        }
    };

    const toggleAudio = () => {
        const track = localStream?.getAudioTracks()[0];
        if (!track) return;
        track.enabled = !track.enabled;
        setIsAudioEnabled(track.enabled);
        if (track.enabled) {
            audioProducerRef.current?.resume()
        } else {
            audioProducerRef.current?.pause();
        }
    };

    const changeVideoDevice = async (deviceId: string) => {
        setSelectedVideoDeviceId(deviceId);
        const stream = await navigator.mediaDevices.getUserMedia({ video: { deviceId: { exact: deviceId } } });
        const newTrack = stream.getVideoTracks()[0];
        if (status === "live" && videoProducerRef.current) {
            await videoProducerRef.current.replaceTrack({ track: newTrack });
        }
        localStream?.getVideoTracks().forEach(t => t.stop());
        setLocalStream(new MediaStream([newTrack, ...(localStream?.getAudioTracks() || [])]));
        if (localVideoRef.current) localVideoRef.current.srcObject = stream;
    };

    /* ================= STATS & UPTIME ================= */
    useEffect(() => {
        if (status !== "live") return;
        const interval = setInterval(async () => {
            const stats = await videoProducerRef.current?.getStats();
            stats?.forEach((r: any) => {
                if (r.type === "outbound-rtp") setStats(s => ({ ...s, videoBitrate: r.bitrate || 0 }));
                if (r.type === "candidate-pair" && r.state === "succeeded") setStats(s => ({ ...s, rtt: r.currentRoundTripTime * 1000 }));
            });
        }, 2000);
        return () => clearInterval(interval);
    }, [status]);

    useEffect(() => {
        if (status !== "live") return;
        const t = setInterval(() => {
            const diff = Date.now() - (streamStartRef.current || 0);
            const h = String(Math.floor(diff / 3600000)).padStart(2, "0");
            const m = String(Math.floor((diff % 3600000) / 60000)).padStart(2, "0");
            const s = String(Math.floor((diff % 60000) / 1000)).padStart(2, "0");
            setElapsedTime(`${h}:${m}:${s}`);
        }, 1000);
        return () => clearInterval(t);
    }, [status]);

    return {
        status, stats, elapsedTime, errorMsg, localStream, localVideoRef,
        streamTitle, setStreamTitle, streamDesc, setStreamDesc,
        isVideoEnabled, isAudioEnabled, videoDevices, audioDevices,
        selectedVideoDeviceId, selectedAudioDeviceId,
        startPreview, handleStartStream, handleEndStream,
        toggleVideo, toggleAudio, changeVideoDevice, syncMetadata,
        viewerCount, matchScore,
        changeAudioDevice: setSelectedAudioDeviceId
    };
};