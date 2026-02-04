import { injectable, inject } from "tsyringe";
import { DI_TOKENS } from "../../../../domain/constants/Identifiers.js";
import { IHttpRequest } from "../../interfaces/IHttpRequest.js";
import { IHttpResponse } from "../../interfaces/IHttpResponse.js";
import { HttpResponse } from "../../helpers/HttpResponse.js";
import { HttpStatusCode } from "../../../../domain/enums/StatusCodes.js";
import { buildResponse } from "../../../../infra/utils/responseBuilder.js";
import { GetChatsUseCase } from "../../../../app/usecases/player/chat/GetChatsUsecase.js";

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
