import { ManagerMapper } from "app/mappers/ManagerMapper";
import { ILogger } from "app/providers/ILogger";
import { IGetManagerDetails } from "app/repositories/interfaces/admin/IAdminUsecases";
import { IManagerRepository } from "app/repositories/interfaces/manager/IManagerRepository";
import { User } from "domain/entities/User";
import { InternalServerError, NotFoundError } from "domain/errors";

export interface ManagerDetails {
    _id: string;
    fullName: string;
    username: string;
    email: string;
    phone: string;
    role: string;
    status: string;
    subscription: string;
    joinedAt: string;
    profileImage: string;
    stats: {
        tournamentsCreated: number;
        tournamentsParticipated: number;
        totalTeams: number;
    };
    isBlocked?: boolean;
}


export class GetManagerDetails implements IGetManagerDetails {
    constructor(
        private _managerRepo: IManagerRepository,
        private _logger: ILogger
    ) {}

    async execute(managerId: string): Promise<ManagerDetails> {
        const manager = await this._managerRepo.findByIdWithUser(managerId);

        if (!manager) {
            this._logger.warn(`Manager not found for ID: ${managerId}`);
            throw new NotFoundError("Manager not found");
        }

        const user = manager.userId as unknown as User;
        if (!user) {
            this._logger.error(`No user linked for manager ID: ${managerId}`);
            throw new InternalServerError("User data missing for manager");
        }

        const managerDetails = ManagerMapper.toManagerDetailsDTO(manager);
        this._logger.info(`Fetched details for manager: ${user.username}`);

        return managerDetails;
    }
}