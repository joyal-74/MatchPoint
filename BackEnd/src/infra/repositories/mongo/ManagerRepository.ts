import { Types } from "mongoose";
import { IManagerRepository } from "../../../app/repositories/interfaces/manager/IManagerRepository";
import { ManagerModel } from "../../databases/mongo/models/ManagerModel";
import { Manager, ManagerRegister, ManagerResponse } from "../../../domain/entities/Manager";
import { UserRole } from "../../../domain/enums/Roles";
import { NotFoundError } from "../../../domain/errors/index";


export class ManagerRepository implements IManagerRepository {
    async findById(id: string): Promise<ManagerResponse | null> {
        return ManagerModel.findById(id).lean<ManagerResponse>().exec();
    }

    async findByEmail(email: string): Promise<ManagerResponse | null> {
        return ManagerModel.findOne({ email }).lean<ManagerResponse>().exec();
    }

    async findByRole(role: UserRole): Promise<ManagerResponse[]> {
        return ManagerModel.find({ role }).lean<ManagerResponse[]>().exec();
    }

    async findByIdWithUser(_id: string): Promise<ManagerResponse | null> {
        return ManagerModel.findOne({ userId: _id }).populate('userId').lean<ManagerResponse | null>();;
    }

    async create(manager: ManagerRegister): Promise<ManagerResponse> {
        const created = await ManagerModel.create({
            wallet: 0,
            tournaments: [],
            teams: [],
            ...manager,
        });

        const obj = created.toObject();

        return {
            ...obj,
            _id: created._id.toString(),
            userId: created.userId.toString(),
            wallet: obj.wallet ?? 0,
            tournamentsCreated: obj.tournamentsCreated?.map(id => id.toString()) ?? [],
            tournamentsParticipated: obj.tournamentsParticipated?.map(id => id.toString()) ?? [],
            teams: obj.teams?.map(id => id.toString()) ?? [],
        };
    }

    async update(_id: string, data: Partial<Manager>): Promise<ManagerResponse> {
        const updated = await ManagerModel.findByIdAndUpdate(_id, data, { new: true }).lean<ManagerResponse>().exec();
        if (!updated) throw new NotFoundError("Manager not found");
        return updated;
    }

    async addTournamentToManager(userId: string, tournamentId: string): Promise<void> {
        await ManagerModel.updateOne(
            { userId: new Types.ObjectId(userId) },
            {
                $addToSet: {
                    tournamentsCreated: new Types.ObjectId(tournamentId),
                },
            }
        );
    }

    async joinTournamentUpdate(userId: string, tournamentId: string): Promise<void> {
        await ManagerModel.updateOne(
            { userId: new Types.ObjectId(userId) },
            {
                $addToSet: {
                    tournamentsParticipated: new Types.ObjectId(tournamentId),
                },
            }
        );
    }

    async addTeamToManager(userId: string, teamId: string): Promise<void> {
        await ManagerModel.updateOne(
            { userId: new Types.ObjectId(userId) },
            {
                $addToSet: {
                    teams: new Types.ObjectId(teamId),
                },
            }
        );
    }

    async deleteByUserId(userId: string): Promise<void> {
        await ManagerModel.deleteMany({ userId });
    }

    async deleteManyByUserIds(userIds: string[]): Promise<number> {
        const result = await ManagerModel.deleteMany({ userId: { $in: userIds } });
        return result.deletedCount || 0;
    }
}
