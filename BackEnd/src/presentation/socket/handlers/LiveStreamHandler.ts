import { Server } from "socket.io";
import { AuthenticatedSocket } from "../SocketServer";
import { ILiveStreamService } from "../../../app/repositories/interfaces/services/LiveStreamService"; 
import { ConnectTransportData, CreateTransportData, ConsumeData, ProduceData, Callback } from "../utils/liveStream.types";
import { DI_TOKENS } from "../../../domain/constants/Identifiers";
import { inject, injectable } from "tsyringe";

@injectable()
export class LiveStreamHandler {
    constructor(
        private io: Server,
        private socket: AuthenticatedSocket,
        @inject(DI_TOKENS.LiveStreamService) private liveStreamService: ILiveStreamService
    ) {
        this.register();
    }

    private register() {
        // --- Router Capabilities ---
        this.socket.on("live:get-rtp-capabilities", async ({ matchId }, cb) => {
            try {
                const caps = await this.liveStreamService.getRouterRtpCapabilities(matchId);
                cb(caps);
            } catch (err) {
                console.error(err);
                cb({ error: (err as Error).message });
            }
        });

        // --- Transports ---
        this.socket.on("live:create-transport", async (data: CreateTransportData, cb) => {
            try {
                const transport = await this.liveStreamService.createTransport(data.matchId, this.socket.id, data.direction);
                cb({ ...transport });
            } catch (err) {
                cb({ error: (err as Error).message });
            }
        });

        this.socket.on("transport:connect", async (data: ConnectTransportData, callback?: Callback) => {
            try {
                await this.liveStreamService.connectTransport(
                    data.matchId,
                    data.transportId,
                    data.dtlsParameters
                );
                if (typeof callback === "function") callback({ ok: true });
            } catch (err) {
                console.error("transport:connect error", err);
                if (typeof callback === "function") callback({ error: "transport-connect-failed" });
            }
        });

        // --- Stream Management (Streamer Side) ---
        this.socket.on("live:start", async (data: { matchId: string; title: string; description: string, userId: string }, cb) => {
            console.log("🎬 [SERVER] Stream starting:", data.matchId);
            try {
                await this.liveStreamService.startStream(
                    data.matchId,
                    data.title,
                    data.description,
                    data.userId
                );

                // Notify viewers in the match room
                this.socket.to(`viewer-match-${data.matchId}`).emit("stream-metadata-updated", {
                    title: data.title,
                    description: data.description
                });

                this.io.to(`viewer-match-${data.matchId}`).emit("streamState", {
                    isLive: true
                });

                if (typeof cb === "function") cb({ success: true });
            } catch (err) {
                console.error("Start stream error:", err);
                if (typeof cb === "function") cb({ error: (err as Error).message });
            }
        });

        this.socket.on("live:produce", async (data: ProduceData, cb) => {
            console.log("📤 [SERVER] live:produce", { matchId: data.matchId, kind: data.kind });
            try {
                const producer = await this.liveStreamService.produce(
                    data.matchId,
                    this.socket.id,
                    data.transportId,
                    data.kind,
                    data.rtpParameters
                );

                // Announce new producer to all viewers in the match room
                this.io.to(`viewer-match-${data.matchId}`).emit("new-producer", { producerId: producer.id });

                cb({ id: producer.id });
            } catch (err) {
                cb({ error: (err as Error).message });
            }
        });

        this.socket.on("stream:end", async ({ matchId }) => {
            console.log("🛑 [SERVER] Streamer ended stream manually:", matchId);
            await this.liveStreamService.closeRoom(matchId);

            this.io.to(`viewer-match-${matchId}`).emit("streamState", { isLive: false });
            this.io.to(`viewer-match-${matchId}`).emit("stream-ended");
        });

        // --- Viewer Side Logic ---

        // FIX: Handle viewer joining specifically for stream data
        this.socket.on("viewer:join", async ({ matchId }, cb) => {
            // Join the standardized viewer room (consistent with MatchViewerHandler)
            this.socket.join(`viewer-match-${matchId}`);

            try {
                const producers = await this.liveStreamService.getProducers(matchId);
                const isLive = producers.length > 0;

                // Send current state ONLY to the joining socket
                this.socket.emit("streamState", {
                    isLive: isLive
                });

                // If stream is live, send existing producers to this viewer
                if (isLive) {
                    producers.forEach((producerId) => {
                        this.socket.emit("new-producer", { producerId });
                    });
                }

                cb?.({ success: true });
            } catch (error) {
                console.error("Error in viewer:join:", error);
            }
        });


        this.socket.on("live:get-producers", async ({ matchId }, cb) => {
            try {
                const producers = await this.liveStreamService.getProducers(matchId);
                cb(producers);
            } catch (err) {
                cb({ error: (err as Error).message });
            }
        });

        // 2. Return stream metadata (Title/Desc)
        this.socket.on("live:get-metadata", async ({ matchId }, cb) => {
            try {
                // This should fetch from your DB or Service memory
                const metadata = await this.liveStreamService.getStreamMetadata(matchId);
                cb(metadata);
            } catch (err) {
                cb({ error: (err as Error).message });
            }
        });

        // 3. Handle Quality Switching
        this.socket.on("viewer:set-quality", async (data, cb) => {
            try {
                await this.liveStreamService.setConsumerPreferredLayers(
                    data.matchId,
                    this.socket.id,
                    data.consumerId,
                    data.spatialLayer,
                    2
                );
                cb({ success: true });
            } catch (err) {
                cb({ error: (err as Error).message });
            }
        });

        this.socket.on("live:consume", async (data: ConsumeData, cb) => {
            try {
                console.log("📥 [SERVER] live:consume", { viewerSocket: this.socket.id, producerId: data.producerId });
                const consumer = await this.liveStreamService.consume(
                    data.matchId,
                    this.socket.id,
                    data.transportId,
                    data.producerId,
                    data.rtpCapabilities
                );

                cb({
                    id: consumer.id,
                    producerId: consumer.producerId,
                    kind: consumer.kind,
                    rtpParameters: consumer.rtpParameters,
                });

                this.io.to(data.matchId).emit("consumer-joined");
            } catch (err) {
                cb({ error: (err as Error).message });
            }
        });

        this.socket.on("live:resume-consumer", async ({ matchId, consumerId }) => {
            try {
                await this.liveStreamService.resumeConsumer(matchId, this.socket.id, consumerId);
            } catch (err) {
                console.error("Failed to resume consumer", err);
            }
        });

        // --- Cleanup ---
        this.socket.on("disconnect", async () => {
            // Cleanup logic is handled by socket.io automatically leaving rooms
            // Additional cleanup for media transports logic here if needed
        });
    }
}
