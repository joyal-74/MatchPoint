import { useEffect, useRef, useState, useCallback } from "react";
import * as mediasoupClient from "mediasoup-client";

import type { Socket } from "socket.io-client";
import { createSocket } from "../../socket/socket";
import type { Consumer, ConsumerOptions, DtlsParameters, RtpCapabilities, Transport, TransportOptions } from "mediasoup-client/types";

export type StreamState = "connecting" | "waiting" | "live" | "paused" | "ended" | "error";

type Quality = "auto" | "low" | "medium" | "high";



const QUALITY_TO_LAYER: Record<Quality, number | null> = {
    auto: null,
    low: 0,
    medium: 1,
    high: 2,
};

// --- Socket Payload Interfaces ---
interface CreateTransportRes extends TransportOptions {
    id: string;
}

interface ConnectTransportReq {
    matchId: string;
    transportId: string;
    dtlsParameters: DtlsParameters;
}

interface ConsumeReq {
    matchId: string;
    transportId: string;
    producerId: string;
    rtpCapabilities: RtpCapabilities;
}

interface SetQualityReq {
    matchId: string;
    consumerId: string;
    spatialLayer: number;
    temporalLayer: number;
}

interface StreamMetadata {
    title: string;
    description: string;
    streamerName: string;
    viewers: number;
}

