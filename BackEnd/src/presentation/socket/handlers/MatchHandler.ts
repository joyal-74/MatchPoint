import { Server } from "socket.io";
import { Types } from "mongoose";
import { AuthenticatedSocket } from "../SocketServer";

import { IncomingScoreUpdatePayload, ScoreUpdateType, } from "../../../domain/types/match.types"; 
import { IMatchStatsRepo } from "../../../app/repositories/interfaces/manager/IMatchStatsRepo"; 

import {
    IAddExtrasUseCase,
    IAddPenaltyUseCase,
    IAddRunsUseCase,
    IAddWicketUseCase,
    IEndInningsUseCase,
    IEndMatchUseCase,
    IEndOverUseCase,
    IInitInningsUseCase,
    IRetireBatsmanUseCase,
    ISetBowlerUseCase,
    ISetNonStrikerUseCase,
    ISetStrikerUseCase,
    IStartSuperOverUseCase,
    IUndoLastBallUseCase

} from "../../../app/repositories/interfaces/usecases/IMatchesUseCaseRepo.js";
import { NotFoundError } from "../../../domain/errors/index"; 
import { DismissalType } from "../../../domain/entities/Innings";
import { IPlayerRepository } from "../../../app/repositories/interfaces/player/IPlayerRepository";
import { DI_TOKENS } from "../../../domain/constants/Identifiers";
import { inject, injectable } from "tsyringe";

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
    endMatch: IEndMatchUseCase
}

@injectable()
export class MatchHandler {
    private currentMatchId: string | null = null;
    private playerCache: Map<string, string> = new Map();

    constructor(
        private io: Server,
        private socket: AuthenticatedSocket,
        private useCases: MatchUseCases,
        @inject(DI_TOKENS.MatchStatsRepository) private matchRepo: IMatchStatsRepo,
        @inject(DI_TOKENS.PlayerRepository) private playerRepo: IPlayerRepository
    ) {
        this.setupEvents();
    }

