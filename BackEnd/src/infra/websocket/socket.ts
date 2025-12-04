import { Server, Socket } from "socket.io";
import http from "http";
import { Types } from "mongoose";
import { MessageModel } from "infra/databases/mongo/models/MessageModel";
import { authenticateSocket } from "presentation/express/middlewares/socketAuth";
import { TournamentMatchStatsDocument } from "infra/databases/mongo/models/TournamentMatchStatsModel";
import { IAddRunsUseCase, IAddWicketUseCase, IInitInningsUseCase, ISetBowlerUseCase, ISetNonStrikerUseCase, ISetStrikerUseCase } from "app/repositories/interfaces/usecases/IMatchesUseCaseRepo";

// Define authenticated socket
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
        this.io = new Server(server, { cors: { origin: "*" } });

        // Auth middleware
        this.io.use((socket, next) => authenticateSocket(socket as AuthenticatedSocket, next));

        this.io.on("connection", (socket: Socket) => this.handleConnection(socket));

        return this.io;
    }

    private handleConnection(socket: Socket) {
        const authSocket = socket as AuthenticatedSocket;

        console.log(`🔌 Socket Connected: ${authSocket.id} | User: ${authSocket.user.firstName} ${authSocket.user.lastName}`);

        let currentChatId: string | null = null;

        // --- Chat Handlers ---
        authSocket.on("join-room", ({ chatId }: { chatId: string }) => {
            if (currentChatId) authSocket.leave(currentChatId);
            authSocket.join(chatId);
            currentChatId = chatId;
            console.log(`👤 ${authSocket.user.firstName} joined room ${chatId}`);
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

        authSocket.on("disconnect", () => {
            if (currentChatId) {
                this.io.to(currentChatId).emit("typing", {
                    user: { id: authSocket.user._id, name: `${authSocket.user.firstName} ${authSocket.user.lastName}` },
                    typing: false
                });
            }
            console.log(`❌ User disconnected: ${authSocket.user.firstName}`);
        });

        // --- Match Handlers ---
        authSocket.on("join-match", ({ matchId }: { matchId: string }) => {
            authSocket.join(matchId);
            console.log(`🏏 User joined match room: ${matchId}`);
        });

        authSocket.on("score:update", async (payload) => {
            console.log("score:update received:", payload);
            try {
                const { matchId, type } = payload;
                let updatedMatch: TournamentMatchStatsDocument | null = null;
                let shouldEmitScoreUpdate = true;

                switch (type) {
                    case "SET_STRIKER":
                        updatedMatch = await this.setStrikerUseCase.execute(matchId, payload.batsmanId);
                        shouldEmitScoreUpdate = false;
                        break;
                    case "SET_NON_STRIKER":
                        updatedMatch = await this.setNonStrikerUseCase.execute(matchId, payload.batsmanId);
                        shouldEmitScoreUpdate = false;
                        break;
                    case "SET_BOWLER":
                        updatedMatch = await this.setBowlerUseCase.execute(matchId, payload.bowlerId);
                        shouldEmitScoreUpdate = false;
                        break;
                    case "INIT_INNINGS_READY":
                        updatedMatch = await this.initInningsUseCase.execute(matchId);
                        shouldEmitScoreUpdate = true;
                        break;
                    case "RUNS":
                        updatedMatch = await this.addRunsUseCase.execute({ matchId, runs: payload.runs });
                        shouldEmitScoreUpdate = true;
                        break;
                    case "WICKET":
                        updatedMatch = await this.addWicketUseCase.execute({
                            matchId,
                            dismissalType: payload.dismissalType,
                            outBatsmanId: payload.outBatsmanId,
                            nextBatsmanId: payload.nextBatsmanId,
                            fielderId: payload.fielderId || null
                        });
                        shouldEmitScoreUpdate = true;
                        break;
                    default:
                        console.log("Unknown score update type:", type);
                }

                if (updatedMatch && shouldEmitScoreUpdate) {

                    // ⚠️ MAPPING THE FULL DOCUMENT TO THE LiveScoreState STRUCTURE
                    const liveScorePayload = {
                        // --- Top-Level Fields ---
                        matchId: updatedMatch.matchId.toString(),
                        currentInnings: updatedMatch.currentInnings,
                        overs: updatedMatch.overs,
                        isLive: updatedMatch.isLive,
                        // (Note: Run Rate is calculated on the frontend, usually not stored here)

                        // --- Innings 1 Mapping ---
                        innings1: {
                            runs: updatedMatch.innings1.runs,
                            balls: updatedMatch.innings1.balls,
                            wickets: updatedMatch.innings1.wickets,
                            overs: Math.floor(updatedMatch.innings1.balls / 6) + (updatedMatch.innings1.balls % 6) / 10, // Assuming balls need converting to overs format (X.Y)
                            ballsInOver: updatedMatch.innings1.balls % 6, // New field for clarity (if needed)

                            // Player IDs (Note: toString() is crucial for consistency with frontend string IDs)
                            currentBatsmanId: updatedMatch.innings1.currentStriker ? updatedMatch.innings1.currentStriker.toString() : null,
                            nonStrikerId: updatedMatch.innings1.currentNonStriker ? updatedMatch.innings1.currentNonStriker.toString() : null,
                            currentBowlerId: updatedMatch.innings1.currentBowler ? updatedMatch.innings1.currentBowler.toString() : null,

                            // Batting & Bowling Stats (If they are embedded in the match document)
                            battingStats: updatedMatch.innings1.batsmen || [], // Replace with actual field name if different
                            bowlingStats: updatedMatch.innings1.bowlers || [], // Replace with actual field name if different

                            // Add other required Innings-specific fields here (e.g., battingTeamId, bowlingTeamId, status)
                            battingTeamId: updatedMatch.innings1.battingTeamId ? updatedMatch.innings1.battingTeamId.toString() : null,
                            bowlingTeamId: updatedMatch.innings1.bowlingTeamId ? updatedMatch.innings1.bowlingTeamId.toString() : null,

                        },

                        // --- Innings 2 Mapping ---
                        innings2: {
                            runs: updatedMatch.innings2.runs,
                            balls: updatedMatch.innings2.balls,
                            wickets: updatedMatch.innings2.wickets,
                            overs: Math.floor(updatedMatch.innings2.balls / 6) + (updatedMatch.innings2.balls % 6) / 10,
                            ballsInOver: updatedMatch.innings2.balls % 6,

                            // Player IDs
                            currentBatsmanId: updatedMatch.innings2.currentStriker ? updatedMatch.innings2.currentStriker.toString() : null,
                            nonStrikerId: updatedMatch.innings2.currentNonStriker ? updatedMatch.innings2.currentNonStriker.toString() : null,
                            currentBowlerId: updatedMatch.innings2.currentBowler ? updatedMatch.innings2.currentBowler.toString() : null,

                            // Batting & Bowling Stats
                            battingStats: updatedMatch.innings2.batsmen || [],
                            bowlingStats: updatedMatch.innings2.bowlers || [],

                            // Add other required Innings-specific fields here
                            battingTeamId: updatedMatch.innings2.battingTeamId ? updatedMatch.innings2.battingTeamId.toString() : null,
                            bowlingTeamId: updatedMatch.innings2.bowlingTeamId ? updatedMatch.innings2.bowlingTeamId.toString() : null,
                        }
                    };

                    this.io.to(matchId).emit("live-score:update", {
                        matchId,
                        liveScore: liveScorePayload,
                        updatedAt: new Date()
                    });
                }

            } catch (err) {
                console.error("Score Update Error:", err);
                authSocket.emit("score-error", { error: "Failed to update score" });
            }
        });
    }

    public getIO() {
        if (!this.io) throw new Error("Socket.io not initialized");
        return this.io;
    }
}
