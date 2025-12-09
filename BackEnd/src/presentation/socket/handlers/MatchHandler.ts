import { Server } from "socket.io";
import { Types } from "mongoose";
import { AuthenticatedSocket } from "../SocketServer";

import { IncomingScoreUpdatePayload, ScoreUpdateType } from "domain/types/match.types";
import { IMatchRepo } from "app/repositories/interfaces/manager/IMatchStatsRepo";

import {
    IAddExtrasUseCase,
    IAddPenaltyUseCase,
    IAddRunsUseCase,
    IAddWicketUseCase,
    IEndInningsUseCase,
    IEndOverUseCase,
    IInitInningsUseCase,
    IRetireBatsmanUseCase,
    ISetBowlerUseCase,
    ISetNonStrikerUseCase,
    ISetStrikerUseCase,
    IStartSuperOverUseCase,
    IUndoLastBallUseCase

} from "app/repositories/interfaces/usecases/IMatchesUseCaseRepo";
import { NotFoundError } from "domain/errors";
import { DismissalType } from "domain/entities/Innings";

export interface MatchUseCases {
    setStriker: ISetStrikerUseCase;
    setNonStriker: ISetNonStrikerUseCase;
    setBowler: ISetBowlerUseCase;
    initInnings: IInitInningsUseCase;
    addRuns: IAddRunsUseCase;
    addWicket: IAddWicketUseCase;
    addExtras: IAddExtrasUseCase;
    undoLastBall: IUndoLastBallUseCase;
    startSuperOver: IStartSuperOverUseCase;
    endOver: IEndOverUseCase;
    endInnings: IEndInningsUseCase;
    addPenalty: IAddPenaltyUseCase;
    retireBatsman: IRetireBatsmanUseCase;
}

export class MatchHandler {
    private currentMatchId: string | null = null;

    constructor(
        private io: Server,
        private socket: AuthenticatedSocket,
        private useCases: MatchUseCases,
        private matchRepo: IMatchRepo
    ) {
        this.setupEvents();
    }

    private setupEvents() {
        this.socket.on("join-match", this.joinMatch.bind(this));
        this.socket.on("leave-match", this.leaveMatch.bind(this));
        this.socket.on("score:update", this.handleScoreUpdate.bind(this));
    }

    private joinMatch({ matchId }: { matchId: string }) {
        if (this.currentMatchId && this.currentMatchId !== matchId) {
            this.socket.leave(this.currentMatchId);
        }
        this.socket.join(matchId);
        this.currentMatchId = matchId;
        this.socket.emit("match-joined", { matchId, success: true });
        console.log(`Socket ${this.socket.id} joined match ${matchId}`);
    }

    private leaveMatch({ matchId }: { matchId: string }) {
        this.socket.leave(matchId);
        if (this.currentMatchId === matchId) {
            this.currentMatchId = null;
        }
    }

