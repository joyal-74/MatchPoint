import { Tournament } from "../../../domain/entities/Tournaments.js";
import { TournamentDocument } from "../../../infra/databases/mongo/models/TournamentModel.js";

export class TournamentMongoMapper {
    static toDomain(t: TournamentDocument): Tournament {
        const obj = t.toObject();

        const manager = obj.managerId || {};
        const managerId = manager._id ? manager._id.toString() : null;
        const organizer = manager.firstName && manager.lastName
            ? `${manager.firstName} ${manager.lastName}`
            : 'Unknown Organizer';
        const contact = {
            email: manager.email || '',
            phone: manager.phone || '',
        };

        return {
            ...obj,
            _id: obj._id.toString(),
            managerId,
            organizer,
            contact,
        } as Tournament;
    }

    static toDomainArray(tournaments: TournamentDocument[]): Tournament[] {
        return tournaments.map(this.toDomain);
    }
}
