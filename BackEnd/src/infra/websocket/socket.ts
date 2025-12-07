import { Server, Socket } from "socket.io";
import http from "http";
import { Types } from "mongoose";
import { MessageModel } from "infra/databases/mongo/models/MessageModel";
import { authenticateSocket } from "presentation/express/middlewares/socketAuth";
import { TournamentMatchStatsDocument, TournamentMatchStatsModel } from "infra/databases/mongo/models/TournamentMatchStatsModel";
import { IAddRunsUseCase, IAddWicketUseCase, IInitInningsUseCase, ISetBowlerUseCase, ISetNonStrikerUseCase, ISetStrikerUseCase } from "app/repositories/interfaces/usecases/IMatchesUseCaseRepo";

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

export interface ScoreUpdatePayload {
    matchId: string;
    type: string;
    [key: string]: any;
}

export class SocketManager {
    private io!: Server;

    constructor(
        private setStrikerUseCase: ISetStrikerUseCase,
        private setNonStrikerUseCase: ISetNonStrikerUseCase,
        private setBowlerUseCase: ISetBowlerUseCase,
        private initInningsUseCase: IInitInningsUseCase,
        private addRunsUseCase: IAddRunsUseCase,
        private addWicketUseCase: IAddWicketUseCase
    ) { }

    public init(server: http.Server) {
        this.io = new Server(server, { 
            cors: { 
                origin: process.env.FRONTEND_URL || "*",
                credentials: true 
            }
        });

        // Auth middleware
        this.io.use((socket, next) => authenticateSocket(socket as AuthenticatedSocket, next));

        this.io.on("connection", (socket: Socket) => this.handleConnection(socket));

        return this.io;
    }

    private handleConnection(socket: Socket) {
        const authSocket = socket as AuthenticatedSocket;

        console.log(`Socket Connected: ${authSocket.id} | User: ${authSocket.user.firstName}`);

        let currentChatId: string | null = null;
        let currentMatchId: string | null = null;

        // --- Chat Handlers ---
        authSocket.on("join-room", ({ chatId }: { chatId: string }) => {
            if (currentChatId) authSocket.leave(currentChatId);
            authSocket.join(chatId);
            currentChatId = chatId;
        });

        authSocket.on("send-message", async ({ chatId, text, clientId, profileImage }: { chatId: string; text: string; clientId: string; profileImage?: string }) => {
            try {
                const savedMessage = await MessageModel.create({
                    chatId: new Types.ObjectId(chatId),
                    senderId: new Types.ObjectId(authSocket.user._id),
                    text,
                    status: "sent",
                    clientId,
                });

                const messageToSend = {
                    id: (savedMessage._id as Types.ObjectId).toString(),
                    chatId,
                    senderId: authSocket.user._id,
                    senderName: `${authSocket.user.firstName} ${authSocket.user.lastName}`,
                    text,
                    createdAt: savedMessage.createdAt,
                    status: "sent" as const,
                    clientId,
                    profileImage: profileImage || ""
                };

                this.io.to(chatId).emit("receive-message", messageToSend);
            } catch (err) {
                console.error(err);
                authSocket.emit("message-error", { clientId, error: "Failed to send message" });
            }
        });

        authSocket.on("typing", ({ chatId, typing }: { chatId: string; typing: boolean }) => {
            authSocket.to(chatId).emit("typing", {
                user: { id: authSocket.user._id, name: `${authSocket.user.firstName} ${authSocket.user.lastName}` },
                typing
            });
        });

        // --- Match Handlers ---
        authSocket.on("join-match", ({ matchId }: { matchId: string }) => {
            if (currentMatchId && currentMatchId !== matchId) {
                authSocket.leave(currentMatchId);
            }
            authSocket.join(matchId);
            currentMatchId = matchId;
            authSocket.emit("match-joined", { matchId, success: true });
        });

        authSocket.on("leave-match", ({ matchId }: { matchId: string }) => {
            authSocket.leave(matchId);
            if (currentMatchId === matchId) {
                currentMatchId = null;
            }
        });

        authSocket.on("score:update", async (payload: ScoreUpdatePayload) => {
            try {
                const { matchId, type } = payload;
                let updatedMatch: TournamentMatchStatsDocument | null = null;

                switch (type) {
                    case "SET_STRIKER":
                        updatedMatch = await this.setStrikerUseCase.execute(matchId, payload.batsmanId);
                        authSocket.emit("player-update-ack", { type, success: true });
                        break;
                    case "SET_NON_STRIKER":
                        updatedMatch = await this.setNonStrikerUseCase.execute(matchId, payload.batsmanId);
                        authSocket.emit("player-update-ack", { type, success: true });
                        break;
                    case "SET_BOWLER":
                        updatedMatch = await this.setBowlerUseCase.execute(matchId, payload.bowlerId);
                        authSocket.emit("player-update-ack", { type, success: true });
                        break;
                    case "INIT_INNINGS_READY":
                        updatedMatch = await this.initInningsUseCase.execute(matchId);
                        break;
                    case "RUNS":
                        updatedMatch = await this.addRunsUseCase.execute({ matchId, runs: payload.runs });
                        break;
                    case "WICKET":
                        updatedMatch = await this.addWicketUseCase.execute({
                            matchId,
                            dismissalType: payload.dismissalType,
                            outBatsmanId: payload.outBatsmanId,
                            nextBatsmanId: payload.nextBatsmanId,
                            fielderId: payload.fielderId || null
                        });
                        break;
                    default:
                        console.log("Unknown score update type:", type);
                        authSocket.emit("score-error", { error: "Unknown update type" });
                        return;
                }

                // Send acknowledgment
                authSocket.emit("score-update-ack", { type, matchId, success: true });

                if (["SET_STRIKER", "SET_NON_STRIKER", "SET_BOWLER"].includes(type) && updatedMatch) {
                    const innings = updatedMatch.currentInnings === 1 ? updatedMatch.innings1 : updatedMatch.innings2;
                    this.io.to(matchId).emit("player-change", {
                        matchId,
                        type,
                        currentInnings: updatedMatch.currentInnings,
                        currentStriker: innings?.currentStriker?.toString(),
                        currentNonStriker: innings?.currentNonStriker?.toString(),
                        currentBowler: innings?.currentBowler?.toString()
                    });
                    return;
                }

                if (!updatedMatch) {
                    updatedMatch = await TournamentMatchStatsModel.findOne({ 
                        matchId: new Types.ObjectId(matchId) 
                    });
                    if (!updatedMatch) {
                        authSocket.emit("score-error", { error: "Match not found" });
                        return;
                    }
                }

                const liveScorePayload = this.buildLiveScorePayload(updatedMatch);
                this.io.to(matchId).emit("live-score:update", { 
                    matchId, 
                    liveScore: liveScorePayload 
                });

            } catch (err) {
                console.error("Score Update Error:", err);
                authSocket.emit("score-error", { error: err.message || "Failed to update score" });
            }
        });

        authSocket.on("disconnect", () => {
            if (currentChatId) {
                this.io.to(currentChatId).emit("typing", {
                    user: { id: authSocket.user._id, name: `${authSocket.user.firstName} ${authSocket.user.lastName}` },
                    typing: false
                });
            }
            console.log(`User disconnected: ${authSocket.user.firstName}`);
        });
    }

