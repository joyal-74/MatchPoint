import { IGetPlayerProfile, IUpdatePlayerFields, IUpdatePlayerProfile } from "app/repositories/interfaces/IUserProfileRepository";
import { HttpStatusCode } from "domain/enums/StatusCodes";
import { buildResponse } from "infra/utils/responseBuilder";
import { HttpResponse } from "presentation/http/helpers/HttpResponse";
import { IHttpRequest } from "presentation/http/interfaces/IHttpRequest";
import { IHttpResponse } from "presentation/http/interfaces/IHttpResponse";
import { IProfileController } from "presentation/http/interfaces/IManagerController";
import { ILogger } from "app/providers/ILogger";

export class PlayerProfileController implements IProfileController {
    constructor(
        private _getPlayerProfileUsecase: IGetPlayerProfile,
        private _profileUpdateUsecase: IUpdatePlayerProfile,
        private _sportsProfileUpdateUsecase: IUpdatePlayerFields,
        private _logger: ILogger
    ) { }

    getProfile = async (httpRequest: IHttpRequest): Promise<IHttpResponse> => {
        const playerId = httpRequest.params.playerId;

        this._logger.info(`Fetching profile for player ID: ${playerId}`, { params: httpRequest.params });

        const player = await this._getPlayerProfileUsecase.execute(playerId);

        this._logger.info(`Profile fetched successfully for player ID: ${playerId}`);

        return new HttpResponse(HttpStatusCode.OK, buildResponse(true, 'Player profile fetched', player));
    }

    updateProfile = async (httpRequest: IHttpRequest): Promise<IHttpResponse> => {
        const userData = httpRequest.body;
        const playerId = httpRequest.params.playerId;
        const file = httpRequest.file;

        console.log(userData)
        console.log(file)

        this._logger.info(`Updating profile for player ID: ${playerId}`);

        const player = await this._profileUpdateUsecase.execute({ ...userData, userId :playerId }, file);

        this._logger.info(`Profile updated successfully for player ID: ${playerId}`);

        return new HttpResponse(HttpStatusCode.OK, buildResponse(true, 'Player profile updated', player));
    }

    updatePlayerSportsFields = async (httpRequest: IHttpRequest): Promise<IHttpResponse> => {
        const userData = httpRequest.body;
        const playerId = httpRequest.params.playerId;

        this._logger.info(`Updating sports fields for player ID: ${playerId}`, { body: userData });

        const profile = await this._sportsProfileUpdateUsecase.execute({ ...userData, userId : playerId });

        this._logger.info(`Profile updated successfully for player ID: ${playerId}`);

        return new HttpResponse(HttpStatusCode.OK, buildResponse(true, 'Player profile updated', profile));
    }
};