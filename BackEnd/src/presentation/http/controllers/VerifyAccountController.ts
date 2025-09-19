import { IController } from "../interfaces/IController";
import { IHttpRequest } from "../interfaces/IHttpRequest";
import { IHttpResponse } from "../interfaces/IHttpResponse";
import { HttpResponse } from "../helpers/HttpResponse";
import { HttpStatusCode } from "domain/enums/StatusCodes";
import { VerifyAccount } from "app/usecases/Authentication/VerifyAccount";
import { buildResponse } from "infra/utils/responseBuilder";

export class VerifyAccountController implements IController {
    constructor(private verifyAccountUseCase: VerifyAccount) {}

    async handle(httpRequest: IHttpRequest): Promise<IHttpResponse> {
        const { email, otp } = httpRequest.body;

        const result = await this.verifyAccountUseCase.execute({ email, otp });

        return new HttpResponse(HttpStatusCode.OK, buildResponse(true, result.message));
    }
}
