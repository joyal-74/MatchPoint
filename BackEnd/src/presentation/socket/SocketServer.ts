import { Server, Socket } from "socket.io";
import http from "http";
import { authenticateSocket } from "presentation/express/middlewares/socketAuth";
import { ChatHandler } from "./handlers/ChatHandler";
import { MatchHandler } from "./handlers/MatchHandler";

import { IMatchStatsRepo } from "app/repositories/interfaces/manager/IMatchStatsRepo";

import {
    IAddExtrasUseCase, IAddPenaltyUseCase, IAddRunsUseCase, IAddWicketUseCase,
    IEndInningsUseCase,
    IEndMatchUseCase,
    IEndOverUseCase,
    IInitInningsUseCase, IRetireBatsmanUseCase, ISetBowlerUseCase, ISetNonStrikerUseCase,
    ISetStrikerUseCase, IStartSuperOverUseCase, IUndoLastBallUseCase
} from "app/repositories/interfaces/usecases/IMatchesUseCaseRepo";
import { MatchViewerHandler } from "./handlers/MatchViewerHandler";
import { IPlayerRepository } from "app/repositories/interfaces/player/IPlayerRepository";
import { LiveStreamHandler } from "./handlers/LiveStreamHandler";
import { ILiveStreamService } from "app/repositories/interfaces/services/LiveStreamService";

export interface AuthenticatedSocket extends Socket {
    user: {
        _id: string;
        firstName: string;
        lastName: string;
        email: string;
        role: string;
        profileImage: string;
    };
}

export class SocketServer {
    private io!: Server;

    constructor(
        private matchRepo: IMatchStatsRepo,
        private playerRepo: IPlayerRepository,
        private liveStreamService: ILiveStreamService,

        private setStrikerUseCase: ISetStrikerUseCase,
        private setNonStrikerUseCase: ISetNonStrikerUseCase,
        private setBowlerUseCase: ISetBowlerUseCase,
        private initInningsUseCase: IInitInningsUseCase,
        private addRunsUseCase: IAddRunsUseCase,
        private addWicketUseCase: IAddWicketUseCase,
        private addExtrasUseCase: IAddExtrasUseCase,
        private undoLastBallUseCase: IUndoLastBallUseCase,
        private startSuperOverUseCase: IStartSuperOverUseCase,
        private addPenaltyUseCase: IAddPenaltyUseCase,
        private endInningsUseCase: IEndInningsUseCase,
        private endOverUseCase: IEndOverUseCase,
        private retireBatsmanUseCase: IRetireBatsmanUseCase,
        private endMatchUseCase: IEndMatchUseCase,
    ) { }

    public init(server: http.Server) {
        this.io = new Server(server, {
            cors: {
                origin: process.env.FRONTEND_URL || "*",
                credentials: true
            }
        });

        this.io.use((socket, next) => authenticateSocket(socket as AuthenticatedSocket, next));

        this.io.on("connection", (socket: Socket) => {

            const authSocket = socket as AuthenticatedSocket;
            console.log(`Socket Connected: ${authSocket.id} | User: ${authSocket.user.firstName}`);

            new ChatHandler(this.io, authSocket);

            new MatchHandler(
                this.io,
                authSocket,
                {
                    setStriker: this.setStrikerUseCase,
                    setNonStriker: this.setNonStrikerUseCase,
                    setBowler: this.setBowlerUseCase,
                    initInnings: this.initInningsUseCase,
                    addRuns: this.addRunsUseCase,
                    addWicket: this.addWicketUseCase,
                    addExtras: this.addExtrasUseCase,
                    undoLastBall: this.undoLastBallUseCase,
                    startSuperOver: this.startSuperOverUseCase,
                    addPenalty: this.addPenaltyUseCase,
                    endInnings: this.endInningsUseCase,
                    endOver: this.endOverUseCase,
                    retireBatsman: this.retireBatsmanUseCase,
                    endMatch : this.endMatchUseCase
                },
                this.matchRepo,
                this.playerRepo
            );

            new MatchViewerHandler(this.io, authSocket, this.matchRepo);

            new LiveStreamHandler(this.io, authSocket, this.liveStreamService);

            authSocket.on("disconnect", () => {
                console.log(`User disconnected: ${authSocket.user.firstName}`);
            });
        });

        return this.io;
    }

    public getIO() {
        if (!this.io) throw new Error("Socket.io not initialized");
        return this.io;
    }
}