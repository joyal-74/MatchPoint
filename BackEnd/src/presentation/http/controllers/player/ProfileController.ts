import { injectable, inject } from "tsyringe";
import { DI_TOKENS } from "../../../../domain/constants/Identifiers";
import { IHttpRequest } from "../../interfaces/IHttpRequest";
import { IHttpResponse } from "../../interfaces/IHttpResponse";
import { HttpResponse } from "../../helpers/HttpResponse";
import { HttpStatusCode } from "../../../../domain/enums/StatusCodes";
import { buildResponse } from "../../../../infra/utils/responseBuilder";
import { IGetPlayerProfile, IGetPlayerStats, IUpdatePlayerFields, IUpdatePlayerProfile } from "../../../../app/repositories/interfaces/usecases/IUserProfileRepository";
import { ILogger } from "../../../../app/providers/ILogger";
import { IProfileController } from "../../interfaces/IProfileController";
import { ProfileMessages } from "../../../../domain/constants/player/PlayerProfileMessages";

@injectable()
export class PlayerProfileController implements IProfileController {
    constructor(
        @inject(DI_TOKENS.GetPlayerProfile) private _getPlayerProfileUsecase: IGetPlayerProfile,
        @inject(DI_TOKENS.UpdatePlayerProfile) private _profileUpdateUsecase: IUpdatePlayerProfile,
        @inject(DI_TOKENS.UpdatePlayerFields) private _sportsProfileUpdateUsecase: IUpdatePlayerFields,
        @inject(DI_TOKENS.GetPlayerStats) private _getPlayerStatsUseCase: IGetPlayerStats,
        @inject(DI_TOKENS.Logger) private _logger: ILogger
    ) { }

    /**
     * @description Get detailed profile information of a player.
     * @param {IHttpRequest} httpRequest - The request object containing playerId in params.
     * @returns {Promise<IHttpResponse>} - Returns the player profile data.
     */
    getProfile = async (httpRequest: IHttpRequest): Promise<IHttpResponse> => {
        const playerId = httpRequest.params.playerId;

        this._logger.info(`Fetching profile for player ID: ${playerId}`, { params: httpRequest.params });

        const player = await this._getPlayerProfileUsecase.execute(playerId);

        this._logger.info(`Profile fetched successfully for player ID: ${playerId}`);

        return new HttpResponse(HttpStatusCode.OK, buildResponse(true, ProfileMessages.PROFILE_FETCHED, player));
    }

    /**
     * @description Update basic profile details of a player such as name, email, image, etc.
     * @param {IHttpRequest} httpRequest - The request object containing playerId in params and updated data in body. Accepts profile image in file.
     * @returns {Promise<IHttpResponse>} - Returns the updated player profile.
     */
    updateProfile = async (httpRequest: IHttpRequest): Promise<IHttpResponse> => {
        const userData = httpRequest.body;
        const playerId = httpRequest.params.playerId;
        const file = httpRequest.file;

        this._logger.info(`Updating profile for player ID: ${playerId}`);

        const player = await this._profileUpdateUsecase.execute({ ...userData, userId: playerId }, file);

        this._logger.info(`Profile updated successfully for player ID: ${playerId}`);

        return new HttpResponse(HttpStatusCode.OK, buildResponse(true, ProfileMessages.PROFILE_UPDATED, player));
    }

    /**
     * @description Update player sports-related fields like role, position, skill info, etc.
     * @param {IHttpRequest} httpRequest - The request object containing playerId in params and sports-related fields in body.
     * @returns {Promise<IHttpResponse>} - Returns updated sports profile details of the player.
     */
    updatePlayerSportsFields = async (httpRequest: IHttpRequest): Promise<IHttpResponse> => {
        const userData = httpRequest.body;
        const playerId = httpRequest.params.playerId;

        this._logger.info(`Updating sports fields for player ID: ${playerId}`, { body: userData });

        const profile = await this._sportsProfileUpdateUsecase.execute({ ...userData, userId: playerId });

        this._logger.info(`Profile updated successfully for player ID: ${playerId}`);

        return new HttpResponse(HttpStatusCode.OK, buildResponse(true, ProfileMessages.SPORT_PROFILE_UPDATED, profile));
    }

    getPlayerStats = async (httpRequest: IHttpRequest): Promise<IHttpResponse> => {
        const { userId } = httpRequest.params;

        this._logger.info(`Fetching stats for player ID: ${userId}`, { params: httpRequest.params });

        const player = await this._getPlayerStatsUseCase.execute(userId);

        this._logger.info(`Stats fetched successfully for player ID: ${userId}`);

        return new HttpResponse(HttpStatusCode.OK, buildResponse(true, ProfileMessages.PROFILE_FETCHED, player));
    }
};
