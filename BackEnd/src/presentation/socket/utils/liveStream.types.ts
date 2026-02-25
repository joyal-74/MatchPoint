import { DtlsParameters, MediaKind, RtpCapabilities, RtpParameters } from "../../../infra/livestream/Types";

export interface ProduceData {
    matchId: string;
    transportId: string;
    kind: MediaKind;
    rtpParameters: RtpParameters;
}

export interface ConsumeData {
    matchId: string;
    transportId: string;
    producerId: string;
    rtpCapabilities: RtpCapabilities;
}

export interface CreateTransportData {
    matchId: string;
    direction: "send" | "recv";
}

export interface ConnectTransportData {
    matchId: string;
    transportId: string;
    dtlsParameters: DtlsParameters;
}

export type Callback<T = any> = (response: T | { error: string }) => void;
