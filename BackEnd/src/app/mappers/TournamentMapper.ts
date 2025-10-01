import { Tournament } from "domain/entities/Tournaments";

export class TournamentMongoMapper {
    static toDomain(t: Tournament): Tournament {
        return {
            ...t,
        } as Tournament;
    }

    static toDomainArray(tournaments: Tournament[]): Tournament[] {
        return tournaments.map(this.toDomain);
    }
}