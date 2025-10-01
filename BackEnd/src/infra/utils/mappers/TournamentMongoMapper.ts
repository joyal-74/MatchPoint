import { Tournament } from "domain/entities/Tournaments";
import { TournamentDocument } from "infra/databases/mongo/models/TournamentModel"; 

export class TournamentMongoMapper {
    static toDomain(t: TournamentDocument): Tournament {
        return {
            ...t.toObject(),
            _id: t._id.toString(),
            managerId: t.managerId.toString(),
        } as Tournament;
    }

    static toDomainArray(tournaments: TournamentDocument[]): Tournament[] {
        return tournaments.map(this.toDomain);
    }
}