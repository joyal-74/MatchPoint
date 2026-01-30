import { injectable, inject } from "tsyringe";
import { DI_TOKENS } from "domain/constants/Identifiers";

import { HttpStatusCode } from "domain/enums/StatusCodes";
import { buildResponse } from "infra/utils/responseBuilder";
import { HttpResponse } from "presentation/http/helpers/HttpResponse";
import { IHttpRequest } from "presentation/http/interfaces/IHttpRequest";
import { IHttpResponse } from "presentation/http/interfaces/IHttpResponse";
import { ILogger } from "app/providers/ILogger";
import { IGetViewerTournaments } from "app/repositories/interfaces/usecases/ITournamentsRepoUsecaes";
import { TournamentMessages } from "domain/constants/TournamentMessages";

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