import { IGetTournamentUsecase, IGetTeamsUsecase } from "app/repositories/interfaces/admin/IAdminUsecases";
import { HttpStatusCode } from "domain/enums/StatusCodes";
import { buildResponse } from "infra/utils/responseBuilder";
import { HttpResponse } from "presentation/http/helpers/HttpResponse";
import { IHttpRequest } from "presentation/http/interfaces/IHttpRequest";
import { IHttpResponse } from "presentation/http/interfaces/IHttpResponse";
import { AdminUserMessages } from "domain/constants/admin/AdminUserMessages";


export class TournamentManagementController {
    constructor(
        private _getAllTeamsUseCase: IGetTeamsUsecase,
        private _getAllTournamnetsUseCase: IGetTournamentUsecase,
    ) { }

    /**
     * Fetch all teams with pagination, optional filtering, and search.
     *
     * @param httpRequest - The HTTP request containing query parameters:
     *   - page: number (default 1)
     *   - limit: number (default 10)
     *   - filter: optional filter string
     *   - search: optional search keyword
     * @returns IHttpResponse containing the list of managers
     */
    getAllTeams = async (httpRequest: IHttpRequest): Promise<IHttpResponse> => {
        const { page = 1, limit = 10, filter, search } = httpRequest.query;

        const teams = await this._getAllTeamsUseCase.execute({
            page: Number(page),
            limit: Number(limit),
            filter: filter as string | undefined,
            search: search as string | undefined,
        });

        return new HttpResponse(HttpStatusCode.OK, buildResponse(true, AdminUserMessages.TEAMS_FETCHED, teams));
    }

    /**
     * Fetch all tournaments with pagination, optional filtering, and search.
     *
     * @param httpRequest - The HTTP request containing query parameters:
     *   - page: number (default 1)
     *   - limit: number (default 10)
     *   - filter: optional filter string
     *   - search: optional search keyword
     * @returns IHttpResponse containing the list of players
     */
    getAllTournaments = async (httpRequest: IHttpRequest): Promise<IHttpResponse> => {
        const { page = 1, limit = 5, filter, search } = httpRequest.query;

        const tournaments = await this._getAllTournamnetsUseCase.execute({
            page: Number(page),
            limit: Number(limit),
            filter: filter as string | undefined,
            search: search as string | undefined,
        });

        return new HttpResponse(HttpStatusCode.OK, buildResponse(true, AdminUserMessages.TOURNAMENTS_FETCHED, tournaments));
    }
}