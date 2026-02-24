import { Consumer, DtlsParameters, MediaKind, Producer, Router, RtpCapabilities, RtpParameters, WebRtcTransport } from "../Types.js";

type TransportDirection = "send" | "recv";

export class MediaRoom {
    private producers = new Map<string, Producer>();
    private consumers = new Map<string, Map<string, Consumer>>();
    private transports = new Map<string, WebRtcTransport>();

    private loopbackConsumers = new Map<string, Consumer>();
    private peers: Set<string> = new Set();

    constructor(
        public readonly matchId: string,
        public readonly router: Router
    ) { }

    /* ================= TRANSPORT ================= */

    async createTransport(
        socketId: string,
        direction: TransportDirection
    ): Promise<WebRtcTransport> {

        const announcedIp = process.env.PUBLIC_IP || "143.110.183.69";

        if (!announcedIp) {
            console.error("❌ CRITICAL: process.env.PUBLIC_IP is undefined! Check your .env file path.");
        }

        const transport = await this.router.createWebRtcTransport({
            listenIps: [{ ip: "0.0.0.0", announcedIp }],
            enableUdp: true,
            enableTcp: true,
            preferUdp: true,
            initialAvailableOutgoingBitrate: 1_000_000,
            appData: { socketId, direction }
        });

        this.transports.set(transport.id, transport);
        this.peers.add(socketId);

        transport.on("dtlsstatechange", (state) => {
            console.log(`Transport ${transport.id} DTLS: ${state}`);
        });

        return transport;
    }

    getProducersBySocket(socketId: string): string[] {
        return [...this.producers.values()]
            .filter(p => p.appData.socketId === socketId)
            .map(p => p.id);
    }


    async connectTransport(
        transportId: string,
        dtlsParameters: DtlsParameters
    ) {
        const transport = this.transports.get(transportId);
        if (!transport) throw new Error("Transport not found");
        await transport.connect({ dtlsParameters });
    }

    /* ================= PRODUCERS ================= */

    public getProducerIds(): string[] {
        return Array.from(this.producers.keys());
    }

    public getPeerCount(): number {
        return this.peers.size;
    }

    async createProducer(
        socketId: string,
        transportId: string,
        kind: MediaKind,
        rtpParameters: RtpParameters
    ): Promise<Producer> {

        const transport = this.transports.get(transportId);
        if (!transport) throw new Error("Transport not found");

        const producer = await transport.produce({
            kind,
            rtpParameters,
            appData: { socketId }
        });

        this.producers.set(producer.id, producer);

        // 🔥 CRITICAL: keep ICE alive
        await this.createLoopbackConsumer(producer);

        producer.on("transportclose", () => {
            this.cleanupProducer(producer.id);
        });

        return producer;
    }

    private async createLoopbackConsumer(producer: Producer) {
        // 🔑 MUST use RECV transport
        const recvTransport = [...this.transports.values()].find(
            t =>
                t.appData.socketId === producer.appData.socketId &&
                t.appData.direction === "recv"
        );

        if (!recvTransport) {
            console.warn("❌ No recv transport for loopback");
            return;
        }

        if (!this.router.canConsume({
            producerId: producer.id,
            rtpCapabilities: this.router.rtpCapabilities
        })) {
            console.warn("❌ Router cannot consume producer");
            return;
        }

        const consumer = await recvTransport.consume({
            producerId: producer.id,
            rtpCapabilities: this.router.rtpCapabilities,
            paused: true
        });

        await consumer.resume();

        this.loopbackConsumers.set(consumer.id, consumer);

        consumer.on("producerclose", () => {
            consumer.close();
            this.loopbackConsumers.delete(consumer.id);
        });

        consumer.on("transportclose", () => {
            this.loopbackConsumers.delete(consumer.id);
        });
    }

