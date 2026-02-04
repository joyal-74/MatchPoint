import { inject, injectable } from "tsyringe";
import { DI_TOKENS } from "../../../domain/constants/Identifiers.js";
import { IManagerRepository } from "../../repositories/interfaces/manager/IManagerRepository.js";
import { IGetManagerDetails } from "../../repositories/interfaces/admin/IAdminUsecases.js";
import { ILogger } from "../../providers/ILogger.js";
import { InternalServerError, NotFoundError } from "../../../domain/errors/index.js";
import { User } from "../../../domain/entities/User.js";
import { ManagerMapper } from "../../mappers/ManagerMapper.js";



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

@injectable()
export class GetManagerDetails implements IGetManagerDetails {
    constructor(
        @inject(DI_TOKENS.ManagerRepository) private _managerRepo: IManagerRepository,
        @inject(DI_TOKENS.Logger) private _logger: ILogger
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
