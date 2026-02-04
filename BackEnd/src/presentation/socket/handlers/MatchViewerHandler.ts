import { Server } from "socket.io";
import { AuthenticatedSocket } from "../SocketServer.js";
import { IMatchStatsRepo } from "../../../app/repositories/interfaces/manager/IMatchStatsRepo.js"; 
import { inject } from "tsyringe";
import { DI_TOKENS } from "../../../domain/constants/Identifiers.js"; 

export class MatchViewerHandler {
    constructor(
        private io: Server,
        private socket: AuthenticatedSocket,
        @inject(DI_TOKENS.MatchStatsRepository) private matchRepo: IMatchStatsRepo
    ) {
        this.setupEvents();
    }

    private setupEvents() {
        this.socket.on("viewer:join-match", this.joinMatch.bind(this));
        this.socket.on("viewer:leave-match", this.leaveMatch.bind(this));
        this.socket.on("viewer:request-match-state", this.sendMatchState.bind(this));
        this.socket.on("viewer:subscribe-commentary", this.subscribeCommentary.bind(this));
        this.socket.on("disconnecting", this.handleDisconnecting.bind(this));
    }

    private async joinMatch({ matchId }: { matchId: string }) {
        try {
            // Join the match room (Scoreboard logic)
            this.socket.join(`viewer-match-${matchId}`);

            // Send current match state immediately
            const match = await this.matchRepo.findByMatchId(matchId);
            if (match) {
                const liveScoreDto = match.toDTO();
                this.socket.emit("match:state", liveScoreDto);
            }

            // Get viewer count
            const viewerCount = this.getViewerCount(matchId);

            // Notify others that a viewer joined
            this.socket.to(`viewer-match-${matchId}`).emit("viewer:joined", {
                viewerId: this.socket.id,
                count: viewerCount
            });

            // Send viewer count to the new viewer
            this.socket.emit("viewer:count", { count: viewerCount });


            console.log(`Viewer ${this.socket.id} joined match ${matchId} (Scoreboard), total viewers: ${viewerCount}`);
        } catch (error) {
            console.error("Viewer join error:", error);
            this.socket.emit("error", { message: "Failed to join match" });
        }
    }

    private leaveMatch({ matchId }: { matchId: string }) {
        this.socket.leave(`viewer-match-${matchId}`);
        const viewerCount = this.getViewerCount(matchId);

        this.socket.to(`viewer-match-${matchId}`).emit("viewer:left", {
            viewerId: this.socket.id,
            count: viewerCount
        });

        console.log(`Viewer ${this.socket.id} left match ${matchId}`);
    }

    private async sendMatchState({ matchId }: { matchId: string }) {
        try {
            const match = await this.matchRepo.findByMatchId(matchId);
            if (match) {
                this.socket.emit("match:state", match.toDTO());
            }
        } catch (error) {
            console.error("Error sending match state:", error);
        }
    }

    private subscribeCommentary({ matchId }: { matchId: string }) {
        this.socket.join(`commentary-match-${matchId}`);
        console.log(`Viewer ${this.socket.id} subscribed to commentary for match ${matchId}`);
    }

    private getViewerCount(matchId: string): number {
        const roomName = `viewer-match-${matchId}`;
        const sockets = this.io.sockets.adapter.rooms.get(roomName);
        if (!sockets) return 0;

        const uniqueUsers = new Set();

        for (const socketId of sockets) {
            const socket = this.io.sockets.sockets.get(socketId) as AuthenticatedSocket;
            // Use userId if available, otherwise fallback to socketId
            const identifier = socket.data?.userId || socketId;
            uniqueUsers.add(identifier);
        }

        return uniqueUsers.size;
    }

    private broadcastViewerCount(matchId: string) {
        const count = this.getUniqueViewerCount(matchId);
        this.io.to(`viewer-match-${matchId}`).emit("viewer:count", { count });
        // Also emit to the specific scoreboard event if your dashboard uses it
        this.io.to(`viewer-match-${matchId}`).emit("viewer-count-update", { count });
    }

    private getUniqueViewerCount(matchId: string): number {
        const roomName = `viewer-match-${matchId}`;
        const socketIds = this.io.sockets.adapter.rooms.get(roomName);
        if (!socketIds) return 0;

        const uniqueUsers = new Set<string>();

        socketIds.forEach(socketId => {
            const clientSocket = this.io.sockets.sockets.get(socketId) as AuthenticatedSocket;
            if (clientSocket && clientSocket.user) {
                // EXCLUDE STREAMERS/ADMINS FROM COUNT
                if (clientSocket.user.role !== 'streamer') {
                    uniqueUsers.add(clientSocket.user._id.toString());
                }
            }
        });

        return uniqueUsers.size;
    }
    private handleDisconnecting() {
        // Find match rooms this socket is currently in
        this.socket.rooms.forEach(room => {
            if (room.startsWith("viewer-match-")) {
                const matchId = room.replace("viewer-match-", "");
                // Use setTimeout to ensure the count is calculated AFTER this socket is gone
                setTimeout(() => this.broadcastViewerCount(matchId), 100);
            }
        });
    }
}
