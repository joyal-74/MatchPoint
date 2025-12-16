import * as mediasoupClient from "mediasoup-client";
import socket from "@/socket";

export const useLiveStream = (matchId: string) => {
    let device: mediasoupClient.Device;
    let sendTransport;
    let videoProducer;
    let audioProducer;

    const startStream = async (stream: MediaStream) => {
        device = new mediasoupClient.Device();

        const routerRtpCapabilities = await socket.emitWithAck("get-rtp-capabilities");
        await device.load({ routerRtpCapabilities });

        const transportParams = await socket.emitWithAck("live:create-transport", { matchId });
        sendTransport = device.createSendTransport(transportParams);

        sendTransport.on("connect", ({ dtlsParameters }, cb) => {
            socket.emit("transport:connect", {
                matchId,
                transportId: sendTransport.id,
                dtlsParameters,
            });
            cb();
        });

        sendTransport.on("produce", async ({ kind, rtpParameters }, cb) => {
            const { id } = await socket.emitWithAck("live:produce", {
                matchId,
                transportId: sendTransport.id,
                kind,
                rtpParameters,
            });
            cb({ id });
        });

        videoProducer = await sendTransport.produce({
            track: stream.getVideoTracks()[0],
        });

        audioProducer = await sendTransport.produce({
            track: stream.getAudioTracks()[0],
        });
    };

    const stopStream = async () => {
        videoProducer?.close();
        audioProducer?.close();
        sendTransport?.close();
    };

    return { startStream, stopStream };
};
