import { IController } from "presentation/http/interfaces/IController";
import { IHttpRequest } from "presentation/http/interfaces/IHttpRequest";
import { IHttpResponse } from "presentation/http/interfaces/IHttpResponse";
import { HttpResponse } from "presentation/http/helpers/HttpResponse";
import { HttpStatusCode } from "domain/enums/StatusCodes";
import { GetAllManagers } from "app/usecases/admin/GetAllManagers";

export class GetAllManagersController implements IController {
    constructor(private getAllManagersUseCase: GetAllManagers) { }

    async handle(_httpRequest: IHttpRequest): Promise<IHttpResponse> {
        const Managers = await this.getAllManagersUseCase.execute();

        return new HttpResponse(HttpStatusCode.OK, {
            success: true,
            message : "Managers fetched successfully",
            data: Managers,
        });
    }
}