import { IGetManagerProfile, IUpdateManagerProfile } from "app/repositories/interfaces/shared/IUserProfileRepository";
import { HttpStatusCode } from "domain/enums/StatusCodes";
import { buildResponse } from "infra/utils/responseBuilder";
import { HttpResponse } from "presentation/http/helpers/HttpResponse";
import { IHttpRequest } from "presentation/http/interfaces/IHttpRequest";
import { IHttpResponse } from "presentation/http/interfaces/IHttpResponse";
import { IProfileController } from "presentation/http/interfaces/IManagerController";

export class ProfileController implements IProfileController {
    constructor(
        private _getManagerProfileUsecase: IGetManagerProfile,
        private _profileUpdateUsecase: IUpdateManagerProfile,
    ) { }

    getProfile = async (httpRequest: IHttpRequest): Promise<IHttpResponse> => {
        const managerId = httpRequest.params.managerId;

        const manager = await this._getManagerProfileUsecase.execute(managerId);

        return new HttpResponse(HttpStatusCode.OK, buildResponse(true, 'Manager profile updated', manager));
    }

    updateProfile = async (httpRequest: IHttpRequest): Promise<IHttpResponse> => {
        const userData = httpRequest.body;
        const managerId = httpRequest.params.managerId;
        const file = httpRequest.file;

        console.log("ManagerId:", managerId);
        console.log("File:", file);
        console.log("FormData fields:", userData);

        const manager = await this._profileUpdateUsecase.execute({ ...userData, managerId }, file);

        return new HttpResponse(HttpStatusCode.OK, buildResponse(true, 'Manager profile updated', manager));
    }
}