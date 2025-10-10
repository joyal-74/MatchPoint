import { IGetViewerProfile, IUpdateViewerProfile } from "app/repositories/interfaces/IViewerProfileRepository";
import { HttpStatusCode } from "domain/enums/StatusCodes";
import { buildResponse } from "infra/utils/responseBuilder";
import { HttpResponse } from "presentation/http/helpers/HttpResponse";
import { IHttpRequest } from "presentation/http/interfaces/IHttpRequest";
import { IHttpResponse } from "presentation/http/interfaces/IHttpResponse";
import { IProfileController } from "presentation/http/interfaces/IManagerController";

export class ProfileController implements IProfileController {
    constructor(
        private _getPlayerProfileUsecase: IGetViewerProfile,
        private _profileUpdateUsecase: IUpdateViewerProfile,
    ) { }

    getProfile = async (httpRequest: IHttpRequest): Promise<IHttpResponse> => {
        const viewerId = httpRequest.params.viewerId;

        const viewer = await this._getPlayerProfileUsecase.execute(viewerId);

        return new HttpResponse(HttpStatusCode.OK, buildResponse(true, 'Manager profile updated', viewer));
    }

    updateProfile = async (httpRequest: IHttpRequest): Promise<IHttpResponse> => {
        const userData = httpRequest.body;
        const viewerId = httpRequest.params.viewerId;
        const file = httpRequest.file;

        const viewer = await this._profileUpdateUsecase.execute({ ...userData, viewerId }, file);

        return new HttpResponse(HttpStatusCode.OK, buildResponse(true, 'Manager profile updated', viewer));
    }
}