import { IController } from "../../interfaces/IController";
import { IHttpRequest } from "../../interfaces/IHttpRequest";
import { IHttpResponse } from "../../interfaces/IHttpResponse";
import { HttpResponse } from "../../helpers/HttpResponse";
import { HttpStatusCode } from "../../../../domain/enums/StatusCodes";
import { LogoutAdmin } from "app/usecases/authentication/LogoutAdmin";
import { buildResponse } from "../../../../infra/utils/responseBuilder";

export class AdminLogoutController implements IController {
    constructor(private logoutAdminUseCase: LogoutAdmin) { }

    async handle(httpRequest: IHttpRequest): Promise<IHttpResponse> {
        const userId = httpRequest.body.userId;
        const result = await this.logoutAdminUseCase.execute(userId);

        return new HttpResponse(HttpStatusCode.OK, buildResponse(true, result.message));
    }
}
