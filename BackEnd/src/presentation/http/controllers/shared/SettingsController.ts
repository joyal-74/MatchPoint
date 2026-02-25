import { injectable, inject } from "tsyringe";
import { DI_TOKENS } from "../../../../domain/constants/Identifiers";
import { IHttpRequest } from "../../interfaces/IHttpRequest";
import { HttpResponse } from "../../helpers/HttpResponse";
import { HttpStatusCode } from "../../../../domain/enums/StatusCodes";
import { buildResponse } from "../../../../infra/utils/responseBuilder";
import { IUpdatePasswordUseCase, IUpdatePrivacyUseCase, IVerifyPasswordUseCase } from "../../../../app/repositories/interfaces/usecases/ISettingsUseCaseRepo";

@injectable()
export class SettingsController {
    constructor(
        @inject(DI_TOKENS.VerifyPasswordUseCase) private _verifyPasswordUseCase: IVerifyPasswordUseCase,
        @inject(DI_TOKENS.UpdatePasswordUseCase) private _updatePasswordUseCase: IUpdatePasswordUseCase,
        @inject(DI_TOKENS.UpdatePrivacyUseCase) private _updatePrivacyUseCase: IUpdatePrivacyUseCase
    ) { }

    verifyPassword = async (httpRequest: IHttpRequest) => {
        const { userId, password } = httpRequest.body;
        const isValid = await this._verifyPasswordUseCase.execute(userId, password);

        if (!isValid) {
            return new HttpResponse(HttpStatusCode.UNAUTHORIZED, buildResponse(false, "Incorrect password"));
        }

        return new HttpResponse(HttpStatusCode.OK, buildResponse(true, "Password verified", "Password verified"));
    };

    // PATCH /update-password
    updatePassword = async (httpRequest: IHttpRequest) => {
        const { userId, currentPassword, newPassword } = httpRequest.body;
        const message = await this._updatePasswordUseCase.execute(userId, currentPassword, newPassword);

        return new HttpResponse(HttpStatusCode.OK, buildResponse(true, "Password verified", message));
    };

    // PATCH /update-privacy
    updatePrivacy = async (httpRequest: IHttpRequest) => {
        const { userId, language, country } = httpRequest.body;
        const message = await this._updatePrivacyUseCase.execute(userId, language, country);

        return new HttpResponse(HttpStatusCode.OK, buildResponse(true, "Settings updated", message));
    };
}
