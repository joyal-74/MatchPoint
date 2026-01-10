import { Server } from "socket.io";
import { AuthenticatedSocket } from "../SocketServer";
import { IMatchStatsRepo } from "app/repositories/interfaces/manager/IMatchStatsRepo";

export class MatchViewerHandler {
    constructor(
        private io: Server,
        private socket: AuthenticatedSocket,
        private matchRepo: IMatchStatsRepo
    ) {
        this.setupEvents();
    }

    private setupEvents() {
        this.socket.on("viewer:join-match", this.joinMatch.bind(this));
        this.socket.on("viewer:leave-match", this.leaveMatch.bind(this));
        this.socket.on("viewer:request-match-state", this.sendMatchState.bind(this));
        this.socket.on("viewer:subscribe-commentary", this.subscribeCommentary.bind(this));
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
        const room = this.io.sockets.adapter.rooms.get(`viewer-match-${matchId}`);
        return room ? room.size : 0;
    }
}