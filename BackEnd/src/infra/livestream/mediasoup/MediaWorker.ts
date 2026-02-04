import mediasoup from "mediasoup";
import { Worker } from "../Types.js";


export const createMediaWorker = async (): Promise<Worker> => {
    return await mediasoup.createWorker({
        rtcMinPort: 2000,
        rtcMaxPort: 2020,
        logLevel: "warn",
        logTags: ["info", "ice", "dtls", "rtp", "srtp", "rtcp"],
    });
};
