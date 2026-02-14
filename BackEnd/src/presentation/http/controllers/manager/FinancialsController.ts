import { injectable, inject } from "tsyringe";
import { DI_TOKENS } from "../../../../domain/constants/Identifiers.js";
import { IHttpRequest } from "../../interfaces/IHttpRequest.js";
import { IHttpResponse } from "../../interfaces/IHttpResponse.js";
import { HttpResponse } from "../../helpers/HttpResponse.js";
import { HttpStatusCode } from "../../../../domain/enums/StatusCodes.js";
import { buildResponse } from "../../../../infra/utils/responseBuilder.js";
import { GetManagerFinancialsUseCase } from "../../../../app/usecases/player/GetManagerFinancialsUseCase.js";

@injectable()
export class FinancialsController {
    constructor(
        @inject(DI_TOKENS.GetManagerFinancialsUseCase) private _getManagerFinancialsUseCase: GetManagerFinancialsUseCase,
    ) { }


    getReport = async (httpRequest: IHttpRequest): Promise<IHttpResponse> => {
        const managerId = httpRequest.params.managerId;

        const result = await this._getManagerFinancialsUseCase.execute(managerId);

        return new HttpResponse(
            HttpStatusCode.OK,
            buildResponse(true, 'Report generated', result)
        );
    };

}