    private async handleScoreUpdate(payloadRaw: IncomingScoreUpdatePayload) {
        try {

            // console.log('Received payload:', JSON.stringify(payloadRaw, null, 2));

            const matchId = this.toIdString(payloadRaw.matchId) ?? "";
            const type = (payloadRaw.type as ScoreUpdateType) ?? "RUNS";

            if (!matchId) throw new NotFoundError("Match ID is required");

            switch (type) {
                case "SET_STRIKER": {
                    const batsmanId = this.toIdString(payloadRaw.batsmanId);
                    if (!batsmanId) throw new NotFoundError("Batsman ID required");
                    await this.useCases.setStriker.execute(matchId, batsmanId);
                    break;
                }
                case "SET_NON_STRIKER": {
                    const batsmanId = this.toIdString(payloadRaw.batsmanId);
                    if (!batsmanId) throw new NotFoundError("Batsman ID required");
                    await this.useCases.setNonStriker.execute(matchId, batsmanId);
                    break;
                }
                case "SET_BOWLER": {
                    const bowlerId = this.toIdString(payloadRaw.bowlerId);
                    if (!bowlerId) throw new NotFoundError("Bowler ID required");
                    await this.useCases.setBowler.execute(matchId, bowlerId);
                    break;
                }
                case "INIT_INNINGS": {
                    const oversLimit = this.toFiniteNumber(payloadRaw.oversLimit, 20);
                    const strikerId = this.toIdString(payloadRaw.strikerId);
                    const nonStrikerId = this.toIdString(payloadRaw.nonStrikerId);
                    const bowlerId = this.toIdString(payloadRaw.bowlerId);

                    const battingTeamId = this.toIdString(payloadRaw.battingTeamId);
                    const bowlingTeamId = this.toIdString(payloadRaw.bowlingTeamId);

                    if (!strikerId || !nonStrikerId || !bowlerId || !battingTeamId || !bowlingTeamId) {
                        throw new Error("Missing players or teams for Init Innings");
                    }

                    await this.useCases.initInnings.execute({
                        matchId,
                        oversLimit,
                        strikerId,
                        nonStrikerId,
                        bowlerId,
                        battingTeamId,
                        bowlingTeamId
                    });
                    break;
                }
                case "RUNS": {
                    const runs = this.toFiniteNumber(payloadRaw.runs, 0);
                    await this.useCases.addRuns.execute({ matchId, runs });
                    break;
                }
                case "EXTRA": {
                    const extraType = payloadRaw.extraType as string | undefined;
                    const runs = this.toFiniteNumber(payloadRaw.extraRuns, 0);

                    if (!extraType) throw new NotFoundError("extraType required");

                    await this.useCases.addExtras.execute({ matchId, type: extraType, runs });
                    break;
                }
                case "WICKET": {
                    const dismissalType = payloadRaw.dismissalType as DismissalType;
                    const outBatsmanId = this.toIdString(payloadRaw.outBatsmanId);
                    const nextBatsmanId = this.toIdString(payloadRaw.nextBatsmanId);
                    const fielderId = this.toIdString(payloadRaw.fielderId) ?? undefined;
                    const bowlerId = this.toIdString(payloadRaw.bowlerId) ?? null;
                    const isLegalBall = this.toIdString(payloadRaw.isLegalBall) as unknown as boolean;

                    if (!outBatsmanId || !nextBatsmanId) throw new NotFoundError("Missing wicket player IDs");

                    await this.useCases.addWicket.execute({
                        matchId,
                        dismissalType,
                        outBatsmanId,
                        nextBatsmanId,
                        fielderId,
                        bowlerId,
                        isLegalBall
                    });
                    break;
                }
                case "PENALTY": {
                    const runs = this.toFiniteNumber(payloadRaw.runs, 5);
                    await this.useCases.addPenalty.execute(matchId, runs);
                    break;
                }
                case "RETIRE": {
                    const outBatsmanId = this.toIdString(payloadRaw.outBatsmanId);
                    const newBatsmanId = this.toIdString(payloadRaw.newBatsmanId);
                    const isRetiredHurt = !!payloadRaw.isRetiredHurt;

                    if (!outBatsmanId || !newBatsmanId) throw new Error("Missing IDs for retirement");

                    await this.useCases.retireBatsman.execute(
                        matchId, outBatsmanId, newBatsmanId, isRetiredHurt
                    );
                    break;
                }
                case "END_OVER": {
                    await this.useCases.endOver.execute(matchId);
                    break;
                }
                case "END_INNINGS": {
                    await this.useCases.endInnings.execute(matchId);
                    break;
                }
                case "UNDO": {
                    await this.useCases.undoLastBall.execute(matchId);
                    break;
                }
                case "START_SUPER_OVER": {
                    await this.useCases.startSuperOver.execute(matchId);
                    break;
                }
                default:
                    console.warn("Unknown score update type:", type);
                    this.socket.emit("score-error", { error: "Unknown update type" });
                    return;
            }

            this.socket.emit("score-update-ack", { type, matchId, success: true });

            const updatedMatchEntity = await this.matchRepo.findByMatchId(matchId);

            
            if (!updatedMatchEntity) {
                this.socket.emit("score-error", { error: "Match not found after update" });
                return;
            }
            
            const liveScoreDto = updatedMatchEntity.toDTO();
            
            // console.log('Sending liveScore:', JSON.stringify(liveScoreDto, null, 2));
            
            this.io.to(matchId).emit("live-score:update", {
                matchId,
                liveScore: liveScoreDto
            });

            if (["SET_STRIKER", "SET_NON_STRIKER", "SET_BOWLER"].includes(type)) {
                this.io.to(matchId).emit("player-change", {
                    matchId,
                    type,
                    currentStriker: liveScoreDto.currentContext.striker,
                    currentNonStriker: liveScoreDto.currentContext.nonStriker,
                    currentBowler: liveScoreDto.currentContext.bowler
                });
            }

        } catch (err: unknown) {
            console.error("Score Update Error:", err);
            const errorMessage = err instanceof Error ? err.message : "Failed to update score";
            this.socket.emit("score-error", { error: errorMessage });
        }
    }

    private toIdString(v: unknown): string | null {
        if (!v && v !== 0) return null;
        if (typeof v === "string") return v;
        if (v instanceof Types.ObjectId) return v.toString();
        if (typeof v === "number") return String(v);
        return null;
    }

    private toFiniteNumber(v: unknown, fallback = 0): number {
        if (typeof v === "number" && Number.isFinite(v)) return v;
        if (typeof v === "string" && v.trim() !== "") {
            const n = Number(v);
            return Number.isFinite(n) ? n : fallback;
        }
        return fallback;
    }
}