import { IGetViewerProfile, IUpdateViewerProfile } from "app/repositories/interfaces/IUserProfileRepository";
import { HttpStatusCode } from "domain/enums/StatusCodes";
import { buildResponse } from "infra/utils/responseBuilder";
import { HttpResponse } from "presentation/http/helpers/HttpResponse";
import { IHttpRequest } from "presentation/http/interfaces/IHttpRequest";
import { IHttpResponse } from "presentation/http/interfaces/IHttpResponse";
import { IProfileController } from "presentation/http/interfaces/IManagerController";
import { ILogger } from "app/providers/ILogger";

export class ProfileController implements IProfileController {
    constructor(
        private _getViewerProfileUsecase: IGetViewerProfile,
        private _profileUpdateUsecase: IUpdateViewerProfile,
        private _logger: ILogger
    ) { }

    getProfile = async (httpRequest: IHttpRequest): Promise<IHttpResponse> => {
        const viewerId = httpRequest.params.viewerId;

        this._logger.info(`Fetching profile for viewer ID: ${viewerId}`, { params: httpRequest.params });

        const viewer = await this._getViewerProfileUsecase.execute(viewerId);

        this._logger.info(`Profile fetched successfully for viewer ID: ${viewerId}`);

        return new HttpResponse(HttpStatusCode.OK, buildResponse(true, 'Viewer profile fetched', viewer));
    }

    updateProfile = async (httpRequest: IHttpRequest): Promise<IHttpResponse> => {
        const userData = httpRequest.body;
        const viewerId = httpRequest.params.viewerId;
        const file = httpRequest.file;

        this._logger.info(`Updating profile for viewer ID: ${viewerId}`, { body: userData, file });

        const viewer = await this._profileUpdateUsecase.execute({ ...userData, viewerId }, file);

        this._logger.info(`Profile updated successfully for viewer ID: ${viewerId}`);

        return new HttpResponse(HttpStatusCode.OK, buildResponse(true, 'Viewer profile updated', viewer));
    }
}
