import { IUpdatePasswordUseCase, IUpdatePrivacyUseCase, IVerifyPasswordUseCase } from "app/repositories/interfaces/usecases/ISettingsUseCaseRepo";
import { HttpStatusCode } from "domain/enums/StatusCodes";
import { buildResponse } from "infra/utils/responseBuilder";
import { HttpResponse } from "presentation/http/helpers/HttpResponse";
import { IHttpRequest } from "presentation/http/interfaces/IHttpRequest";


export class SettingsController {
    constructor(
        private verifyPasswordUseCase: IVerifyPasswordUseCase,
        private updatePasswordUseCase: IUpdatePasswordUseCase,
        private updatePrivacyUseCase: IUpdatePrivacyUseCase
    ) { }

    verifyPassword = async (httpRequest: IHttpRequest) => {
        const { userId, password } = httpRequest.body;
        const isValid = await this.verifyPasswordUseCase.execute(userId, password);

        if (!isValid) {
            return new HttpResponse(HttpStatusCode.UNAUTHORIZED, buildResponse(false, "Incorrect password"));
        }

        return new HttpResponse(HttpStatusCode.OK, buildResponse(true, "Password verified", "Password verified"));
    };

    // PATCH /update-password
    updatePassword = async (httpRequest: IHttpRequest) => {
        const { userId, currentPassword, newPassword } = httpRequest.body;
        const message = await this.updatePasswordUseCase.execute(userId, currentPassword, newPassword);

        return new HttpResponse(HttpStatusCode.OK, buildResponse(true, "Password verified", message));
    };

    // PATCH /update-privacy
    updatePrivacy = async (httpRequest: IHttpRequest) => {
        const { userId, language, country } = httpRequest.body;
        const message = await this.updatePrivacyUseCase.execute(userId, language, country);

        return new HttpResponse(HttpStatusCode.OK, buildResponse(true, "Settings updated", message));
    };
}