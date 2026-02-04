import { injectable, inject } from "tsyringe";
import { DI_TOKENS } from "./../../../../domain/constants/Identifiers.js";

import { IGetAdminTransactions, IGetTransactionDetails } from "../../../../app/repositories/interfaces/admin/IAdminUsecases.js";
import { IHttpRequest } from "../../interfaces/IHttpRequest.js";
import { IHttpResponse } from "../../interfaces/IHttpResponse.js";
import { HttpResponse } from "../../helpers/HttpResponse.js";
import { HttpStatusCode } from "../../../../domain/enums/StatusCodes.js";
import { buildResponse } from "../../../../infra/utils/responseBuilder.js";
import { AdminTransactionMessages } from "../../../../domain/constants/admin/AdminTransactionMessages.js";

@injectable()
export class AdminTransactionController {
    constructor(
        @inject(DI_TOKENS.GetAdminTransactionsUseCase) private _getadminTransactionsUseCase: IGetAdminTransactions,
        @inject(DI_TOKENS.GetTransactionDetailsUseCase) private _getTransactionDetailsUseCase: IGetTransactionDetails,
    ) { }

    getTransactions = async (httpRequest: IHttpRequest): Promise<IHttpResponse> => {
        const { page = 1, limit = 5, filter, search } = httpRequest.query;

        const data = await this._getadminTransactionsUseCase.execute({ page, limit, filter, search });

        return new HttpResponse(HttpStatusCode.OK, buildResponse(true, AdminTransactionMessages.TRANSACTIONS_FETCHED, data));
    }

    getTransactionDetails = async (httpRequest: IHttpRequest): Promise<IHttpResponse> => {
        const { id } = httpRequest.params;

        const data = await this._getTransactionDetailsUseCase.execute(id);

        return new HttpResponse(HttpStatusCode.OK, buildResponse(true, AdminTransactionMessages.TRANSACTIONS_FETCHED, data));
    }
}
