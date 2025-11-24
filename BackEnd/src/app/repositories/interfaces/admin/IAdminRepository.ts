import { IBaseRepository } from "app/repositories/IBaseRepository";
import { Admin, AdminResponse } from "domain/entities/Admin";

export interface IAdminRepository extends IBaseRepository<Admin, AdminResponse> {
    findByEmail(email: string): Promise<AdminResponse | null>;
}