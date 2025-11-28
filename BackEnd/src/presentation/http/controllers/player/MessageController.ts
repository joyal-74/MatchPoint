import { GetMessagesUseCase } from "app/usecases/player/chat/GetMessagesUseCase";
import { SendMessageUseCase } from "app/usecases/player/chat/SendMessageUseCase";
import { UpdateMessageStatusUseCase } from "app/usecases/player/chat/UpdateMessageStatusUseCase";
import { HttpStatusCode } from "domain/enums/StatusCodes";
import { buildResponse } from "infra/utils/responseBuilder";
import { HttpResponse } from "presentation/http/helpers/HttpResponse";
import { IHttpRequest } from "presentation/http/interfaces/IHttpRequest";
import { IHttpResponse } from "presentation/http/interfaces/IHttpResponse";


export class MessageController {
    constructor(
        private sendMessageUC: SendMessageUseCase,
        private getMessagesUC: GetMessagesUseCase,
        private updateStatusUC: UpdateMessageStatusUseCase
    ) { }

    sendMessage = async (httpRequest: IHttpRequest) : Promise<IHttpResponse> => {
        const { chatId, senderId, text } = httpRequest.body;

        const result = await this.sendMessageUC.execute({
            chatId,
            senderId,
            text,
        });

        return new HttpResponse(HttpStatusCode.OK, buildResponse(true, "message send success", result));
    };

    getMessages = async (httpRequest: IHttpRequest) : Promise<IHttpResponse> => {
        const { chatId } = httpRequest.params;

        const data = await this.getMessagesUC.execute(chatId);

        return new HttpResponse(HttpStatusCode.OK, buildResponse(true, "message send success", data));
    };

    updateStatus = async (httpRequest: IHttpRequest) : Promise<IHttpResponse> => {
        const { messageId } = httpRequest.params;
        const { status } = httpRequest.body;

        await this.updateStatusUC.execute(messageId, status);

        return new HttpResponse(HttpStatusCode.OK, buildResponse(true, "message send success"));
    };
}