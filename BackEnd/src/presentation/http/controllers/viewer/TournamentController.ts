import { injectable, inject } from "tsyringe";
import { TournamentMessages } from "../../../../domain/constants/TournamentMessages.js";
import { buildResponse } from "../../../../infra/utils/responseBuilder.js";
import { HttpStatusCode } from "../../../../domain/enums/StatusCodes.js";
import { HttpResponse } from "../../helpers/HttpResponse.js";
import { IHttpRequest } from "../../interfaces/IHttpRequest.js";
import { IHttpResponse } from "../../interfaces/IHttpResponse.js";
import { IGetViewerTournaments } from "../../../../app/repositories/interfaces/usecases/ITournamentsRepoUsecaes.js";
import { DI_TOKENS } from "../../../../domain/constants/Identifiers.js";
import { ILogger } from "../../../../app/providers/ILogger.js";


@injectable()
export class TournamentController {
    constructor(
        @inject(DI_TOKENS.GetViewerTournamentsUseCase) private _getViewerTournaments: IGetViewerTournaments,
        @inject(DI_TOKENS.Logger) private _logger: ILogger
    ) { }

    getTournaments = async (httpRequest: IHttpRequest): Promise<IHttpResponse> => {
        const { status, page = 1, limit = 10 } = httpRequest.query;

        this._logger.info(
            `[TournamentsController] Fetching viewer tournaments → , status=${status}, page=${page}, limit=${limit}`
        );

        const result = await this._getViewerTournaments.execute(status, page, limit);

        return new HttpResponse(HttpStatusCode.OK, buildResponse(true, TournamentMessages.TOURNAMENTS_FETCHED, result));
    }
}
