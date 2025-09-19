import { IController } from "presentation/http/interfaces/IController";
import { IHttpRequest } from "presentation/http/interfaces/IHttpRequest";
import { IHttpResponse } from "presentation/http/interfaces/IHttpResponse";
import { HttpResponse } from "presentation/http/helpers/HttpResponse";
import { HttpStatusCode } from "domain/enums/StatusCodes";
import { BadRequestError } from "domain/errors";
import { buildResponse } from "infra/utils/responseBuilder";
import { ForgotPassword } from "app/usecases/authentication/ForgotPassword";

export class ForgotPasswordController implements IController {
    constructor(private forgotPasswordUseCase: ForgotPassword) {}

    async handle(httpRequest: IHttpRequest): Promise<IHttpResponse> {
        const { email } = httpRequest.body || {};

        if (!email ) {
            throw new BadRequestError("Email is missing");
        }

        const result = await this.forgotPasswordUseCase.execute(email);

        return new HttpResponse(
            HttpStatusCode.OK,
            buildResponse(true, result.message)
        );
    }
}
