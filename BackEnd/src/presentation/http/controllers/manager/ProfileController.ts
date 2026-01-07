import { injectable, inject } from "tsyringe";
import { DI_TOKENS } from "domain/constants/Identifiers";

import { IGetManagerProfile, IUpdateManagerProfile } from "app/repositories/interfaces/usecases/IUserProfileRepository";
import { ProfileMessages } from "domain/constants/manager/ManagerProfileMessages";
import { HttpStatusCode } from "domain/enums/StatusCodes";
import { buildResponse } from "infra/utils/responseBuilder";
import { HttpResponse } from "presentation/http/helpers/HttpResponse";
import { IHttpRequest } from "presentation/http/interfaces/IHttpRequest";
import { IHttpResponse } from "presentation/http/interfaces/IHttpResponse";
import { IProfileController } from "presentation/http/interfaces/IManagerController";

@injectable()
export class ProfileController implements IProfileController {
    constructor(
        @inject(DI_TOKENS.GetManagerProfileUsecase) private _getManagerProfileUsecase: IGetManagerProfile,
        @inject(DI_TOKENS.UpdateManagerProfile) private _profileUpdateUsecase: IUpdateManagerProfile,
    ) { }

    /**
     * 
     * @param httpRequest managerId in request
     * @returns return full profile of manager
     */

    getProfile = async (httpRequest: IHttpRequest): Promise<IHttpResponse> => {
        const managerId = httpRequest.params.managerId;

        const manager = await this._getManagerProfileUsecase.execute(managerId);

        return new HttpResponse(HttpStatusCode.OK, buildResponse(true, ProfileMessages.PROFILE_FETCHED, manager));
    }

    /**
     * 
     * @param httpRequest partial data of user, which field he is updating data
     * @returns returns updated data of profile
     */

    updateProfile = async (httpRequest: IHttpRequest): Promise<IHttpResponse> => {
        const userData = httpRequest.body;
        const managerId = httpRequest.params.managerId;
        const file = httpRequest.file;

        const manager = await this._profileUpdateUsecase.execute({ ...userData, managerId }, file);

        return new HttpResponse(HttpStatusCode.OK, buildResponse(true, ProfileMessages.PROFILE_UPDATED, manager));
    }
}