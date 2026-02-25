import { injectable, inject } from "tsyringe";
import { DI_TOKENS } from "../../../../domain/constants/Identifiers";
import { IHttpRequest } from "../../interfaces/IHttpRequest";
import { IHttpResponse } from "../../interfaces/IHttpResponse";
import { HttpResponse } from "../../helpers/HttpResponse";
import { HttpStatusCode } from "../../../../domain/enums/StatusCodes";
import { buildResponse } from "../../../../infra/utils/responseBuilder";
import { IGetUmpireAllMatches } from "../../../../app/repositories/interfaces/usecases/IMatchesUseCaseRepo";


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
        const { umpireId } = httpRequest.params;

        const umpire = await this._getUmpireAllMatches.execute(umpireId);

        return new HttpResponse(HttpStatusCode.OK, buildResponse(true, 'Matches fetched', umpire));
    }
}
