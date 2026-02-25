import { injectable, inject } from "tsyringe";
import { DI_TOKENS } from "../../../../domain/constants/Identifiers";
import { IHttpRequest } from "../../interfaces/IHttpRequest";
import { HttpResponse } from "../../helpers/HttpResponse";
import { HttpStatusCode } from "../../../../domain/enums/StatusCodes";
import { buildResponse } from "../../../../infra/utils/responseBuilder";
import {
    ISavePayoutMethodUseCase,
    IGetPayoutMethodUseCase,
    IDeletePayoutMethodUseCase,
    ICreateWalletOrderUseCase,
    IVerifyWalletPaymentUseCase,
    IInitiateWithdrawalUseCase,
    IHandlePayoutWebhookUseCase,
    IGetUserWalletUseCase
} from "../../../../app/repositories/interfaces/usecases/IFinancialUseCases.js";
import { WebhookService } from "../../../../infra/services/WebhookService";
import { IHttpResponse } from "../../interfaces/IHttpResponse";

@injectable()
export class WalletController {
    constructor(
        @inject(DI_TOKENS.SavePayoutMethodUseCase) private _savePayoutMethodUseCase: ISavePayoutMethodUseCase,
        @inject(DI_TOKENS.GetPayoutMethodsUseCase) private _getPayoutMethodsUseCase: IGetPayoutMethodUseCase,
        @inject(DI_TOKENS.DeletePayoutMethodUseCase) private _deletePayoutMethodUseCase: IDeletePayoutMethodUseCase,
        @inject(DI_TOKENS.CreateWalletOrderUseCase) private _createOrder: ICreateWalletOrderUseCase,
        @inject(DI_TOKENS.VerifyWalletPaymentUseCase) private _verifyPayment: IVerifyWalletPaymentUseCase,
        @inject(DI_TOKENS.InitiateWithdrawalUseCase) private _initiateWithdrawal: IInitiateWithdrawalUseCase,
        @inject(DI_TOKENS.HandleWebhookUseCase) private _handleWebhookUseCase: IHandlePayoutWebhookUseCase,
        @inject(DI_TOKENS.GetUserWalletUseCase) private _getUserWalletUseCase: IGetUserWalletUseCase,
        @inject(DI_TOKENS.WebhookService) private _webhookService: WebhookService
    ) { }

    /**
     * POST: Save a new Payout Method (Bank/UPI)
     */
    savePayoutMethod = async (httpRequest: IHttpRequest) => {
        const { userId } = httpRequest.params;
        const { payload } = httpRequest.body;

        const result = await this._savePayoutMethodUseCase.execute(userId, payload);

        return new HttpResponse(
            HttpStatusCode.OK,
            buildResponse(true, "Payout method saved successfully", result)
        );
    };

    /**
     * GET: Retrieve all saved payout methods for a user
     */
    getPayoutMethods = async (httpRequest: IHttpRequest) => {
        const { userId } = httpRequest.params;

        const result = await this._getPayoutMethodsUseCase.execute(userId);

        return new HttpResponse(
            HttpStatusCode.OK,
            buildResponse(true, "Payout methods retrieved", result)
        );
    };

    /**
     * DELETE: Remove a payout method
     */
    deletePayoutMethod = async (httpRequest: IHttpRequest) => {
        const { userId } = httpRequest.params;
        const { payoutId } = httpRequest.body;

        const result = await this._deletePayoutMethodUseCase.execute(userId, payoutId);

        return new HttpResponse(
            HttpStatusCode.OK,
            buildResponse(true, "Payout method removed successfully", result)
        );
    };

    /**
     * POST: Initiate a Razorpay deposit order
     */
    createDepositOrder = async (httpRequest: IHttpRequest) => {
        const { userId } = httpRequest.params;
        const { amount } = httpRequest.body;

        const orderData = await this._createOrder.execute(userId, amount);

        return new HttpResponse(
            HttpStatusCode.OK,
            buildResponse(true, "Deposit order created", orderData)
        );
    };

    /**
     * POST: Verify the Razorpay payment signature and credit wallet
     */
    verifyDeposit = async (httpRequest: IHttpRequest) => {
        const { userId } = httpRequest.params;
        const { paymentData } = httpRequest.body;

        const result = await this._verifyPayment.execute({
            ...paymentData,
            userId
        });

        return new HttpResponse(
            HttpStatusCode.OK,
            buildResponse(true, "Payment verified and wallet credited", result)
        );
    };


    /**
     * POST: Initiate a withdrawal to a Bank Account or UPI ID
     */
    withdraw = async (httpRequest: IHttpRequest) => {
        const { userId } = httpRequest.params;
        const { payoutData, amount } = httpRequest.body;

        if (!amount || amount <= 0) {
            return new HttpResponse(
                HttpStatusCode.BAD_REQUEST,
                buildResponse(false, "Invalid withdrawal amount")
            );
        }

        const result = await this._initiateWithdrawal.execute(
            userId,
            payoutData,
            amount
        );

        return new HttpResponse(
            HttpStatusCode.OK,
            buildResponse(true, "Withdrawal initiated successfully", result)
        );
    };

    handleRazorpayWebhook = async (httpRequest: IHttpRequest) => {
        const isValid = await this._webhookService.verifyProviderSignature(httpRequest);

        if (!isValid) {
            return new HttpResponse(HttpStatusCode.UNAUTHORIZED, buildResponse(false, "Invalid signature"));
        }

        // 2. Delegate to the Use Case
        const { event, payload } = httpRequest.body;
        await this._handleWebhookUseCase.execute(event, payload.payout.entity);

        return new HttpResponse(HttpStatusCode.OK, buildResponse(true, "Webhook processed"));
    };

    getWallet = async (httpRequest: IHttpRequest): Promise<IHttpResponse> => {
        const userId = httpRequest.params.userId;

        const result = await this._getUserWalletUseCase.execute(userId);

        return new HttpResponse(HttpStatusCode.OK, buildResponse(true, 'Wallet report generated', result));
    }
}
