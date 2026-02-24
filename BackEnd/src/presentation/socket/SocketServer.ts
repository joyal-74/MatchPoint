import { Server, Socket } from "socket.io";
import http from "http";
import { authenticateSocket } from "../../presentation/express/middlewares/socketAuth.js";
import { ChatHandler } from "./handlers/ChatHandler.js";
import { MatchHandler } from "./handlers/MatchHandler.js";

import { IMatchStatsRepo } from "../../app/repositories/interfaces/manager/IMatchStatsRepo.js";

import {
    IAddExtrasUseCase, IAddPenaltyUseCase, IAddRunsUseCase, IAddWicketUseCase,
    IEndInningsUseCase,
    IEndMatchUseCase,
    IEndOverUseCase,
    IInitInningsUseCase, IRetireBatsmanUseCase, ISetBowlerUseCase, ISetNonStrikerUseCase,
    ISetStrikerUseCase, IStartSuperOverUseCase, IUndoLastBallUseCase
} from "../../app/repositories/interfaces/usecases/IMatchesUseCaseRepo.js";
import { MatchViewerHandler } from "./handlers/MatchViewerHandler.js";
import { IPlayerRepository } from "../../app/repositories/interfaces/player/IPlayerRepository.js";
import { LiveStreamHandler } from "./handlers/LiveStreamHandler.js";
import { ILiveStreamService } from "../../app/repositories/interfaces/services/LiveStreamService.js";
import { DI_TOKENS } from "../../domain/constants/Identifiers.js";
import { inject, injectable } from "tsyringe";

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

@injectable()
export class SocketServer {
    private io!: Server;

    constructor(
        @inject(DI_TOKENS.MatchStatsRepository) private matchRepo: IMatchStatsRepo,
        @inject(DI_TOKENS.PlayerRepository) private playerRepo: IPlayerRepository,
        @inject(DI_TOKENS.LiveStreamService) private liveStreamService: ILiveStreamService,

        @inject(DI_TOKENS.SetStrikerUseCase) private setStrikerUseCase: ISetStrikerUseCase,
        @inject(DI_TOKENS.SetNonStrikerUseCase) private setNonStrikerUseCase: ISetNonStrikerUseCase,
        @inject(DI_TOKENS.SetBowlerUseCase) private setBowlerUseCase: ISetBowlerUseCase,
        @inject(DI_TOKENS.InitInningsUseCase) private initInningsUseCase: IInitInningsUseCase,
        @inject(DI_TOKENS.AddRunsUseCase) private addRunsUseCase: IAddRunsUseCase,
        @inject(DI_TOKENS.AddWicketUseCase) private addWicketUseCase: IAddWicketUseCase,
        @inject(DI_TOKENS.AddExtrasUseCase) private addExtrasUseCase: IAddExtrasUseCase,
        @inject(DI_TOKENS.UndoLastBallUseCase) private undoLastBallUseCase: IUndoLastBallUseCase,
        @inject(DI_TOKENS.StartSuperOverUseCase) private startSuperOverUseCase: IStartSuperOverUseCase,
        @inject(DI_TOKENS.AddPenaltyUseCase) private addPenaltyUseCase: IAddPenaltyUseCase,
        @inject(DI_TOKENS.EndInningsUseCase) private endInningsUseCase: IEndInningsUseCase,
        @inject(DI_TOKENS.EndOverUseCase) private endOverUseCase: IEndOverUseCase,
        @inject(DI_TOKENS.RetireBatsmanUseCase) private retireBatsmanUseCase: IRetireBatsmanUseCase,
        @inject(DI_TOKENS.EndMatchUseCase) private endMatchUseCase: IEndMatchUseCase,
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
            const userId = authSocket.user._id;
            console.log(`Socket Connected: ${authSocket.id} | User: ${authSocket.user.firstName}`);

            authSocket.join(userId);

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
                    endMatch: this.endMatchUseCase
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

    public kickUserFromTeam(userId: string, teamId: string) {
        if (!this.io) return;

        this.io.to(userId).emit("removed-from-team", { teamId });

        const userRoom = this.io.sockets.adapter.rooms.get(userId);
        if (userRoom) {
            userRoom.forEach((socketId) => {
                const socket = this.io.sockets.sockets.get(socketId);
                socket?.leave(teamId);
            });
        }

        console.log(`[Socket] User ${userId} kicked from team room ${teamId}`);
    }
}
