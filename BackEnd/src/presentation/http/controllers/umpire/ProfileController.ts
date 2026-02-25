import { IGetUmpireProfile, IUpdateUmpireProfile } from "../../../../app/repositories/interfaces/usecases/IUserProfileRepository"; 
import { injectable, inject } from "tsyringe";
import { DI_TOKENS } from "../../../../domain/constants/Identifiers";
import { IHttpRequest } from "../../interfaces/IHttpRequest";
import { IHttpResponse } from "../../interfaces/IHttpResponse";
import { HttpResponse } from "../../helpers/HttpResponse";
import { HttpStatusCode } from "../../../../domain/enums/StatusCodes";
import { buildResponse } from "../../../../infra/utils/responseBuilder";
import { IProfileController } from "../../interfaces/IProfileController";
import { ProfileMessages } from "../../../../domain/constants/manager/ManagerProfileMessages";


@injectable()
export class ProfileController implements IProfileController {
    constructor(
        @inject(DI_TOKENS.GetUmpireProfileUsecase) private _getUmpireProfileUsecase: IGetUmpireProfile,
        @inject(DI_TOKENS.UpdateUmpireProfile) private _profileUpdateUsecase: IUpdateUmpireProfile,
    ) { }

    /**
     * 
     * @param httpRequest umpireId in request
     * @returns return full profile of umpire
     */

    getProfile = async (httpRequest: IHttpRequest): Promise<IHttpResponse> => {
        const umpireId = httpRequest.params.umpireId;

        const umpire = await this._getUmpireProfileUsecase.execute(umpireId);

        return new HttpResponse(HttpStatusCode.OK, buildResponse(true, ProfileMessages.PROFILE_FETCHED, umpire));
    }

    /**
     * 
     * @param httpRequest partial data of user, which field he is updating data
     * @returns returns updated data of profile
     */

    updateProfile = async (httpRequest: IHttpRequest): Promise<IHttpResponse> => {
        const userData = httpRequest.body;
        const umpireId = httpRequest.params.umpireId;
        const file = httpRequest.file;

        const umpire = await this._profileUpdateUsecase.execute({ ...userData, umpireId }, file);

        return new HttpResponse(HttpStatusCode.OK, buildResponse(true, ProfileMessages.PROFILE_UPDATED, umpire));
    }
}
