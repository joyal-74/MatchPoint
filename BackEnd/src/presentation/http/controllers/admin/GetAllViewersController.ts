import { IController } from "presentation/http/interfaces/IController";
import { IHttpRequest } from "presentation/http/interfaces/IHttpRequest";
import { IHttpResponse } from "presentation/http/interfaces/IHttpResponse";
import { HttpResponse } from "presentation/http/helpers/HttpResponse";
import { HttpStatusCode } from "domain/enums/StatusCodes";
import { GetAllViewers } from "app/usecases/admin/GetAllViewers";

export class GetAllViewersController implements IController {
    constructor(private getAllViewersUseCase: GetAllViewers) { }

    async handle(_httpRequest: IHttpRequest): Promise<IHttpResponse> {
        const { page = 1, limit = 10, filter, search } = _httpRequest.query;

        const result = await this.getAllViewersUseCase.execute({
            page: Number(page),
            limit: Number(limit),
            filter: filter as string | undefined,
            search: search as string | undefined,
        });

        return new HttpResponse(HttpStatusCode.OK, {
            success: true,
            message: "Viewers fetched successfully",
            data: result,
        });
    }
}
