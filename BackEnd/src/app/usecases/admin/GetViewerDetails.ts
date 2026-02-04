import { inject, injectable } from "tsyringe";
import { IGetViewerDetails } from "../../repositories/interfaces/admin/IAdminUsecases.js";
import { IUserRepository } from "../../repositories/interfaces/shared/IUserRepository.js";
import { ILogger } from "../../providers/ILogger.js";
import { DI_TOKENS } from "../../../domain/constants/Identifiers.js";
import { NotFoundError } from "../../../domain/errors/index.js";
import { UserMapper } from "../../mappers/UserMapper.js";


export interface ViewerDetails {
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
    isBlocked?: boolean;
}

@injectable()
export class GetViewerDetails implements IGetViewerDetails {
    constructor(
        @inject(DI_TOKENS.UserRepository) private _viewerRepo: IUserRepository,
        @inject(DI_TOKENS.Logger) private _logger: ILogger
    ) { }

    async execute(viewerId: string): Promise<ViewerDetails> {
        const viewer = await this._viewerRepo.findById(viewerId);

        if (!viewer) {
            this._logger.warn(`Viewer not found for ID: ${viewerId}`);
            throw new NotFoundError("Viewer not found");
        }

        const viewerDetails = UserMapper.toViewerDetailsDTO(viewer);
        this._logger.info(`Fetched details for manager: ${viewer.username}`);

        return viewerDetails;
    }
}
