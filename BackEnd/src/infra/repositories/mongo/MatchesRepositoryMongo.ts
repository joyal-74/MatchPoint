import { IMatchesRepository } from "app/repositories/interfaces/manager/IMatchesRepository";
import type { Match } from "domain/entities/Match";
import { NotFoundError } from "domain/errors";
import MatchModel from "infra/databases/mongo/models/MatchesModel";
import { TournamentMatchStatsModel } from "infra/databases/mongo/models/TournamentMatchStatsModel";
import { MatchMongoMapper } from "infra/utils/mappers/MatchMongoMapper";

export class MatchesRepositoryMongo implements IMatchesRepository {
    async createMatches(tournamentId: string, matches: Match[]): Promise<Match[]> {
        const matchesWithTournament = matches.map(m => ({ ...m, tournamentId }));

        const createdMatches = await MatchModel.insertMany(matchesWithTournament);

        const populatedMatches = await MatchModel.populate(createdMatches, [
            { path: "teamA", select: "name logo" },
            { path: "teamB", select: "name logo" },
        ]);

        return MatchMongoMapper.toMatchResponseArray(populatedMatches);
    }


    async updateMatchStats(matchId: string, stats: Record<string, unknown>): Promise<Match> {
        const updatedMatch = await MatchModel.findByIdAndUpdate(matchId,
            { $set: { stats, ...stats } },
            { new: true }
        );

        if (!updatedMatch) {
            throw new NotFoundError(`Match not found with ID: ${matchId}`);
        }

        return MatchMongoMapper.toMatchResponse(updatedMatch);
    }

    async getMatchesByTournament(tournamentId: string): Promise<Match[]> {
        const matches = await MatchModel.find({ tournamentId }).populate([
            { path: "teamA", select: "name logo" },
            { path: "teamB", select: "name logo" },
        ]);

        return MatchMongoMapper.toMatchResponseArray(matches)
    }

    async getMatchById(matchId: string): Promise<Match | null> {
        const match = await MatchModel.findById(matchId).lean();
        return MatchMongoMapper.toMatchResponse(match);
    }

    async getMatchDetails(matchId: string): Promise<any | null> {
        return await MatchModel.findById(matchId)
            .populate("teamA")
            .populate("teamB")
            .lean();
    }

    async updateTossDetails(matchId: string, tossWinnerId: string, tossDecision: string): Promise<any | null> {
        // 1. Update tossWinner + tossDecision in Match collection
        await MatchModel.findByIdAndUpdate(
            matchId,
            { $set: { tossWinner: tossWinnerId, tossDecision } }
        );

        // 2. Fetch updated match with teams
        const match = await MatchModel.findById(matchId)
            .populate("teamA")
            .populate("teamB")
            .lean();

        if (!match) return null;

        const teamA = match.teamA._id.toString();
        const teamB = match.teamB._id.toString() ?? null;

        let battingTeam: string;
        let bowlingTeam: string;

        if (tossDecision === "Batting") {
            battingTeam = tossWinnerId;
            bowlingTeam = tossWinnerId === teamA ? teamB : teamA;
        } else {
            // chose to bowl
            bowlingTeam = tossWinnerId;
            battingTeam = tossWinnerId === teamA ? teamB : teamA;
        }

        // 4. Initialize innings1 in TournamentMatchStats using UPSERT
        await TournamentMatchStatsModel.findOneAndUpdate(
            { matchId },
            {
                $set: {
                    innings1: {
                        battingTeam,
                        bowlingTeam,
                        runs: 0,
                        wickets: 0,
                        balls: 0,

                        currentStriker: null,
                        currentNonStriker: null,
                        currentBowler: null,

                        batsmen: [],
                        bowlers: []
                    },
                    currentInnings: 1,
                    isLive: true
                },
                $setOnInsert: {
                    tournamentId: match.tournamentId,  // REQUIRED for first insert
                    innings2: {
                        battingTeam: null,
                        bowlingTeam: null,
                        runs: 0,
                        wickets: 0,
                        balls: 0,
                        currentStriker: null,
                        currentNonStriker: null,
                        currentBowler: null,
                        batsmen: [],
                        bowlers: []
                    }
                }
            },
            {
                upsert: true,
                new: true,
                setDefaultsOnInsert: true
            }
        );

        return match;
    }

}