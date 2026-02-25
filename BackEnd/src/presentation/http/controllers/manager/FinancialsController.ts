import { injectable, inject } from "tsyringe";
import { DI_TOKENS } from "../../../../domain/constants/Identifiers";
import { IHttpRequest } from "../../interfaces/IHttpRequest";
import { IHttpResponse } from "../../interfaces/IHttpResponse";
import { HttpResponse } from "../../helpers/HttpResponse";
import { HttpStatusCode } from "../../../../domain/enums/StatusCodes";
import { buildResponse } from "../../../../infra/utils/responseBuilder";
import { GetManagerFinancialsUseCase } from "../../../../app/usecases/player/GetManagerFinancialsUseCase";

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
