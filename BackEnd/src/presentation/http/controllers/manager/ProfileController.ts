import { IUpdateManagerProfile } from "app/repositories/interfaces/IManagerProfileRepository";
import { HttpStatusCode } from "domain/enums/StatusCodes";
import { buildResponse } from "infra/utils/responseBuilder";
import { HttpResponse } from "presentation/http/helpers/HttpResponse";
import { IHttpRequest } from "presentation/http/interfaces/IHttpRequest";
import { IHttpResponse } from "presentation/http/interfaces/IHttpResponse";
import { IProfileController } from "presentation/http/interfaces/IManagerController";

export class ProfileController implements IProfileController {
    constructor(private _profileUpdateUsecase: IUpdateManagerProfile) { }

    async updateProfile(httpRequest: IHttpRequest): Promise<IHttpResponse> {
        const managerData = httpRequest.body;
        const file = httpRequest.file;

        const result = await this._profileUpdateUsecase.execute(managerData, file);

        return new HttpResponse(HttpStatusCode.OK, buildResponse(true, 'Manager profile updated', {
            user: result.user,
        }));
    }
}