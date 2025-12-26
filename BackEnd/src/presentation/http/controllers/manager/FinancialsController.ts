import { GetManagerFinancialsUseCase } from "app/usecases/player/GetManagerFinancialsUseCase";
import { HttpStatusCode } from "domain/enums/StatusCodes";
import { buildResponse } from "infra/utils/responseBuilder";
import { HttpResponse } from "presentation/http/helpers/HttpResponse";
import { IHttpRequest } from "presentation/http/interfaces/IHttpRequest";
import { IHttpResponse } from "presentation/http/interfaces/IHttpResponse";

export class FinancialsController {
    constructor(
        private _getManagerFinancialsUseCase: GetManagerFinancialsUseCase,
    ) { }


    getReport = async (httpRequest: IHttpRequest): Promise<IHttpResponse> => {
        const managerId = httpRequest.params.managerId;
        console.log(httpRequest.params, " ooooo")
        console.log(managerId)
        const result = await this._getManagerFinancialsUseCase.execute(managerId);

        return new HttpResponse(
            HttpStatusCode.OK,
            buildResponse(true, 'Report generated', result)
        );
    };

}