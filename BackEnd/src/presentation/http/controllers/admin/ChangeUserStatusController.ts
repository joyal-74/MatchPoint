import { IController } from "presentation/http/interfaces/IController";
import { IHttpRequest } from "presentation/http/interfaces/IHttpRequest";
import { IHttpResponse } from "presentation/http/interfaces/IHttpResponse";
import { HttpResponse } from "presentation/http/helpers/HttpResponse";
import { HttpStatusCode } from "domain/enums/StatusCodes";
import { ChangeUserStatus } from "app/usecases/admin/ChangeUserStatus";
import { ILogger } from "app/providers/ILogger";

export class ChangeUserStatusController implements IController {
    constructor(
        private changeUserStatus: ChangeUserStatus,
        private logger: ILogger
    ) { }

    async handle(_httpRequest: IHttpRequest): Promise<IHttpResponse> {
        const { role, userId } = _httpRequest.params;
        const { isActive } = _httpRequest.body;

        this.logger.info(`Controller: change status for ${role} with ID ${userId}`);

        const result = await this.changeUserStatus.execute(role, userId, isActive);

        return new HttpResponse(HttpStatusCode.OK, {
            success: true,
            message: "Status changed successfully",
            data: result,
        });
    }
}