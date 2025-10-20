import { Fixture } from "domain/entities/Fixture";

export interface IFixturesRepository {
    findByTournamentId(tournamentId: string): Promise<Fixture>;
    createFixture(tournamentId: string, data: Fixture): Promise<Fixture>;
}