    private buildLiveScorePayload(match: TournamentMatchStatsDocument) {
        const convertArrayToObject = (array: any[]): Record<string, any> => {
            return array.reduce((acc: Record<string, any>, item: any) => {
                const key = item.playerId?.toString() || item._id?.toString();
                if (key) acc[key] = item;
                return acc;
            }, {});
        };

        const buildInningsPayload = (innings: any) => {
            if (!innings) return null;
            
            const totalBalls = innings.balls || 0;
            const overs = Math.floor(totalBalls / 6);
            const ballsInOver = totalBalls % 6;
            
            return {
                score: innings.runs || 0,
                wickets: innings.wickets || 0,
                overs: overs + (ballsInOver / 10),
                ballsInOver,
                currentBatsmanId: innings.currentStriker?.toString() || null,
                nonStrikerId: innings.currentNonStriker?.toString() || null,
                currentBowlerId: innings.currentBowler?.toString() || null,
                battingStats: convertArrayToObject(innings.batsmen || []),
                bowlingStats: convertArrayToObject(innings.bowlers || []),
                battingTeamId: innings.battingTeam?.toString() || '',
                bowlingTeamId: innings.bowlingTeam?.toString() || '',
                isCompleted: innings.isCompleted || false
            };
        };

        const innings1 = buildInningsPayload(match.innings1);
        const innings2 = buildInningsPayload(match.innings2);
        
        // Calculate run rates
        const calculateCurrentRunRate = (innings: any) => {
            if (!innings || innings.balls === 0) return 0;
            return (innings.runs || 0) / (innings.balls / 6);
        };

        const calculateRequiredRuns = () => {
            if (match.currentInnings !== 2) return 0;
            if (!match.innings1 || !match.innings2) return 0;
            return Math.max(0, ((match.innings1.runs || 0) + 1) - (match.innings2.runs || 0));
        };

        const calculateRequiredRunRate = () => {
            if (match.currentInnings !== 2 || !match.innings2) return 0;
            const remainingRuns = calculateRequiredRuns();
            const remainingBalls = (match.overs * 6) - (match.innings2.balls || 0);
            if (remainingBalls <= 0) return 0;
            return remainingRuns / (remainingBalls / 6);
        };

        return {
            matchId: match.matchId.toString(),
            currentInnings: match.currentInnings || 1,
            overs: match.overs || 50,
            isLive: match.isLive || false,
            innings1,
            innings2,
            requiredRuns: calculateRequiredRuns(),
            target: (match.innings1?.runs || 0) + 1,
            currentRunRate: calculateCurrentRunRate(match.currentInnings === 1 ? match.innings1 : match.innings2),
            requiredRunRate: calculateRequiredRunRate()
        };
    }

    public getIO() {
        if (!this.io) throw new Error("Socket.io not initialized");
        return this.io;
    }
}