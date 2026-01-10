import { useEffect, useRef, useState, useCallback } from "react";
import * as mediasoupClient from "mediasoup-client";
import { viewerWebSocketService } from "../../socket/viewerWebSocketService"; // Use the singleton
import type { Consumer, DtlsParameters, RtpCapabilities, Transport, TransportOptions } from "mediasoup-client/types";

export type StreamState = "connecting" | "waiting" | "live" | "paused" | "ended" | "error";
type Quality = "auto" | "low" | "medium" | "high";

const QUALITY_TO_LAYER: Record<Quality, number | null> = {
    auto: null,
    low: 0,
    medium: 1,
    high: 2,
};

// --- Interfaces ---
interface CreateTransportRes extends TransportOptions { id: string; }
interface ConnectTransportReq { matchId: string; transportId: string; dtlsParameters: DtlsParameters; }
interface ConsumeReq { matchId: string; transportId: string; producerId: string; rtpCapabilities: RtpCapabilities; }
interface SetQualityReq { matchId: string; consumerId: string; spatialLayer: number; temporalLayer: number; }
interface StreamMetadata { title: string; description: string; streamerName: string; viewers: number; }

export function useMediasoupViewer(matchId: string | undefined) {
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const deviceRef = useRef<mediasoupClient.Device | null>(null);
    const recvTransportRef = useRef<Transport | null>(null);
    const consumersRef = useRef<Map<string, Consumer>>(new Map());
    const mediaStreamRef = useRef<MediaStream>(new MediaStream());
    
    // Get the RAW socket instance from the singleton to handle callbacks
    const socket = viewerWebSocketService.getSocketInstance();

    const pendingProducersRef = useRef<string[]>([]);
    const initializedRef = useRef(false);
    const deviceReadyRef = useRef(false);
    const consumingRef = useRef<Set<string>>(new Set());

    const [state, setState] = useState<StreamState>("connecting");
    const [error, setError] = useState<string | null>(null);
    const [quality, setQuality] = useState<Quality>("auto");
    const [muted, setMuted] = useState(true);
    const [metadata, setMetadata] = useState<StreamMetadata>({
        title: "Loading...", description: "", streamerName: "", viewers: 0
    });

    // --- Socket Helper Wrapper ---
    const emitAsync = useCallback(<TRes, TReq = unknown>(event: string, data?: TReq): Promise<TRes> => {
        return new Promise((resolve, reject) => {
            if (!socket || !socket.connected) return reject(new Error("Socket disconnected"));
            socket.emit(event, data, (res: TRes & { error?: string }) => {
                if (res?.error) reject(new Error(res.error));
                else resolve(res);
            });
        });
    }, [socket]);

    // --- Initialization ---
    useEffect(() => {
        if (!matchId || !socket) return;

        console.log("🟢 [VIEWER] Hook mounted");

        const handleConnect = () => { if (!initializedRef.current) initViewer(); };
        const handleMetadata = (data: Partial<StreamMetadata>) => setMetadata(prev => ({ ...prev, ...data }));
        
        const handleNewProducer = ({ producerId }: { producerId: string }) => {
            if (!initializedRef.current || state === "ended") {
                console.log("🔄 Stream started/restarted");
                initViewer();
            } else {
                consume(producerId);
            }
        };

        const handleStreamEnded = () => {
            console.log("🏁 Stream ended");
            softCleanup();
            setState("ended");
        };

        // Handlers for producer state
        const onProducerLeft = ({ producerId }: { producerId: string }) => {
            const consumer = consumersRef.current.get(producerId);
            if (consumer) {
                consumer.close();
                consumersRef.current.delete(producerId);
                mediaStreamRef.current.removeTrack(consumer.track);
                checkActiveTracks();
            }
        };

        // Attach listeners
        socket.on("connect", handleConnect);
        socket.on("stream-metadata-updated", handleMetadata);
        socket.on("new-producer", handleNewProducer);
        socket.on("stream-ended", handleStreamEnded);
        socket.on("producer-left", onProducerLeft);

        // If already connected, init immediately
        if (socket.connected && !initializedRef.current) {
            initViewer();
        }

        return () => {
            console.log("🔴 [VIEWER] Unmounting - Cleaning up media only");
            // Remove listeners
            socket.off("connect", handleConnect);
            socket.off("stream-metadata-updated", handleMetadata);
            socket.off("new-producer", handleNewProducer);
            socket.off("stream-ended", handleStreamEnded);
            socket.off("producer-left", onProducerLeft);
            
            // Close transports but DO NOT disconnect socket
            softCleanup();
        };
    }, [matchId, socket]); // eslint-disable-line react-hooks/exhaustive-deps

    const initViewer = async () => {
        if (initializedRef.current && state !== "ended" && state !== "error") return;
        initializedRef.current = true;

        try {
            setState("connecting");

            // Get Metadata & Join Room (Already joined by hook, but ensuring specifically for stream)
            const metaPromise = emitAsync<StreamMetadata>("live:get-metadata", { matchId });
            
            // IMPORTANT: We use the existing socket, so we don't need to re-join if the other hook did it,
            // but calling it ensures the backend LiveStreamHandler sends us the specific streamState
            socket?.emit("viewer:join", { matchId });

            metaPromise.then(data => setMetadata(prev => ({ ...prev, ...data })))
                       .catch(() => console.warn("No metadata available yet"));

            // Initialize Device
            deviceRef.current = new mediasoupClient.Device();
            const rtpCaps = await emitAsync<RtpCapabilities>("live:get-rtp-capabilities", { matchId });
            await deviceRef.current.load({ routerRtpCapabilities: rtpCaps });
            deviceReadyRef.current = true;

            // Create Transport
            const transportParams = await emitAsync<CreateTransportRes>("live:create-transport", {
                matchId, direction: "recv",
            });
            await createRecvTransport(transportParams);

            // Get Existing Producers
            const producers = await emitAsync<string[]>("live:get-producers", { matchId });
            console.log("🎯 Producers found:", producers);

            if (producers.length > 0) {
                for (const pid of producers) await consume(pid);
            } else {
                setState("waiting");
            }

        } catch (e) {
            console.error("Init Error:", e);
            setError("Failed to connect to stream");
            setState("error");
            initializedRef.current = false;
        }
    };

    const createRecvTransport = async (params: TransportOptions) => {
        if (!deviceRef.current) return;
        
        const transport = deviceRef.current.createRecvTransport(params);
        recvTransportRef.current = transport;

        transport.on("connect", async ({ dtlsParameters }, cb, eb) => {
            try {
                await emitAsync<void, ConnectTransportReq>("transport:connect", {
                    matchId: matchId!,
                    transportId: transport.id,
                    dtlsParameters,
                });
                cb();
                // Flush pending
                for (const pid of pendingProducersRef.current) consume(pid);
                pendingProducersRef.current = [];
            } catch (e) {
                eb(e as Error);
            }
        });
    };

    const consume = async (producerId: string) => {
        if (consumersRef.current.has(producerId) || consumingRef.current.has(producerId)) return;
        consumingRef.current.add(producerId);

        try {
            if (!deviceReadyRef.current || !recvTransportRef.current) {
                pendingProducersRef.current.push(producerId);
                return;
            }

            const data = await emitAsync<any, ConsumeReq>("live:consume", {
                matchId: matchId!,
                transportId: recvTransportRef.current.id,
                producerId,
                rtpCapabilities: deviceRef.current!.rtpCapabilities,
            });

            const consumer = await recvTransportRef.current.consume(data);
            consumersRef.current.set(producerId, consumer);
            mediaStreamRef.current.addTrack(consumer.track);
            
            attachStream();

            if (consumer.paused) {
                await emitAsync("live:resume-consumer", { matchId, consumerId: consumer.id });
            }

            // If we have video, we are live
            if (consumer.kind === 'video') setState("live");

        } catch (error) {
            console.error("Consume error", error);
        } finally {
            consumingRef.current.delete(producerId);
        }
    };

    const attachStream = () => {
        if (!videoRef.current) return;
        const stream = mediaStreamRef.current;
        
        if (videoRef.current.srcObject !== stream) {
            videoRef.current.srcObject = stream;
        }
        
        if (videoRef.current.muted !== muted) videoRef.current.muted = muted;

        // Try to play if we have tracks
        if (stream.getTracks().length > 0 && videoRef.current.paused) {
            videoRef.current.play().catch(e => console.warn("Autoplay block:", e));
        }
    };

    const checkActiveTracks = () => {
        const tracks = mediaStreamRef.current.getTracks();
        if (tracks.length === 0) setState("waiting");
    };

    // --- Cleanup Helper ---
    const softCleanup = () => {
        consumersRef.current.forEach((c) => c.close());
        consumersRef.current.clear();
        if (recvTransportRef.current) {
            recvTransportRef.current.close();
            recvTransportRef.current = null;
        }
        initializedRef.current = false;
        deviceReadyRef.current = false;
        
        // Clear media stream tracks locally
        mediaStreamRef.current.getTracks().forEach(t => {
            t.stop();
            mediaStreamRef.current.removeTrack(t);
        });
        
        if (videoRef.current) videoRef.current.srcObject = null;
    };

    // --- Quality ---
    useEffect(() => {
        const applyQuality = async () => {
            const target = QUALITY_TO_LAYER[quality];
            if (target === null) return;

            for (const consumer of consumersRef.current.values()) {
                if (consumer.kind === "video") {
                    await emitAsync<void, SetQualityReq>("viewer:set-quality", {
                        matchId: matchId!,
                        consumerId: consumer.id,
                        spatialLayer: target,
                        temporalLayer: 2,
                    });
                }
            }
        };
        applyQuality();
    }, [quality, matchId, emitAsync]);

    // --- Audio Toggle Sync ---
    useEffect(() => {
        if (videoRef.current) videoRef.current.muted = muted;
    }, [muted]);

    return { videoRef, state, error, muted, setMuted, quality, setQuality, metadata };
}