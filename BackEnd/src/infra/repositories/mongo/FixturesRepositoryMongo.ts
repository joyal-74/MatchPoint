import { IFixturesRepository } from "app/repositories/interfaces/manager/IFixturesRepository";
import { Fixture } from "domain/entities/Fixture";
import FixtureModel from "infra/databases/mongo/models/FixtureModel";

export class FixturesRepositoryMongo implements IFixturesRepository {
    async createFixture(tournamentId: string, data: Fixture): Promise<Fixture> {
        const created = await FixtureModel.create({
            ...data,
            tournamentId,
        });

        return created;
    }

    async findByTournamentId(tournamentId: string): Promise<Fixture> {
        const fixtures = await FixtureModel.find({ tournamentId }).lean();
        return fixtures;
    }
}