import { IAdminRepository } from "app/repositories/interfaces/admin/IAdminRepository";
import { AdminResponse } from "domain/entities/Admin";
import { AdminDocument, AdminModel } from "infra/databases/mongo/models/AdminModel";
import { MongoBaseRepository } from "./MongoBaseRepository";

export class AdminRepositoryMongo extends MongoBaseRepository<AdminDocument, AdminResponse> implements IAdminRepository {
    constructor() {
        super(AdminModel);
    }

    async findByEmail(email: string): Promise<AdminResponse | null> {
        const result = await this.model.findOne({ email }).lean<AdminResponse>().exec();
        return result || null;
    }
}