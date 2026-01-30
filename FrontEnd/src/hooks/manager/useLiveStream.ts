import * as mediasoupClient from "mediasoup-client";
import { useRef } from "react";
import { getSocket } from "../../socket/socket";

export const useLiveStream = (matchId: string) => {
    const deviceRef = useRef<mediasoupClient.Device | null>(null);
    const transportRef = useRef<mediasoupClient.types.Transport | null>(null);
    const videoProducerRef = useRef<mediasoupClient.types.Producer | null>(null);
    const audioProducerRef = useRef<mediasoupClient.types.Producer | null>(null);

    const socket = getSocket();

    const startStream = async (stream: MediaStream) => {
        const device = new mediasoupClient.Device();
        deviceRef.current = device;

        const routerRtpCapabilities = await socket.emitWithAck("get-rtp-capabilities");
        await device.load({ routerRtpCapabilities });

        const transportParams = await socket.emitWithAck("live:create-transport", { matchId });
        
        const sendTransport = device.createSendTransport(transportParams);
        transportRef.current = sendTransport;

        sendTransport.on("connect", ({ dtlsParameters }, cb) => {
            socket.emit("transport:connect", {
                matchId,
                transportId: sendTransport.id,
                dtlsParameters,
            });
            cb();
        });

        sendTransport.on("produce", async ({ kind, rtpParameters }, cb, errback) => {
            try {
                const { id } = await socket.emitWithAck("live:produce", {
                    matchId,
                    transportId: sendTransport.id,
                    kind,
                    rtpParameters,
                });
                cb({ id });
            } catch (error : unknown) {
                errback(error as unknown as Error);
            }
        });

        // Produce Video
        const videoTrack = stream.getVideoTracks()[0];
        if (videoTrack) {
            videoProducerRef.current = await sendTransport.produce({ track: videoTrack });
        }

        // Produce Audio
        const audioTrack = stream.getAudioTracks()[0];
        if (audioTrack) {
            audioProducerRef.current = await sendTransport.produce({ track: audioTrack });
        }
    };

    const stopStream = async () => {
        videoProducerRef.current?.close();
        audioProducerRef.current?.close();
        transportRef.current?.close();

        videoProducerRef.current = null;
        audioProducerRef.current = null;
        transportRef.current = null;
    };

    return { startStream, stopStream };
};