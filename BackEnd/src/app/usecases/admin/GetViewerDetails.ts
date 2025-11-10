import { UserMapper } from "app/mappers/UserMapper";
import { ILogger } from "app/providers/ILogger";
import { IGetViewerDetails } from "app/repositories/interfaces/admin/IAdminUsecases";
import { IUserRepository } from "app/repositories/interfaces/shared/IUserRepository";
import { NotFoundError } from "domain/errors";

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


export class GetViewerDetails implements IGetViewerDetails {
    constructor(
        private _viewerRepo: IUserRepository,
        private _logger: ILogger
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