import { injectable, inject } from "tsyringe";
import { DI_TOKENS } from "domain/constants/Identifiers";

import { GetLeaderboard } from "app/usecases/shared/GetLeaderboard";
import { HttpStatusCode } from "domain/enums/StatusCodes";
import { buildResponse } from "infra/utils/responseBuilder";
import { HttpResponse } from "presentation/http/helpers/HttpResponse";
import { IHttpRequest } from "presentation/http/interfaces/IHttpRequest";
import { IHttpResponse } from "presentation/http/interfaces/IHttpResponse";

@injectable()
export class LeaderboardController {
    constructor(
        @inject(DI_TOKENS.GetLeaderBoardUsecase) private _getLeaderboard: GetLeaderboard
    ) { }

    fetchLeaderboard = async (httpRequest: IHttpRequest): Promise<IHttpResponse> => {

        const { position: role, search = "", page = "1", limit = "10", timePeriod = "All Time" } = httpRequest.query;
        const data = await this._getLeaderboard.execute({
            role: String(role),
            search: String(search),
            timePeriod: String(timePeriod),
            page: Number(page),
            limit: Number(limit),
        });

        return new HttpResponse(HttpStatusCode.OK, buildResponse(true, "leaderboard fetched successfully", data));
    };
}