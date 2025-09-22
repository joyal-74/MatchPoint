import { IController } from "presentation/http/interfaces/IController";
import { IHttpRequest } from "presentation/http/interfaces/IHttpRequest";
import { IHttpResponse } from "presentation/http/interfaces/IHttpResponse";
import { HttpResponse } from "presentation/http/helpers/HttpResponse";
import { HttpStatusCode } from "domain/enums/StatusCodes";
import { GetAllManagers } from "app/usecases/admin/GetAllManagers";

export class GetAllManagersController implements IController {
    constructor(private getAllManagersUseCase: GetAllManagers) { }

    async handle(_httpRequest: IHttpRequest): Promise<IHttpResponse> {
        const { page = 1, limit = 10, filter, search } = _httpRequest.query;

        const Managers = await this.getAllManagersUseCase.execute({
            page: Number(page),
            limit: Number(limit),
            filter: filter as string | undefined,
            search: search as string | undefined,
        });

        return new HttpResponse(HttpStatusCode.OK, {
            success: true,
            message: "Managers fetched successfully",
            data: Managers,
        });
    }
}