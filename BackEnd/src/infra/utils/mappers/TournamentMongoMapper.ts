import { Tournament } from "domain/entities/Tournaments";
import { TournamentDocument } from "infra/databases/mongo/models/TournamentModel";

export class TournamentMongoMapper {
    static toDomain(t: TournamentDocument): Tournament {
        const obj = t.toObject();
        
        const managerId = obj.managerId._id.toString();
        const organizer = `${obj.managerId.first_name} ${obj.managerId.last_name}`;
        const contact = {
            email: obj.managerId.email,
            phone: obj.managerId.phone,
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