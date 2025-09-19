import { IController } from "presentation/http/interfaces/IController";
import { IHttpRequest } from "presentation/http/interfaces/IHttpRequest";
import { IHttpResponse } from "presentation/http/interfaces/IHttpResponse";
import { HttpResponse } from "presentation/http/helpers/HttpResponse";
import { HttpStatusCode } from "domain/enums/StatusCodes";
import { GetAllPlayers } from "app/usecases/admin/GetAllPlayers";

export class GetAllPlayersController implements IController {
    constructor(private getAllPlayersUseCase: GetAllPlayers) { }

    async handle(_httpRequest: IHttpRequest): Promise<IHttpResponse> {
        const Players = await this.getAllPlayersUseCase.execute();

        return new HttpResponse(HttpStatusCode.OK, {
            success: true,
            message : "Players fetched successfully",
            data: Players,
        });
    }
}