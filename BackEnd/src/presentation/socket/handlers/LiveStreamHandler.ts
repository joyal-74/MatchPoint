import { Server } from "socket.io";
import { AuthenticatedSocket } from "../SocketServer";
import { ILiveStreamService } from "app/repositories/interfaces/services/LiveStreamService";
import { ConnectTransportData, CreateTransportData, ConsumeData, ProduceData, Callback } from "../utils/liveStream.types";

export class LiveStreamHandler {
    constructor(
        private io: Server,
        private socket: AuthenticatedSocket,
        private liveStreamService: ILiveStreamService
    ) {
        this.register();
    }

    private register() {
        this.socket.on("live:get-rtp-capabilities", async ({ matchId }, cb) => {
            try {
                const caps = await this.liveStreamService.getRouterRtpCapabilities(matchId);
                cb(caps);
            } catch (err) {
                console.error(err);
                cb({ error: (err as Error).message });
            }
        });

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

                if (typeof callback === "function") {
                    callback({ ok: true });
                }
            } catch (err) {
                console.error("transport:connect error", err);

                if (typeof callback === "function") {
                    callback({ error: "transport-connect-failed" });
                }
            }
        }
        );

        this.socket.on("live:produce", async (data: ProduceData, cb) => {

            console.log("📤 [SERVER] live:produce", {
                matchId: data.matchId,
                socketId: this.socket.id,
                kind: data.kind,
            });

            try {
                const producer = await this.liveStreamService.produce(
                    data.matchId,
                    this.socket.id,
                    data.transportId,
                    data.kind,
                    data.rtpParameters
                );

                this.io.to(data.matchId).emit("new-producer", { producerId: producer.id });

                cb({ id: producer.id });
            } catch (err) {
                cb({ error: (err as Error).message });
            }
        });

        this.socket.on("live:consume", async (data: ConsumeData, cb) => {


            try {
                console.log("📥 [SERVER] live:consume", {
                    viewerSocket: this.socket.id,
                    producerId: data.producerId
                });
                const consumer = await this.liveStreamService.consume(
                    data.matchId,
                    this.socket.id,
                    data.transportId,
                    data.producerId,
                    data.rtpCapabilities
                );

                console.log("🎧 [SERVER] consumer created:", consumer.id);


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

        this.socket.on("viewer:join", async ({ matchId }, cb) => {
            console.log("👀 [SERVER] viewer:join", {
                matchId,
                socketId: this.socket.id,
                user: this.socket.user?.firstName,
            });

            this.socket.join(matchId);

            if (typeof cb === "function") {
                cb({ success: true });
            }

            // const producers = await this.liveStreamService.getProducers(matchId);

            // console.log("👀 [SERVER] existing producers:", producers);

            // producers.forEach((producerId) => {
            //     this.socket.emit("new-producer", { producerId });
            // });
        });


        this.socket.on("viewer:set-quality", async (data) => {
            try {
                await this.liveStreamService.setConsumerPreferredLayers(
                    data.matchId,
                    this.socket.id,
                    data.consumerId,
                    data.spatialLayer,
                    data.temporalLayer
                );
            } catch (err) {
                console.error("Set Quality Error:", err);
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

        this.socket.on("live:resume-consumer", async ({ matchId, consumerId }) => {
            try {
                console.log("▶️ [SERVER] resume consumer:", consumerId);
                await this.liveStreamService.resumeConsumer(
                    matchId,
                    this.socket.id,
                    consumerId
                );
            } catch (err) {
                console.error("Failed to resume consumer", err);
            }
        });


        this.socket.on("producer:close", async ({ matchId, producerId }) => {
            try {
                await this.liveStreamService.removeProducer(matchId, producerId);
                this.io.to(matchId).emit("producer-left", { producerId });
                this.io.to(matchId).emit("stream-ended");
            } catch (err) {
                console.error("Failed to remove producer:", err);
            }
        });

        this.socket.on("producer:pause", async ({ matchId, producerId }) => {
            try {
                await this.liveStreamService.pauseProducer(matchId, producerId);
                this.io.to(matchId).emit("producer-paused", { producerId });
            } catch (err) {
                console.error("Failed to pause producer:", err);
            }
        });

        this.socket.on("producer:resume", async ({ matchId, producerId }) => {
            try {
                await this.liveStreamService.resumeProducer(matchId, producerId);
                this.io.to(matchId).emit("producer-resumed", { producerId });
            } catch (err) {
                console.error("Failed to resume producer:", err);
            }
        });

        this.socket.on("stream:end", async ({ matchId }) => {
            console.log("🛑 [SERVER] Streamer ended stream manually:", matchId);

            await this.liveStreamService.closeRoom(matchId);

            this.io.to(matchId).emit("stream-ended");
        });

        this.socket.on("disconnect", async () => {
            const rooms = Array.from(this.socket.rooms);

            for (const matchId of rooms) {
                if (matchId === this.socket.id) continue;

                const producerIds =
                    await this.liveStreamService.getProducersBySocket(matchId, this.socket.id);

                producerIds.forEach((producerId) => {
                    this.io.to(matchId).emit("producer-paused", { producerId });
                });

                this.io.to(matchId).emit("consumer-left");

                setTimeout(async () => {
                    await this.liveStreamService.removeSocket(matchId, this.socket.id);

                    const remaining =
                        await this.liveStreamService.getProducers(matchId);

                    if (remaining.length === 0) {
                        this.io.to(matchId).emit("stream-ended");
                    }
                }, 120_000);
            }
        });
    }
}