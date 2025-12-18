import { Worker, Router, RtpCodecCapability } from "mediasoup/node/lib/types";

const mediaCodecs: RtpCodecCapability[] = [
    {
        kind: "video",
        mimeType: "video/VP8",
        clockRate: 90000,
        preferredPayloadType: 96,
        rtcpFeedback: [
            { type: "nack" },
            { type: "nack", parameter: "pli" },
            { type: "ccm", parameter: "fir" },
            { type: "goog-remb" },
        ],
    },
    {
        kind: "audio",
        mimeType: "audio/opus",
        clockRate: 48000,
        channels: 2,
        preferredPayloadType: 111,
    },
];

export const createMediaRouter = async ( worker: Worker): Promise<Router> => {
    return await worker.createRouter({ mediaCodecs });
};