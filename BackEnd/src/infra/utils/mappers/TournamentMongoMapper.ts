import { FlattenMaps, Types } from "mongoose";
import { Tournament } from "../../../domain/entities/Tournaments.js";
import { TournamentDocument } from "../../../infra/databases/mongo/models/TournamentModel.js";

export type LeanTournament = FlattenMaps<TournamentDocument> & {
    _id: Types.ObjectId;
    managerId?: {
        _id?: Types.ObjectId;
        firstName?: string;
        lastName?: string;
        email?: string;
        phone?: string;
    };
};

export class TournamentMongoMapper {

    static fromHydrated(t: TournamentDocument): Tournament {
        const obj = t.toObject();
        return this._toDomainFromObj(obj);
    }

    static fromLean(obj: LeanTournament): Tournament {
        return this._toDomainFromObj(obj);
    }

    static toDomainArrayLean(tournaments: LeanTournament[]): Tournament[] {
        return tournaments.map(this.fromLean);
    }

    private static _toDomainFromObj(obj: any): Tournament {
        const manager = obj.managerId || {};
        const managerId = manager._id ? manager._id.toString() : null;
        const organizer = manager.firstName && manager.lastName
            ? `${manager.firstName} ${manager.lastName}`
            : "Unknown Organizer";
        const contact = {
            email: manager.email || "",
            phone: manager.phone || "",
        };

        return {
            ...obj,
            _id: obj._id.toString(),
            managerId,
            organizer,
            contact,
        } as Tournament;
    }
}
