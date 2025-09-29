import { IChangeStatusUsecase, IGetManagersUsecase, IGetPlayersUsecase, IGetViewersUsecase } from "app/repositories/interfaces/admin/IAdminUsecases";
import { HttpStatusCode } from "domain/enums/StatusCodes";
import { buildResponse } from "infra/utils/responseBuilder";
import { HttpResponse } from "presentation/http/helpers/HttpResponse";
import { IUsersManagementController } from "presentation/http/interfaces/IUsersManagementController";
import { IHttpRequest } from "presentation/http/interfaces/IHttpRequest";
import { IHttpResponse } from "presentation/http/interfaces/IHttpResponse";

/**
 * Controller responsible for handling user management operations in the Admin module.
 * Supports fetching managers, players, viewers, and changing user status.
 */
export class UsersManagementController implements IUsersManagementController {
    constructor(
        private _getAllManagersUseCase: IGetManagersUsecase,
        private _getAllPlayersUseCase: IGetPlayersUsecase,
        private _getAllViewersUseCase: IGetViewersUsecase,
        private _changeUserStatus: IChangeStatusUsecase,
    ) { }

    /**
     * Fetch all managers with pagination, optional filtering, and search.
     *
     * @param httpRequest - The HTTP request containing query parameters:
     *   - page: number (default 1)
     *   - limit: number (default 10)
     *   - filter: optional filter string
     *   - search: optional search keyword
     * @returns IHttpResponse containing the list of managers
     */
    getAllManagers = async (httpRequest: IHttpRequest): Promise<IHttpResponse> => {
        const { page = 1, limit = 10, filter, search } = httpRequest.query;

        const managers = await this._getAllManagersUseCase.execute({
            page: Number(page),
            limit: Number(limit),
            filter: filter as string | undefined,
            search: search as string | undefined,
        });

        return new HttpResponse(HttpStatusCode.OK, buildResponse(true, "Managers fetched successfully", managers));
    }

    /**
     * Fetch all players with pagination, optional filtering, and search.
     *
     * @param httpRequest - The HTTP request containing query parameters:
     *   - page: number (default 1)
     *   - limit: number (default 10)
     *   - filter: optional filter string
     *   - search: optional search keyword
     * @returns IHttpResponse containing the list of players
     */
    getAllPlayers = async (httpRequest: IHttpRequest): Promise<IHttpResponse> => {
        const { page = 1, limit = 10, filter, search } = httpRequest.query;

        const players = await this._getAllPlayersUseCase.execute({
            page: Number(page),
            limit: Number(limit),
            filter: filter as string | undefined,
            search: search as string | undefined,
        });

        return new HttpResponse(HttpStatusCode.OK, buildResponse(true, "Players fetched successfully", players));
    }

    /**
     * Fetch all viewers with pagination, optional filtering, and search.
     *
     * @param httpRequest - The HTTP request containing query parameters:
     *   - page: number (default 1)
     *   - limit: number (default 10)
     *   - filter: optional filter string
     *   - search: optional search keyword
     * @returns IHttpResponse containing the list of viewers
     */
    getAllViewers = async (httpRequest: IHttpRequest): Promise<IHttpResponse> => {
        const { page = 1, limit = 10, filter, search } = httpRequest.query;

        const viewers = await this._getAllViewersUseCase.execute({
            page: Number(page),
            limit: Number(limit),
            filter: filter as string | undefined,
            search: search as string | undefined,
        });

        return new HttpResponse(HttpStatusCode.OK, buildResponse(true, "Viewers fetched successfully", viewers));
    }

    /**
     * Change the status (active/block) of a specific user.
     *
     * @param httpRequest - The HTTP request containing:
     *   - params:
     *     - role: string (user role e.g., "manager", "player", "viewer")
     *     - userId: string (ID of the user to update)
     *   - body:
     *     - isActive: boolean (block/ active)
     *     - params: pagination specific params
     * @returns IHttpResponse containing the result of the update
     */
    changeUserStatus = async (httpRequest: IHttpRequest): Promise<IHttpResponse> => {
        const { role, userId } = httpRequest.params;
        const { isActive, params } = httpRequest.body;

        const result = await this._changeUserStatus.execute(role, userId, isActive, params);

        return new HttpResponse(HttpStatusCode.OK, buildResponse(true, "Status changed successfully", result));
    }
}