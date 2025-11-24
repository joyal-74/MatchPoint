import { IChangeUserBlockStatus, IChangeUserStatus, IGetUsersByRole, RoleResponseDTO } from "app/repositories/interfaces/admin/IAdminUsecases";
import { IUserManagementService } from "app/repositories/interfaces/services/AdminUserServices";
import { GetAllUsersParams } from "app/usecases/admin/GetAllViewers";

export class UserManagementService implements IUserManagementService {
    constructor(
        private _changeUserStatus: IChangeUserStatus,
        private _changeBlockUser: IChangeUserBlockStatus,
        private _getUsersByRole: IGetUsersByRole
    ) { }

    async changeStatusAndFetch(role: string, userId: string, isActive: boolean, params: GetAllUsersParams) : Promise<{ users: RoleResponseDTO[], totalCount: number }>{
        await this._changeUserStatus.execute(role, userId, isActive, params);
        const { users, totalCount } = await this._getUsersByRole.execute(role, params);
        return { users, totalCount };
    }

    async changeBlockStatus(userId: string, isActive: boolean): Promise<RoleResponseDTO> {
        return await this._changeBlockUser.execute(userId, isActive);
    }
}