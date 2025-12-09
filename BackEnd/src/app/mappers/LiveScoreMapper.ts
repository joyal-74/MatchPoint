import { MatchEntity } from "domain/entities/MatchEntity";
import { Innings } from "domain/entities/Innings";
import { Batsman } from "domain/entities/Batsman";
import { Bowler } from "domain/entities/Bowler";
import { LiveScoreDto } from "domain/dtos/LiveScoreDto";

const ballsToOvers = (totalBalls: number): number => {
    if (!totalBalls) return 0;
    const overs = Math.floor(totalBalls / 6);
    const balls = totalBalls % 6;
    return Number(`${overs}.${balls}`);
};

const safeId = (id: string | undefined | null): string | null => {
    return id || null;
};

export class LiveScoreMapper {
    static toDto(matchEntity: MatchEntity) : LiveScoreDto {
        if (!matchEntity) throw new Error('');

        let target: number | null = null;
        let requiredRuns: number | null = null;
        let requiredRunRate: string | null = null;

        const score1 = matchEntity.innings1?.runs || 0;

        const isInnings1Done = matchEntity.innings1?.isCompleted;
        const isSecondInnings = matchEntity.currentInningsNumber === 2;

        if (isInnings1Done || isSecondInnings) {
            target = score1 + 1;

            if (matchEntity.innings2) {
                const score2 = matchEntity.innings2.runs || 0;
                const ballsBowled2 = matchEntity.innings2.balls || 0;

                const needed = target - score2;
                requiredRuns = needed > 0 ? needed : 0;

                const totalBallsAllowed = matchEntity.oversLimit * 6;
                const ballsRemaining = totalBallsAllowed - ballsBowled2;

                if (ballsRemaining > 0 && requiredRuns > 0) {
                    requiredRunRate = ((requiredRuns / ballsRemaining) * 6).toFixed(2);
                } else if (requiredRuns <= 0) {
                    requiredRunRate = "0.00";
                }
            } else {
                requiredRuns = target;
                if (matchEntity.oversLimit > 0) {
                    requiredRunRate = (target / matchEntity.oversLimit).toFixed(2);
                }
            }
        }

        const mapInnings = (inn: Innings | null | undefined) => {
            if (!inn) return null;

            const crr = inn.balls > 0 ? ((inn.runs / inn.balls) * 6).toFixed(2) : "0.00";

            const batsmenArray = Array.from(inn.batsmen.values());
            const bowlersArray = Array.from(inn.bowlers.values());

            return {
                battingTeamId: safeId(inn.battingTeam),
                bowlingTeamId: safeId(inn.bowlingTeam),

                runs: inn.runs || 0,
                wickets: inn.wickets || 0,
                balls: inn.balls || 0,
                overs: ballsToOvers(inn.balls || 0),
                currentRunRate: crr,
                isCompleted: inn.isCompleted,

                currentStriker: safeId(inn.currentStriker),
                currentNonStriker: safeId(inn.currentNonStriker),
                currentBowler: safeId(inn.currentBowler),

                battingStats: batsmenArray.map((b: Batsman) => {
                    const sr = b.balls > 0 ? ((b.runs / b.balls) * 100).toFixed(2) : "0.00";
                    return {
                        playerId: safeId(b.playerId),
                        runs: b.runs,
                        balls: b.balls,
                        fours: b.fours,
                        sixes: b.sixes,
                        strikeRate: sr,
                        out: b.out,
                        dismissalType: b.dismissalType,
                        fielderId: safeId(b.fielderId),
                        isRetiredHurt: b.retiredHurt
                    };
                }),

                bowlingStats: bowlersArray.map((bw: Bowler) => {
                    const eco = bw.totalBalls > 0 ? (bw.runsConceded / (bw.totalBalls / 6)).toFixed(2) : "0.00";
                    return {
                        playerId: safeId(bw.playerId),
                        runsConceded: bw.runsConceded,
                        wickets: bw.wickets,
                        balls: bw.totalBalls,
                        overs: ballsToOvers(bw.totalBalls),
                        economy: eco
                    };
                }),

                extras: inn.extras || {
                    wides: 0, noBalls: 0, byes: 0, legByes: 0, penalty: 0,
                },

                recentLogs: (inn.logs || []).slice(-12)
            };
        };

        return {
            matchId: safeId(matchEntity.matchId),
            tournamentId: safeId(matchEntity.tournamentId),

            status: matchEntity.isMatchComplete ? 'COMPLETED' : 'LIVE',

            currentInnings: matchEntity.currentInningsNumber || 1,
            oversLimit: matchEntity.oversLimit,

            target: target,
            requiredRuns: requiredRuns,
            requiredRunRate: requiredRunRate,
            hasSuperOver: matchEntity.hasSuperOver,

            innings1: mapInnings(matchEntity.innings1),
            innings2: mapInnings(matchEntity.innings2),
        };
    }
}

export const mapToLiveScoreDto = LiveScoreMapper.toDto;