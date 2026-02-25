import { Types } from "mongoose";
import { IFixturesRepository } from "../../../app/repositories/interfaces/manager/IFixturesRepository";
import { Fixture } from "../../../domain/entities/Fixture";
import FixtureModel from "../../databases/mongo/models/FixtureModel";
import { FixtureMongoMapper } from "../../utils/mappers/FixtureMongoMapper";
import { NotFoundError } from "../../../domain/errors/index";


export class FixturesRepository implements IFixturesRepository {
    async createFixture(tournamentId: string, matchIds: { matchId: string; round: number }[], format: string): Promise<Fixture> {
        const matches = matchIds.map(({ matchId, round }) => ({ matchId: new Types.ObjectId(matchId), round, }));

        const created = await FixtureModel.create({
            tournamentId: new Types.ObjectId(tournamentId),
            format,
            matches
        });

        const populatedFixture = await FixtureModel.findById(created._id)
            .populate({
                path: "matches.matchId",
                populate: [
                    { path: "teamA", select: "name logo" },
                    { path: "teamB", select: "name logo" },
                ],
            })
            .exec();

        const result = FixtureMongoMapper.toFixtureResponse(populatedFixture);

        return result;
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
