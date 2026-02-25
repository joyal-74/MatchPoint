import { injectable, inject } from "tsyringe";
import { DI_TOKENS } from "../../../../domain/constants/Identifiers";
import { IHttpResponse } from "../../interfaces/IHttpResponse";
import { HttpResponse } from "../../helpers/HttpResponse";
import { HttpStatusCode } from "../../../../domain/enums/StatusCodes";
import { buildResponse } from "../../../../infra/utils/responseBuilder";
import { IGetDashboardStatsUseCase } from "../../../../app/repositories/interfaces/admin/IAdminUsecases";
import { AdminUserMessages } from "../../../../domain/constants/admin/AdminUserMessages";

@injectable()
export class DashboardController {
    constructor(
        @inject(DI_TOKENS.GetDashboardStatsUseCase) private _getDashboardStatsUseCase: IGetDashboardStatsUseCase,
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
