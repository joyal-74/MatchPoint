import { IController } from "presentation/http/interfaces/IController";
import { IHttpRequest } from "presentation/http/interfaces/IHttpRequest";
import { IHttpResponse } from "presentation/http/interfaces/IHttpResponse";
import { HttpResponse } from "presentation/http/helpers/HttpResponse";
import { HttpStatusCode } from "domain/enums/StatusCodes";
import { BadRequestError } from "domain/errors";
import { buildResponse } from "infra/utils/responseBuilder";
import { VerifyOtp } from "app/usecases/authentication/VerifyOtp"; 
import { OtpContext } from "domain/enums/OtpContext";

export class VerifyOtpController implements IController {
    constructor(private verifyOtpUseCase: VerifyOtp) {}

    async handle(httpRequest: IHttpRequest): Promise<IHttpResponse> {
        const { email, otp, context } = httpRequest.body || {};

        if (!email || !otp || !context) {
            throw new BadRequestError("Email, OTP, and context are required");
        }

        // Make sure context is one of the defined ones
        if (!Object.values(OtpContext).includes(context)) {
            throw new BadRequestError("Invalid OTP context");
        }

        const result = await this.verifyOtpUseCase.execute({email, otp, context});

        return new HttpResponse(
            HttpStatusCode.OK,
            buildResponse(true, result.message, result ?? null)
        );
    }
}
