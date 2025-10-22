import { IMatchesRepository } from "app/repositories/interfaces/manager/IMatchesRepository";
import type { Match } from "domain/entities/Match";
import { NotFoundError } from "domain/errors";
import MatchModel from "infra/databases/mongo/models/MatchesModel";
import { MatchMongoMapper } from "infra/utils/mappers/MatchMongoMapper";

export class MatchesRepositoryMongo implements IMatchesRepository {

    async createMatches(tournamentId: string, matches: Match[]): Promise<Match[]> {
        const matchesWithTournament = matches.map(m => ({
            ...m,
            tournamentId
        }));

        const createdMatches = await MatchModel.insertMany(matchesWithTournament);
        return MatchMongoMapper.toMatchResponseArray(createdMatches);
    }


    async updateMatchStats(matchId: string, stats: Record<string, any>): Promise<Match> {
        const updatedMatch = await MatchModel.findByIdAndUpdate(
            matchId,
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
            { path: "teamA", select: "name" },
            { path: "teamB", select: "name" }
        ]);

        return MatchMongoMapper.toMatchResponseArray(matches)
    }

    async getMatchById(matchId: string): Promise<Match | null> {
        const match = await MatchModel.findById(matchId).lean();
        return MatchMongoMapper.toMatchResponse(match);
    }
}
