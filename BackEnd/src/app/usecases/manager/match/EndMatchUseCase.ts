import { inject, injectable } from "tsyringe";
import { DI_TOKENS } from "domain/constants/Identifiers";
import { Types } from "mongoose";

import { IMatchesRepository } from "app/repositories/interfaces/manager/IMatchesRepository";
import { IMatchStatsRepo } from "app/repositories/interfaces/manager/IMatchStatsRepo";
import { IPlayerRepository } from "app/repositories/interfaces/player/IPlayerRepository";
import { IEndMatchUseCase, EndMatchUseCaseInput } from "app/repositories/interfaces/usecases/IMatchesUseCaseRepo";
import { MatchEntity } from "domain/entities/MatchEntity";

@injectable()
export class EndMatchUseCase implements IEndMatchUseCase {
    constructor(
        @inject(DI_TOKENS.MatchesRepository) private _matchesRepo: IMatchesRepository,
        @inject(DI_TOKENS.MatchStatsRepository) private _matchStatsRepo: IMatchStatsRepo,
        @inject(DI_TOKENS.PlayerRepository) private _playerRepo: IPlayerRepository,
    ) { }

    async execute(input: EndMatchUseCaseInput): Promise<MatchEntity> {
        const { matchId, reason, resultData, endedBy } = input;

        const resultDescription = this.generateResultDescription(reason, resultData);

        const updatedMatch = await this._matchesRepo.endMatch(matchId, {
            status: 'completed',
            reason,
            endedBy: endedBy ?? null,
            winnerId: resultData?.winnerId ?? null,
            resultType: resultData?.resultType ?? null,
            winMargin: resultData?.margin ?? null,
            winType: resultData?.winType ?? null,
            resultDescription
        });

        await this._matchStatsRepo.updateStatus(matchId, 'completed');

        const matchStats = await this._matchStatsRepo.getMatchStats(matchId);

        if (matchStats) {
            const bulkOps = this.calculatePlayerUpdates(matchStats);

            console.log(bulkOps, 'jkl')

            await this._playerRepo.bulkUpdateStats(bulkOps);
        }

        return updatedMatch;
    }

    // --- HELPER METHODS ---

    private generateResultDescription(reason: string, resultData: any): string {
        if (resultData?.resultType === 'WIN' && resultData.winType && resultData.margin) {
            return `Won by ${resultData.margin} ${resultData.winType}`;
        }
        if (resultData?.resultType === 'TIE') return "Match Tied";
        if (resultData?.resultType === 'DRAW') return "Match Drawn";
        return `Match Ended: ${reason}`;
    }

    private calculatePlayerUpdates(matchStats: any): any[] {
        const playerUpdates = new Map<string, any>();

        const getPlayer = (id: string) => {
            if (!playerUpdates.has(id)) {
                playerUpdates.set(id, {
                    matches: 1, runs: 0, balls: 0, fours: 0, sixes: 0, innings: 0,
                    ballsBowled: 0, runsConceded: 0, wickets: 0,
                    catches: 0, stumpings: 0, runOuts: 0, highestScore: 0
                });
            }
            return playerUpdates.get(id);
        };

        const processInnings = (innings: any) => {
            if (!innings) return;
            innings.batsmen.forEach((b: any) => {
                const p = getPlayer(b.playerId.toString());
                p.innings = 1;
                p.runs += b.runs;
                p.balls += b.balls;
                p.fours += b.fours;
                p.sixes += b.sixes;
                p.highestScore = b.runs;
            });
            innings.bowlers.forEach((b: any) => {
                const p = getPlayer(b.playerId.toString());
                const oversInt = Math.floor(b.overs);
                const ballsRem = Math.round((b.overs - oversInt) * 10);
                p.ballsBowled += (oversInt * 6) + ballsRem;
                p.runsConceded += b.runsConceded;
                p.wickets += b.wickets;
            });
            innings.logs.forEach((log: any) => {
                if (log.dismissal && log.dismissal.fielderId) {
                    const p = getPlayer(log.dismissal.fielderId.toString());
                    if (log.dismissal.type === 'caught') p.catches++;
                    if (log.dismissal.type === 'stumped') p.stumpings++;
                    if (log.dismissal.type === 'run-out') p.runOuts++;
                }
            });
        };

        processInnings(matchStats.innings1);
        processInnings(matchStats.innings2);
        if (matchStats.hasSuperOver) {
            processInnings(matchStats.superOver1);
            processInnings(matchStats.superOver2);
        }

        const bulkOps: any[] = [];
        playerUpdates.forEach((stats, playerId) => {
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
        });

        return bulkOps;
    }
}