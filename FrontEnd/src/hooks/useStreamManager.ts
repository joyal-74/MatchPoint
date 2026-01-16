import { useState, useEffect, useRef, useCallback } from "react";
import { Device } from "mediasoup-client";
import { getSocket } from "../../socket/socket";

type StreamStatus = "idle" | "connecting" | "live" | "paused";

export const useStreamManager = (matchId: string) => {
    // ============================================================
    // 1. STREAM STATE
    // ============================================================
    const [status, setStatus] = useState<StreamStatus>("idle");
    const [streamTitle, setStreamTitle] = useState("");
    const [streamDesc, setStreamDesc] = useState("");
    const [viewerCount] = useState(0);
    const [elapsedTime, setElapsedTime] = useState("00:00:00");
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    // ============================================================
    // 2. MEDIA STATE
    // ============================================================
    const [localStream, setLocalStream] = useState<MediaStream | null>(null);
    const [isAudioEnabled, setIsAudioEnabled] = useState(true);
    const [isVideoEnabled, setIsVideoEnabled] = useState(true);

    // ============================================================
    // 3. DEVICE STATE
    // ============================================================
    const [videoDevices, setVideoDevices] = useState<MediaDeviceInfo[]>([]);
    const [audioDevices, setAudioDevices] = useState<MediaDeviceInfo[]>([]);
    const [selectedVideoDeviceId, setSelectedVideoDeviceId] = useState("");
    const [selectedAudioDeviceId, setSelectedAudioDeviceId] = useState("");
    const [devicesReady, setDevicesReady] = useState(false);

    // ============================================================
    // 4. REFS
    // ============================================================
    const localVideoRef = useRef<HTMLVideoElement>(null);
    const transportRef = useRef<any>(null);
    const producerRef = useRef<any>(null);
    const audioProducerRef = useRef<any>(null);
    const socket = getSocket();
    const timerRef = useRef<NodeJS.Timeout | null>(null);
    const initializedRef = useRef(false);

    // ============================================================
    // A. DEVICE ENUMERATION
    // ============================================================
    const fetchDevices = useCallback(async () => {
        const devices = await navigator.mediaDevices.enumerateDevices();

        const videoInputs = devices.filter(d => d.kind === "videoinput");
        const audioInputs = devices.filter(d => d.kind === "audioinput");

        setVideoDevices(videoInputs);
        setAudioDevices(audioInputs);
        setDevicesReady(true);

        if (!selectedVideoDeviceId && videoInputs.length) {
            setSelectedVideoDeviceId(videoInputs[0].deviceId);
        }

        if (!selectedAudioDeviceId && audioInputs.length) {
            setSelectedAudioDeviceId(audioInputs[0].deviceId);
        }
    }, [selectedVideoDeviceId, selectedAudioDeviceId]);

    // ============================================================
    // B. INITIAL MEDIA INIT (STRICTMODE SAFE)
    // ============================================================
    useEffect(() => {
        if (initializedRef.current) return;
        initializedRef.current = true;

        const init = async () => {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({
                    video: true,
                    audio: true,
                });

                setLocalStream(stream);

                if (localVideoRef.current) {
                    localVideoRef.current.srcObject = stream;
                }

                await fetchDevices();
            } catch {
                setErrorMsg("Camera & microphone permission required.");
            }
        };

        init();

        navigator.mediaDevices.addEventListener("devicechange", fetchDevices);
        return () =>
            navigator.mediaDevices.removeEventListener("devicechange", fetchDevices);
    }, [fetchDevices]);

    // ============================================================
    // C. DEVICE SWITCHING
    // ============================================================
    const changeVideoDevice = async (deviceId: string) => {
        if (!localStream) return;

        const stream = await navigator.mediaDevices.getUserMedia({
            video: { deviceId: { exact: deviceId } },
            audio: false,
        });

        const newTrack = stream.getVideoTracks()[0];
        const oldTrack = localStream.getVideoTracks()[0];

        oldTrack?.stop();
        localStream.removeTrack(oldTrack);
        localStream.addTrack(newTrack);

        if (localVideoRef.current) {
            localVideoRef.current.srcObject = localStream;
        }

        if (status === "live" && producerRef.current) {
            await producerRef.current.replaceTrack({ track: newTrack });
        }

        setSelectedVideoDeviceId(deviceId);
    };

    const changeAudioDevice = async (deviceId: string) => {
        if (!localStream) return;

        const stream = await navigator.mediaDevices.getUserMedia({
            audio: { deviceId: { exact: deviceId } },
            video: false,
        });

        const newTrack = stream.getAudioTracks()[0];
        const oldTrack = localStream.getAudioTracks()[0];

        oldTrack?.stop();
        localStream.removeTrack(oldTrack);
        localStream.addTrack(newTrack);

        if (status === "live" && audioProducerRef.current) {
            await audioProducerRef.current.replaceTrack({ track: newTrack });
        }

        setSelectedAudioDeviceId(deviceId);
    };

    // ============================================================
    // D. STREAM CONTROLS
    // ============================================================
    const handleStartStream = async () => {
        if (!localStream) return;

        setStatus("connecting");

        const rtpCaps = await new Promise<any>(res =>
            socket.emit("stream:get-capabilities", { matchId }, res)
        );

        const device = new Device();
        await device.load({ routerRtpCapabilities: rtpCaps });

        const transportParams = await new Promise<any>(res =>
            socket.emit("stream:create-transport", { matchId }, res)
        );

        const transport = device.createSendTransport(transportParams);
        transportRef.current = transport;

        transport.on("connect", ({ dtlsParameters }, cb) =>
            socket.emit("stream:connect-transport", { matchId, dtlsParameters }, cb)
        );

        transport.on("produce", ({ kind, rtpParameters }, cb) =>
            socket.emit(
                "stream:produce",
                { matchId, kind, rtpParameters },
                ({ id }: any) => cb({ id })
            )
        );

        producerRef.current = await transport.produce({
            track: localStream.getVideoTracks()[0],
        });

        audioProducerRef.current = await transport.produce({
            track: localStream.getAudioTracks()[0],
        });

        setStatus("live");
    };

    const handleEndStream = () => {
        transportRef.current?.close();

        localStream?.getTracks().forEach(t => t.stop());

        socket.emit("stream:stop", { matchId });

        setStatus("idle");
        setElapsedTime("00:00:00");
    };

    // ============================================================
    // E. TOGGLES
    // ============================================================
    const toggleVideo = () => {
        const t = localStream?.getVideoTracks()[0];
        if (!t) return;
        t.enabled = !t.enabled;
        setIsVideoEnabled(t.enabled);
    };

    const toggleAudio = () => {
        const t = localStream?.getAudioTracks()[0];
        if (!t) return;
        t.enabled = !t.enabled;
        setIsAudioEnabled(t.enabled);
    };

    // ============================================================
    // F. API
    // ============================================================
    return {
        streamTitle,
        setStreamTitle,
        streamDesc,
        setStreamDesc,

        status,
        elapsedTime,
        errorMsg,

        localStream,
        localVideoRef,

        isAudioEnabled,
        isVideoEnabled,

        videoDevices,
        audioDevices,
        selectedVideoDeviceId,
        selectedAudioDeviceId,
        devicesReady,

        handleStartStream,
        handleEndStream,
        changeVideoDevice,
        changeAudioDevice,
        toggleVideo,
        toggleAudio,
    };
};
