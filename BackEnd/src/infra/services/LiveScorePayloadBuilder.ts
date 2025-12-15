import { Innings } from "domain/entities/Innings";
import { InitInningsPayload } from "domain/entities/MatchEntity";
import { TournamentMatchStatsDocument } from "domain/types/match.types";
import { Types } from "mongoose";

export class LiveScorePayloadBuilder {

    static convertArrayToObject<T extends { playerId?: Types.ObjectId; _id?: Types.ObjectId }>(array: T[] = []): PlayerStatMap<T> {
        return array.reduce<PlayerStatMap<T>>((acc, item) => {
            const key = item.playerId?.toString() ?? item._id?.toString();
            if (key) acc[key] = item;
            return acc;
        }, {});
    }

    static buildInningsPayload(inn: Innings | null): InitInningsPayload | null {
        if (!inn) return null;

        const totalBalls = inn.balls ?? 0;
        const overs = Math.floor(totalBalls / 6);
        const ballsInOver = totalBalls % 6;
        const oversFormatted = Number((overs + ballsInOver / 10).toFixed(1));

        const recentBalls = (inn.logs ?? []).slice(-12);
        const lastBall = recentBalls.at(-1) ?? null;

        const extras = inn.extras ?? {
            wides: 0, noBalls: 0, legByes: 0, byes: 0, penalty: 0, total: 0
        };

        return {
            score: inn.runs ?? 0,
            wickets: inn.wickets ?? 0,
            oversFormatted,
            ballsInOver,
            currentBatsmanId: inn.currentStriker?.toString() ?? null,
            nonStrikerId: inn.currentNonStriker?.toString() ?? null,
            currentBowlerId: inn.currentBowler?.toString() ?? null,
            battingStats: this.convertArrayToObject(inn.batsmen ?? []),
            bowlingStats: this.convertArrayToObject(inn.bowlers ?? []),
            battingTeamId: inn.battingTeam?.toString() ?? "",
            bowlingTeamId: inn.bowlingTeam?.toString() ?? "",
            isCompleted: inn.isCompleted ?? false,
            isSuperOver: inn.isSuperOver ?? false,
            extras,
            lastBall,
            recentBalls
        };
    }

    static calculateCurrentRunRate(inn: Innings | null): number {
        if (!inn || !inn.balls) return 0;
        return inn.runs / (inn.balls / 6);
    }

    static calculateRequiredRuns(match: TournamentMatchStatsDocument): number {
        if (match.currentInnings !== 2) return 0;
        if (!match.innings1 || !match.innings2) return 0;

        return Math.max(0, (match.innings1.runs + 1) - match.innings2.runs);
    }

    static calculateRequiredRunRate(match: TournamentMatchStatsDocument): number {
        if (match.currentInnings !== 2 || !match.innings2) return 0;

        const requiredRuns = this.calculateRequiredRuns(match);
        const matchOvers = (match as any).overs ?? 50;

        const remainingBalls = matchOvers * 6 - match.innings2.balls;
        if (remainingBalls <= 0) return 0;

        return requiredRuns / (remainingBalls / 6);
    }

    static build(match: TournamentMatchStatsDocument): LiveScorePayload {
        const innings1 = this.buildInningsPayload(match.innings1);
        const innings2 = this.buildInningsPayload(match.innings2);
        const superOver1 = this.buildInningsPayload(match.superOver1);
        const superOver2 = this.buildInningsPayload(match.superOver2);

        const matchOvers = (match as any).overs ?? 50;

        return {
            matchId: match.matchId.toString(),
            currentInnings: match.currentInnings,
            matchOvers,
            isLive: match.isLive,

            innings1,
            innings2,
            superOver1,
            superOver2,

            requiredRuns: this.calculateRequiredRuns(match),
            target: (match.innings1?.runs ?? 0) + 1,
            currentRunRate: this.calculateCurrentRunRate(
                match.currentInnings === 1 ? match.innings1 : match.innings2
            ),
            requiredRunRate: this.calculateRequiredRunRate(match)
        };
    }
}
