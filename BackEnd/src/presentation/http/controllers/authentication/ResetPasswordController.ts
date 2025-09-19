import { IController } from "presentation/http/interfaces/IController";
import { IHttpRequest } from "presentation/http/interfaces/IHttpRequest";
import { IHttpResponse } from "presentation/http/interfaces/IHttpResponse";
import { HttpResponse } from "presentation/http/helpers/HttpResponse";
import { HttpStatusCode } from "domain/enums/StatusCodes";
import { BadRequestError } from "domain/errors";
import { buildResponse } from "infra/utils/responseBuilder";
import { ResetPassword } from "app/usecases/authentication/ResetPassword";

export class ResetPasswordController implements IController {
    constructor(private resetPasswordUseCase: ResetPassword) { }

    async handle(httpRequest: IHttpRequest): Promise<IHttpResponse> {
        const { email, newPassword } = httpRequest.body || {};

        if (!email || !newPassword) {
            throw new BadRequestError("Missing required fields: email, newPassword");
        }

        const result = await this.resetPasswordUseCase.execute(email, newPassword);

        return new HttpResponse(
            HttpStatusCode.OK,
            buildResponse(true, result.message)
        );
    }
}
