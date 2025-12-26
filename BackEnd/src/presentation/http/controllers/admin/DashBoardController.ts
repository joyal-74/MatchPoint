import { IGetDashboardStatsUseCase } from "app/repositories/interfaces/admin/IAdminUsecases";
import { HttpStatusCode } from "domain/enums/StatusCodes";
import { buildResponse } from "infra/utils/responseBuilder";
import { HttpResponse } from "presentation/http/helpers/HttpResponse";
import { IHttpResponse } from "presentation/http/interfaces/IHttpResponse";
import { AdminUserMessages } from "domain/constants/admin/AdminUserMessages";


export class DashboardController {
    constructor(
        private _getDashboardStatsUseCase: IGetDashboardStatsUseCase,
    ) { }

    /**
     * Fetch Daashboard details.
     * @param httpRequest - The HTTP request containing query parameters:
     * @returns IHttpResponse containing the detaills of tournaments
     */
    getDashboard = async (): Promise<IHttpResponse> => {

        const data = await this._getDashboardStatsUseCase.execute();

        return new HttpResponse(HttpStatusCode.OK, buildResponse(true, AdminUserMessages.TEAMS_FETCHED, data));
    }
}