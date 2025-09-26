import { UpdateManagerProfile } from "app/usecases/manager/UpdateManagerProfile";
import { HttpStatusCode } from "domain/enums/StatusCodes";
import { buildResponse } from "infra/utils/responseBuilder";
import { HttpResponse } from "presentation/http/helpers/HttpResponse";
import { IController } from "presentation/http/interfaces/IController";
import { IHttpRequest } from "presentation/http/interfaces/IHttpRequest";
import { IHttpResponse } from "presentation/http/interfaces/IHttpResponse";

export class UpdateManagerProfileController implements IController {
    constructor(private updateManagerProfile: UpdateManagerProfile) { }

    async handle(httpRequest: IHttpRequest): Promise<IHttpResponse> {
        const managerData = httpRequest.body;
        const file = httpRequest.file;

        const result = await this.updateManagerProfile.execute(managerData, file);

        return new HttpResponse(HttpStatusCode.OK, buildResponse(true, 'Manager profile updated', {
            user: result.user,
        }));
    }
}