import { inject, injectable } from "tsyringe";
import { IGetViewerDetails } from "../../repositories/interfaces/admin/IAdminUsecases";
import { IUserRepository } from "../../repositories/interfaces/shared/IUserRepository";
import { ILogger } from "../../providers/ILogger";
import { DI_TOKENS } from "../../../domain/constants/Identifiers";
import { NotFoundError } from "../../../domain/errors/index";
import { UserMapper } from "../../mappers/UserMapper";


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
