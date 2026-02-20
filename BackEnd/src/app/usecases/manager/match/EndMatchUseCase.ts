import { inject, injectable } from "tsyringe";
import { DI_TOKENS } from "../../../../domain/constants/Identifiers.js";
import { EndMatchUseCaseInput, IEndMatchUseCase } from "../../../repositories/interfaces/usecases/IMatchesUseCaseRepo.js";
import { IMatchesRepository } from "../../../repositories/interfaces/manager/IMatchesRepository.js";
import { IMatchStatsRepo } from "../../../repositories/interfaces/manager/IMatchStatsRepo.js";
import { IPlayerRepository } from "../../../repositories/interfaces/player/IPlayerRepository.js";
import { MatchEntity } from "../../../../domain/entities/MatchEntity.js";
import { Types } from "mongoose";

@injectable()
export class EndMatchUseCase implements IEndMatchUseCase {
    constructor(
        @inject(DI_TOKENS.MatchesRepository) private _matchesRepo: IMatchesRepository,
        @inject(DI_TOKENS.MatchStatsRepository) private _matchStatsRepo: IMatchStatsRepo,
        @inject(DI_TOKENS.PlayerRepository) private _playerRepo: IPlayerRepository,
    ) { }

    /**
     * CLEANER UTILITY: Physically removes keys with empty strings or invalid values.
     * This prevents Mongoose from attempting to cast "" to an ObjectId.
     */
    private sanitizeForMongo(obj: any): any {
        const cleaned: any = {};
        Object.keys(obj).forEach((key) => {
            const value = obj[key];
            // If the value is an empty string, null string, or undefined, nuke it
            if (value === "" || value === "undefined" || value === "null" || value === undefined) {
                return; 
            }
            // Recursively clean nested objects (like endInfo)
            if (value !== null && typeof value === 'object' && !(value instanceof Date) && !(value instanceof Types.ObjectId)) {
                cleaned[key] = this.sanitizeForMongo(value);
            } else {
                cleaned[key] = value;
            }
        });
        return cleaned;
    }

    private isValidId(id: any): id is string | Types.ObjectId {
        if (!id || id === "" || id === "undefined" || id === "null") return false;
        return Types.ObjectId.isValid(id);
    }

    async execute(input: EndMatchUseCaseInput): Promise<MatchEntity> {
        const { matchId, reason, resultData, endedBy } = input;

        // CRITICAL: Prevent the very first findById call from crashing if matchId is empty
        if (!this.isValidId(matchId)) {
            throw new Error(`Invalid Match ID provided: "${matchId}"`);

        }
        console.log(input)

        const resultDescription = this.generateResultDescription(reason, resultData);

        // Prepare the raw update object
        const rawUpdate = {
            status: 'completed',
            reason: reason,
            endedBy: endedBy,
            winner: this.isValidId(resultData?.winnerId) ? resultData.winnerId.toString() : undefined,
            resultType: resultData?.resultType,
            winMargin: resultData?.margin,
            winType: resultData?.winType,
            resultDescription,
            endInfo: {
                type: input.type,
                reason: reason,
                notes: resultData?.notes,
                endedBy: this.isValidId(endedBy) ? endedBy.toString() : undefined,
                endedAt: new Date()
            }
        };

        // Nuke all keys with empty strings so Mongoose doesn't see them
        const sanitizedData = this.sanitizeForMongo(rawUpdate);

        const updatedMatch = await this._matchesRepo.endMatch(matchId, sanitizedData);

        // Update stats status
        await this._matchStatsRepo.updateStatus(matchId, 'completed');

        const matchStats = await this._matchStatsRepo.getMatchStats(matchId);
        if (matchStats) {
            const bulkOps = this.calculatePlayerUpdates(matchStats);
            if (bulkOps && bulkOps.length > 0) {
                await this._playerRepo.bulkUpdateStats(bulkOps);
            }
        }

        return updatedMatch;
    }

    private calculatePlayerUpdates(matchStats: any): any[] {
        const playerUpdates = new Map<string, any>();

        const getPlayer = (id: any) => {
            if (!this.isValidId(id)) return null;
            const idStr = id.toString();
            if (!playerUpdates.has(idStr)) {
                playerUpdates.set(idStr, {
                    matches: 1, runs: 0, balls: 0, fours: 0, sixes: 0, innings: 0,
                    ballsBowled: 0, runsConceded: 0, wickets: 0,
                    catches: 0, stumpings: 0, runOuts: 0, highestScore: 0
                });
            }
            return playerUpdates.get(idStr);
        };

        const processInnings = (innings: any) => {
            if (!innings) return;

            innings.batsmen?.forEach((b: any) => {
                const p = getPlayer(b.playerId);
                if (!p) return;
                p.innings = 1;
                p.runs += (b.runs || 0);
                p.balls += (b.balls || 0);
                p.fours += (b.fours || 0);
                p.sixes += (b.sixes || 0);
                p.highestScore = Math.max(p.highestScore, b.runs || 0);
            });

            innings.bowlers?.forEach((b: any) => {
                const p = getPlayer(b.playerId);
                if (!p) return;
                const oversInt = Math.floor(b.overs || 0);
                const ballsRem = Math.round(((b.overs || 0) - oversInt) * 10);
                p.ballsBowled += (oversInt * 6) + ballsRem;
                p.runsConceded += (b.runsConceded || 0);
                p.wickets += (b.wickets || 0);
            });

            innings.logs?.forEach((log: any) => {
                if (log.dismissal && this.isValidId(log.dismissal.fielderId)) {
                    const p = getPlayer(log.dismissal.fielderId);
                    if (!p) return;
                    if (log.dismissal.type === 'caught') p.catches++;
                    if (log.dismissal.type === 'stumped') p.stumpings++;
                    if (log.dismissal.type === 'run-out') p.runOuts++;
                }
            });
        };

        processInnings(matchStats.innings1);
        processInnings(matchStats.innings2);

        const bulkOps: any[] = [];
        playerUpdates.forEach((stats, playerId) => {
            // Final Firewall: Double check ID before bulk write
            if (this.isValidId(playerId)) {
                bulkOps.push({
                    updateOne: {
                        filter: { _id: new Types.ObjectId(playerId) },
                        update: {
                            $inc: {
                                "stats.batting.matches": 1,
                                "stats.batting.innings": stats.innings,
                                "stats.batting.runs": stats.runs,
                                "stats.batting.fours": stats.fours,
                                "stats.batting.sixes": stats.sixes,
                                "stats.bowling.ballsBowled": stats.ballsBowled,
                                "stats.bowling.runsConceded": stats.runsConceded,
                                "stats.bowling.wickets": stats.wickets,
                                "stats.bowling.fiveWicketHauls": stats.wickets >= 5 ? 1 : 0,
                                "stats.fielding.catches": stats.catches,
                                "stats.fielding.stumpings": stats.stumpings,
                                "stats.fielding.runOuts": stats.runOuts
                            },
                            $max: { "stats.batting.highestScore": stats.highestScore }
                        }
                    }
                });
            }
        });

        return bulkOps;
    }

    private generateResultDescription(reason: string, resultData: any): string {
        if (resultData?.resultType === 'WIN' && resultData.winType && resultData.margin) {
            return `Won by ${resultData.margin} ${resultData.winType}`;
        }
        if (resultData?.resultType === 'TIE') return "Match Tied";
        if (resultData?.resultType === 'DRAW') return "Match Drawn";
        return `Match Ended: ${reason}`;
    }
}