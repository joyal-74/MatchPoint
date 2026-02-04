import { injectable, inject } from "tsyringe";
import { DI_TOKENS } from "../../domain/constants/Identifiers.js";

import { IMatchesRepository } from "../../app/repositories/interfaces/manager/IMatchesRepository.js";
import { ILiveStreamService, StreamMetadata } from "../../app/repositories/interfaces/services/LiveStreamService.js";
import { NotFoundError } from "../../domain/errors/index.js";

import { IRoomRegistry } from "../../app/repositories/interfaces/shared/ISocketServices.js";
import { DtlsParameters, MediaKind, RtpCapabilities, RtpParameters } from "../livestream/Types.js";

type TransportDirection = "send" | "recv";

@injectable()
export class LiveStreamService implements ILiveStreamService {
    constructor(
        @inject(DI_TOKENS.RoomRegistry) private _roomRegistry: IRoomRegistry,
        @inject(DI_TOKENS.MatchesRepository) private _matchRepository: IMatchesRepository
    ) { }

    async createTransport(matchId: string, socketId: string, direction: TransportDirection) {
        const room = await this._roomRegistry.getOrCreateRoom(matchId);

        const transport = await room.createTransport(socketId, direction);

        return {
            id: transport.id,
            iceParameters: transport.iceParameters,
            iceCandidates: transport.iceCandidates,
            dtlsParameters: transport.dtlsParameters
        };
    }

    async startStream(matchId: string, title: string, description: string, userId: string): Promise<void> {
        if (!matchId) throw new Error("Match ID required");

        await this._matchRepository.updateStreamMetadata(matchId, {
            streamTitle: title,
            streamDescription: description,
            isStreamLive: true,
            streamStartedAt: new Date(),
            streamerId: userId
        });
    }

    async getStreamMetadata(matchId: string): Promise<StreamMetadata> {
        const match = await this._matchRepository.getStreamMetadata(matchId);
        if (!match) throw new NotFoundError("Match not found");

        const room = await this._roomRegistry.getOrCreateRoom(matchId);
        const viewers = room ? room.getPeerCount() : 0;

        return {
            title: match.streamTitle || "Untitled Stream",
            description: match.streamDescription || "",
            streamerName: match.streamerId || 'Tournament Stream',
            viewers: viewers
        };
    }

    async connectTransport(matchId: string, transportId: string, dtlsParameters: DtlsParameters) {
        const room = await this._roomRegistry.getOrCreateRoom(matchId);
        await room.connectTransport(transportId, dtlsParameters);
    }

    /* ================= PRODUCERS ================= */

    async produce(matchId: string, socketId: string, transportId: string, kind: MediaKind, rtpParameters: RtpParameters) {
        const room = await this._roomRegistry.getOrCreateRoom(matchId);
        const producer = await room.createProducer(
            socketId,
            transportId,
            kind,
            rtpParameters
        );
        return { id: producer.id };
    }

    async pauseProducer(matchId: string, producerId: string) {
        const room = await this._roomRegistry.getOrCreateRoom(matchId);
        room.pauseProducer(producerId);
    }

    async resumeProducer(matchId: string, producerId: string) {
        const room = await this._roomRegistry.getOrCreateRoom(matchId);
        room.resumeProducer(producerId);
    }

    async removeProducer(matchId: string, producerId: string) {
        const room = await this._roomRegistry.getOrCreateRoom(matchId);
        room.removeProducer(producerId);
    }

    async getProducersBySocket(matchId: string, socketId: string) {
        const room = await this._roomRegistry.getOrCreateRoom(matchId);
        return room.getProducersBySocket(socketId);
    }

    public async closeRoom(matchId: string): Promise<void> {
        console.log(`[SERVICE] Requesting to close room: ${matchId}`);
        await this._matchRepository.updateStreamStatus(matchId, false);
        await this._roomRegistry.removeRoom(matchId);
    }


    /* ================= CONSUMERS ================= */

    async consume(matchId: string, socketId: string, transportId: string, producerId: string, rtpCapabilities: RtpCapabilities) {
        const room = await this._roomRegistry.getOrCreateRoom(matchId);
        const consumer = await room.createConsumer(
            socketId,
            transportId,
            producerId,
            rtpCapabilities
        );

        return {
            id: consumer.id,
            producerId,
            kind: consumer.kind,
            rtpParameters: consumer.rtpParameters
        };
    }

    async resumeConsumer(
        matchId: string,
        socketId: string,
        consumerId: string
    ) {
        const room = await this._roomRegistry.getOrCreateRoom(matchId);
        room.resumeConsumer(socketId, consumerId);
    }

    async setConsumerPreferredLayers(
        matchId: string,
        socketId: string,
        consumerId: string,
        spatialLayer: number,
        temporalLayer: number
    ) {
        const room = await this._roomRegistry.getOrCreateRoom(matchId);
        await room.setConsumerPreferredLayers(
            socketId,
            consumerId,
            spatialLayer,
            temporalLayer
        );
    }

    /* ================= ROOM ================= */

    async getRouterRtpCapabilities(matchId: string): Promise<RtpCapabilities> {
        const room = await this._roomRegistry.getOrCreateRoom(matchId);
        return room.router.rtpCapabilities;
    }

    async getProducers(matchId: string): Promise<string[]> {
        const room = await this._roomRegistry.getOrCreateRoom(matchId);
        return room.getProducerIds();
    }

    async removeSocket(matchId: string, socketId: string) {
        const room = await this._roomRegistry.getOrCreateRoom(matchId);
        room.removeSocket(socketId);
    }
}