    private cleanupProducer(producerId: string) {
        // Close loopback consumers
        for (const [id, consumer] of this.loopbackConsumers.entries()) {
            if (consumer.producerId === producerId) {
                consumer.close();
                this.loopbackConsumers.delete(id);
            }
        }

        const producer = this.producers.get(producerId);
        if (producer && !producer.closed) producer.close();
        this.producers.delete(producerId);
    }

    removeProducer(producerId: string) {
        this.cleanupProducer(producerId);
        return true;
    }

    /* ================= CONSUMERS ================= */

    async createConsumer(
        viewerId: string,
        transportId: string,
        producerId: string,
        rtpCapabilities: RtpCapabilities
    ): Promise<Consumer> {

        const producer = this.producers.get(producerId);
        if (!producer) throw new Error("Producer not found");

        if (!this.router.canConsume({ producerId, rtpCapabilities })) {
            throw new Error("Cannot consume producer");
        }

        const transport = this.transports.get(transportId);
        if (!transport) throw new Error("Transport not found");

        const consumer = await transport.consume({
            producerId,
            rtpCapabilities,
            paused: false
        });

        if (!this.consumers.has(viewerId)) {
            this.consumers.set(viewerId, new Map());
        }

        this.consumers.get(viewerId)!.set(consumer.id, consumer);

        consumer.on("transportclose", () => {
            this.consumers.get(viewerId)?.delete(consumer.id);
        });

        consumer.on("producerclose", () => {
            this.consumers.get(viewerId)?.delete(consumer.id);
            consumer.close();
        });

        return consumer;
    }

    resumeConsumer(viewerId: string, consumerId: string) {
        this.consumers.get(viewerId)?.get(consumerId)?.resume();
    }

    /* ================= CLEANUP ================= */

    removeSocket(socketId: string) {
        // Producers
        for (const [id, producer] of this.producers.entries()) {
            if (producer.appData.socketId === socketId) {
                this.cleanupProducer(id);
            }
        }

        // Consumers
        this.consumers.get(socketId)?.forEach(c => c.close());
        this.consumers.delete(socketId);
        this.peers.delete(socketId);

        // Transports
        for (const [id, transport] of this.transports.entries()) {
            if (transport.appData.socketId === socketId) {
                transport.close();
                this.transports.delete(id);
            }
        }
    }

    async setConsumerPreferredLayers(
        viewerId: string,
        consumerId: string,
        spatialLayer: number,
        temporalLayer?: number
    ) {
        const consumer = this.consumers
            .get(viewerId)
            ?.get(consumerId);

        if (!consumer) {
            console.warn(
                `⚠️ Consumer not found for viewer=${viewerId}, consumer=${consumerId}`
            );
            return;
        }

        if (consumer.kind !== "video") {
            console.warn("⚠️ setConsumerPreferredLayers ignored (not video)");
            return;
        }

        await consumer.setPreferredLayers({
            spatialLayer,
            temporalLayer
        });

    }

    /* ================= PRODUCER CONTROL ================= */

    pauseProducer(producerId: string) {
        const producer = this.producers.get(producerId);

        if (!producer) {
            console.warn(`⚠️ pauseProducer: Producer ${producerId} not found`);
            return;
        }

        if (producer.paused) return;

        producer.pause();
    }

    resumeProducer(producerId: string) {
        const producer = this.producers.get(producerId);

        if (!producer) {
            console.warn(`⚠️ resumeProducer: Producer ${producerId} not found`);
            return;
        }

        if (!producer.paused) return;

        producer.resume();
    }



    close() {
        this.producers.forEach(p => !p.closed && p.close());
        this.consumers.forEach(m => m.forEach(c => !c.closed && c.close()));
        this.loopbackConsumers.forEach(c => !c.closed && c.close());
        this.transports.forEach(t => !t.closed && t.close());

        this.producers.clear();
        this.consumers.clear();
        this.loopbackConsumers.clear();
        this.transports.clear();

        if (!this.router.closed) this.router.close();
    }
}
