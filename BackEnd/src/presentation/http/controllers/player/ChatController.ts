import { injectable, inject } from "tsyringe";
import { DI_TOKENS } from "../../../../domain/constants/Identifiers";
import { IHttpRequest } from "../../interfaces/IHttpRequest";
import { IHttpResponse } from "../../interfaces/IHttpResponse";
import { HttpResponse } from "../../helpers/HttpResponse";
import { HttpStatusCode } from "../../../../domain/enums/StatusCodes";
import { buildResponse } from "../../../../infra/utils/responseBuilder";
import { GetChatsUseCase } from "../../../../app/usecases/player/chat/GetChatsUsecase";

@injectable()
export class ChatController {
    constructor(
        @inject(DI_TOKENS.GetChatsUseCase) private _getChatsUC: GetChatsUseCase
    ) { }

    getMyChats = async (httpRequest: IHttpRequest): Promise<IHttpResponse> => {
        const userId = httpRequest.params.userId;

        const data = await this._getChatsUC.execute(userId);

        return new HttpResponse(HttpStatusCode.OK, buildResponse(true, "get my chats success", data));
    };
}
