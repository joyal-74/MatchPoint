import { injectable, inject } from "tsyringe";
import { TournamentMessages } from "../../../../domain/constants/TournamentMessages";
import { buildResponse } from "../../../../infra/utils/responseBuilder";
import { HttpStatusCode } from "../../../../domain/enums/StatusCodes";
import { HttpResponse } from "../../helpers/HttpResponse";
import { IHttpRequest } from "../../interfaces/IHttpRequest";
import { IHttpResponse } from "../../interfaces/IHttpResponse";
import { IGetViewerTournaments } from "../../../../app/repositories/interfaces/usecases/ITournamentsRepoUsecaes";
import { DI_TOKENS } from "../../../../domain/constants/Identifiers";
import { ILogger } from "../../../../app/providers/ILogger";


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
