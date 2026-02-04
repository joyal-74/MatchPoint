import { RtpParameters, RtpCapabilities, IceParameters, IceCandidate, DtlsParameters, MediaKind } from "mediasoup/types";

export interface StreamMetadata {
    title: string;
    description: string;
    streamerName: string;
    viewers: number;
}


export interface ILiveStreamService {

    createTransport(matchId: string, socketId: string, direction: "send" | "recv"): Promise<{
        id: string;
        iceParameters: IceParameters;
        iceCandidates: IceCandidate[];
        dtlsParameters: DtlsParameters;
    }>;

    produce(matchId: string, socketId: string, transportId: string, kind: MediaKind, rtpParameters: RtpParameters): Promise<{ id: string }>;

    getProducers(matchId: string): Promise<string[]>;

    getRouterRtpCapabilities(matchId: string): Promise<RtpCapabilities>;

    connectTransport(matchId: string, transportId: string, dtlsParameters: DtlsParameters): Promise<void>;

    setConsumerPreferredLayers(
        matchId: string,
        socketId: string,
        producerId: string,
        spatialLayer: number,
        temporalLayer: number
    ): Promise<void>;


    consume(
        matchId: string,
        socketId: string,
        transportId: string,
        producerId: string,
        rtpCapabilities: RtpCapabilities
    ): Promise<{
        id: string;
        producerId: string;
        kind: MediaKind;
        rtpParameters: RtpParameters;
    }>;

    resumeProducer(matchId: string, producerId: string): Promise<void>;

    removeProducer(matchId: string, producerId: string): Promise<void>;

    pauseProducer(matchId: string, producerId: string): Promise<void>;

    removeSocket(matchId: string, socketId: string): Promise<void>;

    resumeConsumer(matchId: string, socketId: string, consumerId: string): Promise<void>;

    getProducersBySocket(matchId: string, socketId: string): Promise<string[]>;

    closeRoom(matchId: string): Promise<void>;

    startStream(matchId: string, title: string, description: string, socketId: string): Promise<void>;

    getStreamMetadata(matchId: string): Promise<StreamMetadata>;

    setConsumerPreferredLayers(matchId: string, socketId: string, consumerId: string, spatialLayer: number, temporalLayer: number): Promise<void>;
}
