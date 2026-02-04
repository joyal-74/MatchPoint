import { injectable, inject } from "tsyringe";
import { DI_TOKENS } from "../../../../domain/constants/Identifiers.js";
import { IHttpRequest } from "../../interfaces/IHttpRequest.js";
import { IHttpResponse } from "../../interfaces/IHttpResponse.js";
import { HttpResponse } from "../../helpers/HttpResponse.js";
import { HttpStatusCode } from "../../../../domain/enums/StatusCodes.js";
import { buildResponse } from "../../../../infra/utils/responseBuilder.js";
import { IGetUmpireAllMatches } from "../../../../app/repositories/interfaces/usecases/IMatchesUseCaseRepo.js";


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
