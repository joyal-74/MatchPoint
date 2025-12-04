import type { TournamentMatchStatsDocument } from 'infra/databases/mongo/models/TournamentMatchStatsModel';  // Adjust path

const ballsToOvers = (totalBalls: number): number => {
    return Math.floor(totalBalls / 6) + (totalBalls % 6) / 10;
};

const safeIdToString = (id): string | null => {
    return id ? id.toString() : null;
};

// Main Mapper Class (for easy injection/testing)
export class LiveScoreMapper {
    static toDto(document: TournamentMatchStatsDocument): LiveScoreState {
        if (!document) {
            throw new Error('Cannot map null/undefined document to LiveScoreState');
        }

        // Shared innings mapper (reusable for innings1/2)
        const mapInnings = (innings: any) => ({
            battingTeamId: safeIdToString(innings.battingTeamId),
            bowlingTeamId: safeIdToString(innings.bowlingTeamId),
            score: innings.runs || 0,
            wickets: innings.wickets || 0,
            overs: ballsToOvers(innings.balls || 0),
            ballsInOver: (innings.balls || 0) % 6,
            currentBatsmanId: safeIdToString(innings.currentStriker),
            nonStrikerId: safeIdToString(innings.currentNonStriker),
            currentBowlerId: safeIdToString(innings.currentBowler),
            isCompleted: innings.isCompleted || false,
            ballEvents: innings.ballEvents || [],
            battingStats: innings.batsmen || {},
            bowlingStats: innings.bowlers || {},
            extras: innings.extras || { wides: 0, noBalls: 0, byes: 0, legByes: 0 },
        });

        return {
            innings1: mapInnings(document.innings1),
            innings2: document.innings2 ? mapInnings(document.innings2) : null,
            currentInnings: document.currentInnings || 1,
            requiredRuns: document.requiredRuns || 0,
            target: document.target || 0,
        };
    }
}

export const mapToLiveScoreDto = LiveScoreMapper.toDto;