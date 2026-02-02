import { injectable, inject } from "tsyringe";
import { DI_TOKENS } from "domain/constants/Identifiers";

import { HttpStatusCode } from "domain/enums/StatusCodes";
import { buildResponse } from "infra/utils/responseBuilder";
import { HttpResponse } from "presentation/http/helpers/HttpResponse";
import { IHttpRequest } from "presentation/http/interfaces/IHttpRequest";
import { IHttpResponse } from "presentation/http/interfaces/IHttpResponse";
import { IGetUmpireAllMatches } from "app/repositories/interfaces/usecases/IMatchesUseCaseRepo";


@injectable()
export class MatchController {
    constructor(
        @inject(DI_TOKENS.GetUmpireAllMatches) private _getUmpireAllMatches: IGetUmpireAllMatches,
    ) { }

    /**
     * 
     * @param httpRequest umpireId in request
     * @returns return full profile of umpire
     */

    getAllMatches = async (httpRequest: IHttpRequest): Promise<IHttpResponse> => {
        const { search, limit, page, userId } = httpRequest.params;

        const umpire = await this._getUmpireAllMatches.execute(search, limit, page, userId);

        return new HttpResponse(HttpStatusCode.OK, buildResponse(true, 'Matches fetched', umpire));
    }
}