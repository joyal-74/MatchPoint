import { Admin, AdminResponse } from "domain/entities/Admin";

export interface IAdminRepository {
    // Find user by MongoDB _id
    findById(_id: string): Promise<AdminResponse | null>;

    // Find Admin by email
    findByEmail(email: string): Promise<AdminResponse | null>;

    update(_id: string, data: Partial<Admin>): Promise<AdminResponse | null>;

}
