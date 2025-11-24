import { IGetManagersUsecase, IGetPlayersUsecase, IGetViewersUsecase, IGetManagerDetails, IGetPlayerDetails, IGetViewerDetails } from "app/repositories/interfaces/admin/IAdminUsecases";
import { HttpStatusCode } from "domain/enums/StatusCodes";
import { buildResponse } from "infra/utils/responseBuilder";
import { HttpResponse } from "presentation/http/helpers/HttpResponse";
import { IUsersManagementController } from "presentation/http/interfaces/IUsersManagementController";
import { IHttpRequest } from "presentation/http/interfaces/IHttpRequest";
import { IHttpResponse } from "presentation/http/interfaces/IHttpResponse";
import { IUserManagementService } from "app/repositories/interfaces/services/AdminUserServices";
import { AdminUserMessages } from "domain/constants/admin/AdminUserMessages";


export class UsersManagementController implements IUsersManagementController {
    constructor(
        private _getAllManagersUseCase: IGetManagersUsecase,
        private _getAllPlayersUseCase: IGetPlayersUsecase,
        private _getAllViewersUseCase: IGetViewersUsecase,
        private _changeUserStatus: IUserManagementService,
        private _getManagerDetails: IGetManagerDetails,
        private _getPlayerDetails: IGetPlayerDetails,
        private _getViewerDetails: IGetViewerDetails,
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

        return new HttpResponse(HttpStatusCode.OK, buildResponse(true, AdminUserMessages.MANAGERS_FETCHED, managers));
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
        const { page = 1, limit = 5, filter, search } = httpRequest.query;

        const players = await this._getAllPlayersUseCase.execute({
            page: Number(page),
            limit: Number(limit),
            filter: filter as string | undefined,
            search: search as string | undefined,
        });

        return new HttpResponse(HttpStatusCode.OK, buildResponse(true, AdminUserMessages.PLAYERS_FETCHED, players));
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

        return new HttpResponse(HttpStatusCode.OK, buildResponse(true, AdminUserMessages.VIEWERS_FETCHED, viewers));
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

        const result = await this._changeUserStatus.changeStatusAndFetch(role, userId, isActive, params);

        return new HttpResponse(HttpStatusCode.OK, buildResponse(true, AdminUserMessages.STATUS_CHANGED, result));
    }

    changeUserBlockStatus = async (httpRequest: IHttpRequest): Promise<IHttpResponse> => {
        const { userId } = httpRequest.params;
        const { isActive } = httpRequest.body;

        const result = await this._changeUserStatus.changeBlockStatus(userId, isActive);

        return new HttpResponse(HttpStatusCode.OK, buildResponse(true, AdminUserMessages.STATUS_CHANGED, result));
    }


    fetchManagerDetails = async (httpRequest: IHttpRequest): Promise<IHttpResponse> => {
        const { id } = httpRequest.params;

        const result = await this._getManagerDetails.execute(id);

        return new HttpResponse(HttpStatusCode.OK, buildResponse(true, AdminUserMessages.MANAGER_DETAILS_FETCHED, result));
    }

    fetchPlayerDetails = async (httpRequest: IHttpRequest): Promise<IHttpResponse> => {
        const { id } = httpRequest.params;

        const result = await this._getPlayerDetails.execute(id);

        return new HttpResponse(HttpStatusCode.OK, buildResponse(true, AdminUserMessages.PLAYER_DETAILS_FETCHED, result));
    }

    fetchViewerDetails = async (httpRequest: IHttpRequest): Promise<IHttpResponse> => {
        const { id } = httpRequest.params;

        const result = await this._getViewerDetails.execute(id);

        return new HttpResponse(HttpStatusCode.OK, buildResponse(true, AdminUserMessages.VIEWER_DETAILS_FETCHED, result));
    }
}