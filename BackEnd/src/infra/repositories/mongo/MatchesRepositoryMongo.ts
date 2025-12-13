import { IMatchesRepository } from "app/repositories/interfaces/manager/IMatchesRepository";
import { Extras } from "domain/entities/Extra";
import { Innings } from "domain/entities/Innings";
import type { Match } from "domain/entities/Match";
import { MatchEntity } from "domain/entities/MatchEntity";
import { NotFoundError } from "domain/errors";
import MatchModel from "infra/databases/mongo/models/MatchesModel";
import { TournamentMatchStatsModel } from "infra/databases/mongo/models/TournamentStatsModel";
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
        await MatchModel.findByIdAndUpdate(
            matchId,
            { $set: { tossWinner: tossWinnerId, tossDecision } }
        );

        const match = await MatchModel.findById(matchId)
            .populate("teamA")
            .populate("teamB")
            .lean();

        if (!match) return null;

        if (!match.teamB) {
            return await MatchModel.findByIdAndUpdate(
                matchId,
                {
                    $set: {
                        status: "bye",
                        winner: match.teamA._id,
                    }
                },
                { new: true }
            );
        }

        const teamA = match.teamA._id.toString();
        const teamB = match.teamB._id.toString();

        let battingTeamId: string;
        let bowlingTeamId: string;

        if (tossDecision === "Batting") {
            battingTeamId = tossWinnerId;
            bowlingTeamId = tossWinnerId === teamA ? teamB : teamA;
        } else {
            bowlingTeamId = tossWinnerId;
            battingTeamId = tossWinnerId === teamA ? teamB : teamA;
        }

        console.log(battingTeamId, " batting")
        console.log(bowlingTeamId, " bowling")

        const innings1 = new Innings({
            battingTeam: battingTeamId,
            bowlingTeam: bowlingTeamId,
            oversLimit: match.oversLimit || 20,
            runs: 0,
            wickets: 0,
            legalBalls: 0,
            deliveries: 0,
            isCompleted: false,
            extras: new Extras(),
            batsmen: new Map(),
            bowlers: new Map(),
            logs: []
        });

        const innings1DTO = innings1.toDTO(); 

        const matchStatsData = {
            tournamentId: match.tournamentId.toString(),
            matchId: matchId,
            oversLimit: match.oversLimit || 20,
            venue: match.venue || "",
            isLive: true,
            innings1: innings1DTO,
            innings2: null,
            currentInnings: 1,
            hasSuperOver: false
        };

        await TournamentMatchStatsModel.findOneAndUpdate(
            { matchId },
            { $set: matchStatsData },
            {
                upsert: true,
                new: true,
                setDefaultsOnInsert: true
            }
        );

        return match;
    }
}