import { IFixturesRepository } from "app/repositories/interfaces/manager/IFixturesRepository";
import FixtureModel from "infra/databases/mongo/models/FixtureModel";
import { Fixture } from "domain/entities/Fixture";
import { Types } from "mongoose";
import { FixtureMongoMapper } from "infra/utils/mappers/FixtureMongoMapper";
import { NotFoundError } from "domain/errors";

export class FixturesRepositoryMongo implements IFixturesRepository {
    async createFixture(tournamentId: string, matchIds: { matchId: string; round: number }[], format: string): Promise<Fixture> {
        const matches = matchIds.map(({ matchId, round }) => ({ matchId: new Types.ObjectId(matchId), round, }));

        const created = await FixtureModel.create({
            tournamentId: new Types.ObjectId(tournamentId),
            format,
            matches
        });

        const populatedMatches = FixtureModel.populate(created, [
            { path: "teamA", select: "name logo" },
            { path: "teamB", select: "name logo" },
        ]);

        return FixtureMongoMapper.toFixtureResponse(populatedMatches);
    }

    async getFixtureByTournament(tournamentId: string): Promise<Fixture | null> {
        const fixture = await FixtureModel.findOne({ tournamentId: new Types.ObjectId(tournamentId) })
            .populate({
                path: "matches.matchId",
                populate: [
                    { path: "teamA", select: "name logo" },
                    { path: "teamB", select: "name logo" }
                ]
            });

        if (!fixture) throw new NotFoundError('Fixture not found..!')

        return FixtureMongoMapper.toFixtureResponse(fixture);
    }
}