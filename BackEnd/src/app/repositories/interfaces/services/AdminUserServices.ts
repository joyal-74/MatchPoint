import { GetAllUsersParams } from "app/usecases/admin/GetAllViewers";
import { RoleResponseDTO } from "../admin/IAdminUsecases";

export interface IUserManagementService {
    changeStatusAndFetch(role: string, userId: string, isActive: boolean, params: GetAllUsersParams): Promise<{ users: RoleResponseDTO[], totalCount: number }>;
    changeBlockStatus(userId: string, isActive: boolean): Promise<RoleResponseDTO>;
}