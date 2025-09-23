import { IController } from "presentation/http/interfaces/IController";
import { IHttpRequest } from "presentation/http/interfaces/IHttpRequest";
import { IHttpResponse } from "presentation/http/interfaces/IHttpResponse";
import { HttpResponse } from "presentation/http/helpers/HttpResponse";
import { HttpStatusCode } from "domain/enums/StatusCodes";
import { BadRequestError } from "domain/errors";
import { buildResponse } from "infra/utils/responseBuilder";
import { ResendOtp } from "app/usecases/authentication/ResendOtp";
import { OtpContext } from "domain/enums/OtpContext";

export class ResendOtpController implements IController {
    constructor(private resendOtpUseCase: ResendOtp) { }

    async handle(httpRequest: IHttpRequest): Promise<IHttpResponse> {
        const { email, context } = httpRequest.body || {};

        if (!email || !context) {
            throw new BadRequestError("Email and context are required");
        }

        // Validate context is one of the defined enums
        if (!Object.values(OtpContext).includes(context)) {
            throw new BadRequestError("Invalid OTP context");
        }

        const result = await this.resendOtpUseCase.execute(email, context);

        return new HttpResponse(
            HttpStatusCode.OK,
            buildResponse(true, result.message, result ?? null)
        );
    }
}