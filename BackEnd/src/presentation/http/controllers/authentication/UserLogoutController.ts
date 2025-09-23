import { IController } from "../../interfaces/IController";
import { IHttpRequest } from "../../interfaces/IHttpRequest";
import { IHttpResponse } from "../../interfaces/IHttpResponse";
import { HttpResponse } from "../../helpers/HttpResponse";
import { HttpStatusCode } from "../../../../domain/enums/StatusCodes";
import { LogoutUser } from "app/usecases/authentication/LogoutUser";
import { buildResponse } from "../../../../infra/utils/responseBuilder";

export class UserLogoutController implements IController {
    constructor(private logoutUserUseCase: LogoutUser) { }

    async handle(httpRequest: IHttpRequest): Promise<IHttpResponse> {
        const {userId, role} = httpRequest.body;

        const result = await this.logoutUserUseCase.execute(userId, role);

        return new HttpResponse(HttpStatusCode.OK, buildResponse(true, result.message));
    }
}