export function useMediasoupViewer(matchId: string | undefined) {
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const socketRef = useRef<Socket | null>(null);
    const deviceRef = useRef<mediasoupClient.Device | null>(null);

    // 1. Fixed: Strictly typed Transport and Consumer refs
    const recvTransportRef = useRef<Transport | null>(null);
    const consumersRef = useRef<Map<string, Consumer>>(new Map());
    const mediaStreamRef = useRef<MediaStream>(new MediaStream());

    const pendingProducersRef = useRef<string[]>([]);

    // Flags
    const initializedRef = useRef(false);
    const deviceReadyRef = useRef(false);
    const consumingRef = useRef<Set<string>>(new Set());

    const [state, setState] = useState<StreamState>("connecting");
    const [error, setError] = useState<string | null>(null);
    const [quality, setQuality] = useState<Quality>("auto");
    const [muted, setMuted] = useState(true);

    const [metadata, setMetadata] = useState<StreamMetadata>({
        title: "Loading...",
        description: "",
        streamerName: "",
        viewers: 0
    });

    /* ================= SOCKET HELPER ================= */
    // 2. Fixed: Generic emit wrapper
    const emitAsync = useCallback(<TRes, TReq = unknown>(event: string, data?: TReq): Promise<TRes> => {
        return new Promise((resolve, reject) => {
            if (!socketRef.current) return reject(new Error("No socket"));
            socketRef.current.emit(event, data, (res: TRes & { error?: string }) => {
                if (res?.error) reject(new Error(res.error));
                else resolve(res);
            });
        });
    }, []);

    /* ================= INITIALIZE ================= */
    useEffect(() => {
        if (!matchId) return;

        const socket = createSocket();
        socketRef.current = socket;

        console.log("🟢 [VIEWER] socket created");

        // 1. Connection Event
        socket.on("connect", () => {
            if (!initializedRef.current) initViewer();
        });

        socket.on("stream-metadata-updated", (data: Partial<StreamMetadata>) => {
            setMetadata(prev => ({ ...prev, ...data }));
        });

        // 2. New Producer Event
        socket.on("new-producer", ({ producerId }: { producerId: string }) => {
            if (!initializedRef.current || state === "ended") {
                console.log("🔄 Stream restarted! Re-initializing...");
                initViewer();
            } else {
                consume(producerId);
            }
        });

        socket.on("producer-left", onProducerLeft);
        socket.on("producer-paused", onProducerPaused);
        socket.on("producer-resumed", onProducerResumed);

        socket.on("stream-ended", () => {
            console.log("🏁 Stream ended");
            softCleanup();
            setState("ended");
        });

        if (socket.connected && !initializedRef.current) {
            initViewer();
        }

        return () => {
            console.log("🔴 [VIEWER] unmounting");
            fullCleanup();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [matchId]);

    const initViewer = async () => {
        if (initializedRef.current && state !== "ended") return;

        initializedRef.current = true;
        console.log("🚀 [VIEWER] initViewer called");

        try {
            setState("connecting");

            const metaPromise = emitAsync<StreamMetadata>("live:get-metadata", { matchId });

            await socketRef.current?.emit("viewer:join", { matchId });

            metaPromise.then(data => {
                setMetadata(prev => ({ ...prev, ...data }));
            }).catch(err => console.error("Failed to fetch metadata", err));

            deviceRef.current = new mediasoupClient.Device();

            // 3. Fixed: Typed API calls
            const rtpCaps = await emitAsync<RtpCapabilities>("live:get-rtp-capabilities", { matchId });
            await deviceRef.current.load({ routerRtpCapabilities: rtpCaps });
            deviceReadyRef.current = true;

            const transportParams = await emitAsync<CreateTransportRes>("live:create-transport", {
                matchId,
                direction: "recv",
            });
            await createRecvTransport(transportParams);

            const producers = await emitAsync<string[]>("live:get-producers", { matchId });
            console.log("🎯 [VIEWER] producers list:", producers);

            if (producers.length > 0) {
                for (const producerId of producers) {
                    await consume(producerId);
                }
            } else {
                setState("waiting");
            }

        } catch (e: unknown) {
            console.error("Init Error:", e);
            setError(e instanceof Error ? e.message : "Initialization failed");
            setState("error");
            initializedRef.current = false;
        }
    };

    /* ================= TRANSPORT ================= */
    const createRecvTransport = async (params: TransportOptions) => {
        if (!deviceRef.current) return;

        console.log("🚛 [VIEWER] creating recv transport", {
            id: params.id,
            ice: params.iceCandidates?.length,
        });

        const transport = deviceRef.current.createRecvTransport(params);
        recvTransportRef.current = transport;

        console.log("✅ [VIEWER] recv transport ready:", transport.id);

        transport.on("connect", async ({ dtlsParameters }, cb, eb) => {
            console.log("🔐 [VIEWER] transport connect (DTLS)", dtlsParameters);

            try {
                await emitAsync<void, ConnectTransportReq>("transport:connect", {
                    matchId: matchId!,
                    transportId: transport.id,
                    dtlsParameters,
                });
                cb();

                console.log("✅ [VIEWER] transport DTLS connected");


                for (const producerId of pendingProducersRef.current) {
                    consume(producerId);
                }
                pendingProducersRef.current = [];
            } catch (e) {
                eb(e as Error);
            }
        });
    };

    /* ================= CONSUME ================= */
    const consume = async (producerId: string) => {
        if (consumersRef.current.has(producerId) || consumingRef.current.has(producerId)) return;
        consumingRef.current.add(producerId);

        try {
            if (!deviceReadyRef.current || !recvTransportRef.current || recvTransportRef.current.closed) {
                pendingProducersRef.current.push(producerId);
                return;
            }

            console.log("📥 [VIEWER] requesting consume", {
                producerId,
                transportId: recvTransportRef.current?.id,
            });

            const data = await emitAsync<ConsumerOptions, ConsumeReq>("live:consume", {
                matchId: matchId!,
                transportId: recvTransportRef.current.id,
                producerId,
                rtpCapabilities: deviceRef.current!.rtpCapabilities,
            });

            console.log("📦 [VIEWER] consume response", data);


            const consumer = await recvTransportRef.current.consume(data);
            consumersRef.current.set(producerId, consumer);

            console.log("🎥 [VIEWER] consumer created", {
                id: consumer.id,
                kind: consumer.kind,
                paused: consumer.paused,
                trackReady: !!consumer.track,
                trackState: consumer.track?.readyState,
            });

            mediaStreamRef.current.addTrack(consumer.track);
            attachStream();



            if (consumer.paused) {
                await emitAsync("live:resume-consumer", {
                    matchId,
                    consumerId: consumer.id,
                });
            }

            setState((prev) => (prev === "paused" ? "paused" : "live"));

        } catch (error) {
            console.error("Consume error", error);
        } finally {
            consumingRef.current.delete(producerId);
        }
    };

    /* ================= VIDEO HANDLING ================= */
    const attachStream = () => {
        if (!videoRef.current) return;
        if (videoRef.current.srcObject !== mediaStreamRef.current) {
            videoRef.current.srcObject = mediaStreamRef.current;
        }
        if (videoRef.current.muted !== muted) videoRef.current.muted = muted;

        if (mediaStreamRef.current.getTracks().length > 0 && videoRef.current.paused) {
            videoRef.current.play().catch(e => console.warn("Autoplay:", e));
        }
    };

    useEffect(() => {
        attachStream();
    });

    /* ================= CLEANUP LOGIC ================= */
    const softCleanup = () => {
        consumersRef.current.forEach((c) => c.close());
        consumersRef.current.clear();

        if (recvTransportRef.current) {
            recvTransportRef.current.close();
            recvTransportRef.current = null;
        }

        initializedRef.current = false;
        deviceReadyRef.current = false;

        if (mediaStreamRef.current) {
            mediaStreamRef.current.getTracks().forEach((t) => {
                t.stop();
                mediaStreamRef.current.removeTrack(t);
            });
            mediaStreamRef.current = new MediaStream();
        }
        if (videoRef.current) {
            videoRef.current.srcObject = null;
        }
    };

    const fullCleanup = () => {
        softCleanup();
        socketRef.current?.disconnect();
    };

    /* ================= EVENTS ================= */
    const onProducerLeft = ({ producerId }: { producerId: string }) => {
        const consumer = consumersRef.current.get(producerId);
        if (!consumer) return;
        consumer.close();
        consumersRef.current.delete(producerId);
        mediaStreamRef.current.removeTrack(consumer.track);
    };

    const onProducerPaused = ({ producerId }: { producerId: string }) => {
        const consumer = consumersRef.current.get(producerId);
        if (consumer) {
            consumer.pause();
            if (consumer.kind === 'video') setState("paused");
        }
    };

    const onProducerResumed = ({ producerId }: { producerId: string }) => {
        const consumer = consumersRef.current.get(producerId);
        if (consumer) {
            consumer.resume();
            if (consumer.kind === 'video') setState("live");
        }
    };

    const applyQuality = useCallback(async (consumer: Consumer) => {
        if (consumer.kind !== "video") return;

        const target = QUALITY_TO_LAYER[quality];
        if (target === null) return;

        if (target === null) return;

        await emitAsync<void, SetQualityReq>("viewer:set-quality", {
            matchId: matchId!,
            consumerId: consumer.id,
            spatialLayer: target,
            temporalLayer: 2,
        });
    }, [quality, matchId, emitAsync]);

    useEffect(() => {
        consumersRef.current.forEach((c) => applyQuality(c));
    }, [applyQuality]);

    return { videoRef, state, error, muted, setMuted, quality, setQuality, metadata };
}