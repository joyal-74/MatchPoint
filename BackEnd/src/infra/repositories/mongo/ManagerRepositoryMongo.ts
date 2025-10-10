import { IManagerRepository } from "app/repositories/interfaces/manager/IManagerRepository";
import { UserRole } from "domain/enums/Roles";
import { ManagerModel } from "infra/databases/mongo/models/ManagerModel";
import { Manager, ManagerRegister, ManagerResponse } from "domain/entities/Manager";
import { NotFoundError } from "domain/errors";


export class ManagerRepositoryMongo implements IManagerRepository {
    async findById(id: string): Promise<ManagerResponse | null> {
        return ManagerModel.findById(id).lean<ManagerResponse>().exec();
    }

    async findByEmail(email: string): Promise<ManagerResponse | null> {
        return ManagerModel.findOne({ email }).lean<ManagerResponse>().exec();
    }

    async findByRole(role: UserRole): Promise<ManagerResponse[]> {
        return ManagerModel.find({ role }).lean<ManagerResponse[]>().exec();
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
            tournaments: obj.tournaments?.map(id => id.toString()) ?? [],
            teams: obj.teams?.map(id => id.toString()) ?? [],
        };
    }

    async update(_id: string, data: Partial<Manager>): Promise<ManagerResponse> {
        const updated = await ManagerModel.findByIdAndUpdate(_id, data, { new: true }).lean<ManagerResponse>().exec();
        if (!updated) throw new NotFoundError("Manager not found");
        return updated;
    }

    async deleteByUserId(userId: string): Promise<void> {
        await ManagerModel.deleteMany({ userId });
    }
}