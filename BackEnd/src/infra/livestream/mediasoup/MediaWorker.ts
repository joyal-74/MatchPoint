import mediasoup from "mediasoup";
import { Worker } from "../Types";


export const createMediaWorker = async (): Promise<Worker> => {
    return await mediasoup.createWorker({
        rtcMinPort: 10000,
        rtcMaxPort: 10100,
        logLevel: "warn",
        logTags: ["info", "ice", "dtls", "rtp", "srtp", "rtcp"],
    });
};
