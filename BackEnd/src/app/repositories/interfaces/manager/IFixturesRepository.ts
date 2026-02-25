import { Fixture } from "../../../../domain/entities/Fixture";

export interface IFixturesRepository {
    createFixture(tournamentId: string, matchIds: { matchId: string; round: number }[], format: string): Promise<Fixture>;
    getFixtureByTournament(tournamentId: string): Promise<Fixture | null>;
}
