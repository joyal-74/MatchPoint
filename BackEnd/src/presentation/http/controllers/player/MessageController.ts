import { injectable, inject } from "tsyringe";
import { DI_TOKENS } from "../../../../domain/constants/Identifiers.js";
import { IHttpRequest } from "../../interfaces/IHttpRequest.js";
import { IHttpResponse } from "../../interfaces/IHttpResponse.js";
import { HttpResponse } from "../../helpers/HttpResponse.js";
import { HttpStatusCode } from "../../../../domain/enums/StatusCodes.js";
import { buildResponse } from "../../../../infra/utils/responseBuilder.js";
import { SendMessageUseCase } from "../../../../app/usecases/player/chat/SendMessageUseCase.js";
import { GetMessagesUseCase } from "../../../../app/usecases/player/chat/GetMessagesUseCase.js";
import { UpdateMessageStatusUseCase } from "../../../../app/usecases/player/chat/UpdateMessageStatusUseCase.js";

@injectable()
export class MessageController {
    constructor(
        @inject(DI_TOKENS.SendMessageUseCase) private _sendMessageUC: SendMessageUseCase,
        @inject(DI_TOKENS.GetMessagesUseCase) private _getMessagesUC: GetMessagesUseCase,
        @inject(DI_TOKENS.UpdateMessageStatusUseCase) private _updateStatusUC: UpdateMessageStatusUseCase
    ) { }

    sendMessage = async (httpRequest: IHttpRequest) : Promise<IHttpResponse> => {
        const { chatId, senderId, text } = httpRequest.body;

        const result = await this._sendMessageUC.execute({
            chatId,
            senderId,
            text,
        });

        return new HttpResponse(HttpStatusCode.OK, buildResponse(true, "message send success", result));
    };

    getMessages = async (httpRequest: IHttpRequest) : Promise<IHttpResponse> => {
        const { chatId } = httpRequest.params;

        const data = await this._getMessagesUC.execute(chatId);

        return new HttpResponse(HttpStatusCode.OK, buildResponse(true, "message send success", data));
    };

    updateStatus = async (httpRequest: IHttpRequest) : Promise<IHttpResponse> => {
        const { messageId } = httpRequest.params;
        const { status } = httpRequest.body;

        await this._updateStatusUC.execute(messageId, status);

        return new HttpResponse(HttpStatusCode.OK, buildResponse(true, "message send success"));
    };
}
