import { injectable, inject } from "tsyringe";
import { DI_TOKENS } from "domain/constants/Identifiers";

import { IGetAdminTransactions, IGetTransactionDetails } from "app/repositories/interfaces/admin/IAdminUsecases";
import { AdminTransactionMessages } from "domain/constants/admin/AdminTransactionMessages";
import { HttpStatusCode } from "domain/enums/StatusCodes";
import { buildResponse } from "infra/utils/responseBuilder";
import { HttpResponse } from "presentation/http/helpers/HttpResponse";
import { IHttpRequest } from "presentation/http/interfaces/IHttpRequest";
import { IHttpResponse } from "presentation/http/interfaces/IHttpResponse";

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