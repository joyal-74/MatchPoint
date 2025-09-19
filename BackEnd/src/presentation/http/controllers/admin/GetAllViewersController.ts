import { IController } from "presentation/http/interfaces/IController";
import { IHttpRequest } from "presentation/http/interfaces/IHttpRequest";
import { IHttpResponse } from "presentation/http/interfaces/IHttpResponse";
import { HttpResponse } from "presentation/http/helpers/HttpResponse";
import { HttpStatusCode } from "domain/enums/StatusCodes";
import { GetAllViewers } from "app/usecases/admin/GetallViewers";

export class GetAllViewersController implements IController {
    constructor(private getAllViewersUseCase: GetAllViewers) { }

    async handle(_httpRequest: IHttpRequest): Promise<IHttpResponse> {
        const viewers = await this.getAllViewersUseCase.execute();

        return new HttpResponse(HttpStatusCode.OK, {
            success: true,
            message : "Viewers fetched successfully",
            data: viewers,
        });
    }
}