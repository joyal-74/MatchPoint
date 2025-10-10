import { IGetPlayerProfile, IUpdatePlayerProfile } from "app/repositories/interfaces/IPlayerProfileRepository";
import { HttpStatusCode } from "domain/enums/StatusCodes";
import { buildResponse } from "infra/utils/responseBuilder";
import { HttpResponse } from "presentation/http/helpers/HttpResponse";
import { IHttpRequest } from "presentation/http/interfaces/IHttpRequest";
import { IHttpResponse } from "presentation/http/interfaces/IHttpResponse";
import { IProfileController } from "presentation/http/interfaces/IManagerController";

export class PlayerProfileController implements IProfileController {
    constructor(
        private _getPlayerProfileUsecase: IGetPlayerProfile,
        private _profileUpdateUsecase: IUpdatePlayerProfile,
    ) { }

    getProfile = async (httpRequest: IHttpRequest): Promise<IHttpResponse> => {
        const playerId = httpRequest.params.playerId;

        const player = await this._getPlayerProfileUsecase.execute(playerId);

        return new HttpResponse(HttpStatusCode.OK, buildResponse(true, 'Manager profile updated', player));
    }

    updateProfile = async (httpRequest: IHttpRequest): Promise<IHttpResponse> => {
        const userData = httpRequest.body;
        const playerId = httpRequest.params.playerId;
        const file = httpRequest.file;

        const player = await this._profileUpdateUsecase.execute({ ...userData, playerId }, file);

        return new HttpResponse(HttpStatusCode.OK, buildResponse(true, 'Manager profile updated', player));
    }
}