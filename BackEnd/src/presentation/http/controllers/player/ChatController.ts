import { GetChatsUseCase } from "app/usecases/player/chat/GetChatsUsecase";
import { HttpStatusCode } from "domain/enums/StatusCodes";
import { buildResponse } from "infra/utils/responseBuilder";
import { HttpResponse } from "presentation/http/helpers/HttpResponse";
import { IHttpRequest } from "presentation/http/interfaces/IHttpRequest";
import { IHttpResponse } from "presentation/http/interfaces/IHttpResponse";

export class ChatController {
    constructor(private readonly getChatsUC: GetChatsUseCase) { }

    getMyChats = async (httpRequest: IHttpRequest) : Promise<IHttpResponse> => {
        const userId = httpRequest.params.userId;

        const data = await this.getChatsUC.execute(userId);

        return new HttpResponse(HttpStatusCode.OK, buildResponse(true, "get my chats success", data));
    };
}