    private setupEvents() {
        this.socket.on("join-match", this.joinMatch.bind(this));
        this.socket.on("leave-match", this.leaveMatch.bind(this));
        this.socket.on("score:update", this.handleScoreUpdate.bind(this));
        this.socket.on("match:end", this.handleMatchEnd.bind(this));
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

    private generateCommentary(type: string, payloadRaw: IncomingScoreUpdatePayload): string {
        const runs = payloadRaw.runs || 0;
        const extraType = payloadRaw.extraType;

        if (extraType) {
            switch (extraType.toUpperCase()) {
                case "WIDE": return `${runs === 2 ? '2' : ''}Wide! Ball down the leg side${runs > 1 ? `, ${runs} runs` : ''}`;
                case "NO_BALL": return `No ball! ${runs > 1 ? `${runs} runs` : 'Free hit coming up'}`;
                case "LEG_BYE": return `Leg bye! ${runs === 4 ? 'FOUR' : runs === 6 ? 'SIX' : runs} run${runs > 1 ? 's' : ''} taken`;
                case "BYE": return `Bye! ${runs === 4 ? 'FOUR' : runs === 6 ? 'SIX' : runs} run${runs > 1 ? 's' : ''} taken`;
                default: return `Extra runs! ${runs} run${runs > 1 ? 's' : ''}`;
            }
        }

        switch (runs) {
            case 0: {
                const descriptions = ["defended solidly", "blocked back to the bowler", "played to mid-wicket", "tapped to point", "left alone outside off", "inside edge onto pad", "played and missed", "beaten outside off"];
                return descriptions[Math.floor(Math.random() * descriptions.length)]
            };
            case 1: return "Single taken, easy run";
            case 2: return "Two runs, good running between the wickets";
            case 3: return "Three runs! Excellent placement";
            case 4: {
                const fours = ["FOUR! Crunched through covers", "FOUR! Elegant drive down the ground", "FOUR! Glided past third man", "FOUR! Pulled away to square leg", "FOUR! Edged and it runs away", "FOUR! Cuts behind point"];
                return fours[Math.floor(Math.random() * fours.length)]
            };
            case 6: {
                const sixes = ["SIX! Massive hit into the crowd", "SIX! Clean strike over long-on", "SIX! Deposited over mid-wicket", "SIX! High and handsome over extra cover", "SIX! Flat over square leg", "SIX! Skied but clears the rope"];
                return sixes[Math.floor(Math.random() * sixes.length)]
            };
            default: return `${runs} runs scored`;
        }
    }

    private async generateWicketCommentary(payloadRaw: IncomingScoreUpdatePayload): Promise<string> {
        const dismissalType = payloadRaw.dismissalType as DismissalType;
        const bowlerId = this.toIdString(payloadRaw.bowlerId);
        const outBatsmanId = this.toIdString(payloadRaw.outBatsmanId);
        const fielderId = this.toIdString(payloadRaw.fielderId);

        let bowlerName = "the bowler";
        let batsmanName = "the batsman";
        let fielderName = "the fielder";

        try {
            // Get player names from cache or database
            if (bowlerId) {
                bowlerName = await this.getPlayerName(bowlerId);
            }
            if (outBatsmanId) {
                batsmanName = await this.getPlayerName(outBatsmanId);
            }
            if (fielderId) {
                fielderName = await this.getPlayerName(fielderId);
            }
        } catch (error) {
            console.error("Error fetching player names:", error);
        }

        switch (dismissalType) {
            case "bowled": {
                const bowledDescriptions = [
                    `Clean bowled! ${bowlerName} castles ${batsmanName}`,
                    `Bowled him! ${batsmanName} completely beaten`,
                    `Timber! ${bowlerName} knocks the stumps over`,
                    `Middle stump out of the ground! ${bowlerName} with a beauty`,
                    `Bowled! ${batsmanName} plays all around it`
                ];
                return bowledDescriptions[Math.floor(Math.random() * bowledDescriptions.length)];
            }

            case "caught": {
                const caughtDescriptions = [
                    `Caught! ${batsmanName} edges to ${fielderName}`,
                    `Great catch! ${fielderName} takes it comfortably`,
                    `Caught at slip! ${batsmanName} goes fishing`,
                    `Brilliant catch! ${fielderName} dives to take it`,
                    `Caught in the deep! ${batsmanName} holes out`,
                    `Edge and taken! ${fielderName} makes no mistake`
                ];
                return caughtDescriptions[Math.floor(Math.random() * caughtDescriptions.length)];
            }

            case "lbw": {
                const lbwDescriptions = [
                    `LBW! Plumb in front, ${bowlerName} appeals and gets it`,
                    `LBW! ${batsmanName} trapped on the back foot`,
                    `Given out LBW! ${bowlerName} strikes`,
                    `Leg before wicket! ${batsmanName} misses the line`,
                    `LBW! Hits him in line, that's out`
                ];
                return lbwDescriptions[Math.floor(Math.random() * lbwDescriptions.length)];
            }

            case "run-out": {
                const runoutDescriptions = [
                    `Run out! ${batsmanName} caught short`,
                    `Direct hit! ${batsmanName} is well short`,
                    `Run out! Mix-up in the middle costs ${batsmanName}`,
                    `Brilliant fielding! ${fielderName} with the run out`,
                    `Run out at the bowler's end! ${batsmanName} sent back`
                ];
                return runoutDescriptions[Math.floor(Math.random() * runoutDescriptions.length)];
            }

            case "stumped":
                return `Stumped! ${batsmanName} dances down and misses`;

            case "hit-wicket":
                return `Hit wicket! ${batsmanName} dislodges the bails`;

            case "retired-hurt":
                return `${batsmanName} retires hurt, hope it's not serious`;

            case "retired-out":
                return `${batsmanName} retires out`;

            case "timed-out":
                return `Timed out! ${batsmanName} took too long to arrive`;

            case "obstructing-field":
                return `Obstructing the field! ${batsmanName} is out`;

            case "hit-ball-twice":
                return `Hit ball twice! ${batsmanName} is out`;

            default:
                return `Wicket! ${batsmanName} dismissed`;
        }
    }

    private async getPlayerName(playerId: string): Promise<string> {

        const cachedName = this.playerCache.get(playerId);
        if (cachedName) {
            return cachedName;
        }

        try {
            // Fetch from repository
            const player = await this.playerRepo.findById(playerId);
            if (player && player.firstName) {
                const name = `${player.firstName} ${player.lastName}`
                this.playerCache.set(playerId, name);
                return name;
            }
            return "the player";
        } catch (error) {
            console.error("Error fetching player:", error);
            return "the player";
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
                    const isLegalBall = Boolean(payloadRaw.isLegalBall);
                    const runsCompleted = this.toFiniteNumber(payloadRaw.runs, 0);

                    if (!outBatsmanId || !nextBatsmanId) throw new NotFoundError("Missing wicket player IDs");

                    await this.useCases.addWicket.execute({
                        matchId,
                        dismissalType,
                        outBatsmanId,
                        nextBatsmanId,
                        fielderId,
                        bowlerId,
                        isLegalBall,
                        runsCompleted
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


            this.io.to(`viewer-match-${matchId}`).emit("match:update", {
                matchId,
                liveScore: liveScoreDto,
                timestamp: new Date().toISOString(),
                updateType: type // "RUNS", "WICKET", etc.
            });

            // Also send detailed commentary events
            if (type === "RUNS") {
                const commentary = this.generateCommentary(type, payloadRaw);
                this.io.to(`commentary-match-${matchId}`).emit("commentary", {
                    matchId,
                    text: commentary,
                    type: "RUNS"
                });
            }

            if (type === "WICKET") {
                const commentary = await this.generateWicketCommentary(payloadRaw);
                this.io.to(`commentary-match-${matchId}`).emit("commentary", {
                    matchId,
                    text: commentary,
                    type: "WICKET",
                    isHighlight: true
                });
            }

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

    private async handleMatchEnd(payload: { matchId: string; type: "NORMAL" | "ABANDONED" | "NO_RESULT", reason: "RAIN" | "BAD_LIGHT" | "FORCE_END" | "OTHER"; }) {

        try {
            const matchId = this.toIdString(payload.matchId);

            if (!matchId) throw new Error("Match ID required");

            const userId = this.socket.user?._id;
            if (!userId) throw new Error("Unauthorized");


            const updatedMatch = await this.useCases.endMatch.execute({
                matchId,
                type: payload.type,
                reason: payload.reason,
                endedBy: userId
            });

            console.log('hello')

            console.log(updatedMatch, 'updated')


            this.io.to(matchId).emit("match:ended", {
                matchId,
                status: "completed",
                endInfo: updatedMatch.endInfo
            });

            console.log(`Match ${matchId} ended due to ${payload.reason}`);
        } catch (err) {
            console.error("MATCH END ERROR ❌", err);
            const message = err instanceof Error ? err.message : "Failed to end match";
            this.socket.emit("match-end-error", { error: message });

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
