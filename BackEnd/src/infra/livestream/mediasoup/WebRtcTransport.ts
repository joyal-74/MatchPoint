import { Router, WebRtcTransport, WebRtcTransportOptions } from "../Types.js";

export const createWebRtcTransport = async (router: Router): Promise<WebRtcTransport> => {
    const announcedIp = process.env.PUBLIC_IP || "127.0.0.1";

    const transportOptions: WebRtcTransportOptions = {
        listenIps: [
            {
                ip: "0.0.0.0",
                announcedIp,
            },
        ],
        enableUdp: true,
        enableTcp: true,
        preferUdp: true,
        initialAvailableOutgoingBitrate: 1_000_000,
        iceConsentTimeout: 0,
    };

    const transport = await router.createWebRtcTransport(transportOptions);
    console.log(`Standalone transport created: ID=${transport.id}, announcedIp=${announcedIp}`);

    transport.on('dtlsstatechange', (state) => {
        console.log(`Standalone transport ${transport.id} DTLS state: ${state}`);
        if (state === 'failed') {
            console.error(`DTLS failed—check UDP ports 10000-10100/firewall`);
        }
    });

    return transport;
};