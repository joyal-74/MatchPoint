import { IAdminRepository } from "app/repositories/interfaces/IAdminRepository";
import { Admin, AdminResponse } from "domain/entities/Admin";
import { AdminModel } from "infra/databases/mongo/models/AdminModel";


export class AdminRepositoryMongo implements IAdminRepository {
    // Find user by MongoDB _id
    async findById(id: string): Promise<AdminResponse | null> {
        return AdminModel.findById(id).lean<AdminResponse>().exec();
    }

    // Find user by email
    async findByEmail(email: string): Promise<AdminResponse | null> {
        return AdminModel.findOne({ email }).lean<AdminResponse>().exec();
    }


    async update(_id: string, data: Partial<Admin>): Promise<AdminResponse> {
        const updated = await AdminModel.findByIdAndUpdate(_id, data, { new: true }).lean<AdminResponse>().exec();
        if (!updated) throw new Error("User not found");
        return updated;
    }
}