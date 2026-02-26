import { injectable, inject } from "tsyringe";
import { DI_TOKENS } from "../../../../domain/constants/Identifiers";
import { IHttpRequest } from "../../interfaces/IHttpRequest";
import { IHttpResponse } from "../../interfaces/IHttpResponse";
import { HttpResponse } from "../../helpers/HttpResponse";
import { HttpStatusCode } from "../../../../domain/enums/StatusCodes";
import { buildResponse } from "../../../../infra/utils/responseBuilder";
import { IGetPlansAndUserSubscription, ISubscriptionService } from "../../../../app/services/ISubscriptionServices";
import { ICreatePaymentSession, IGetUserSubscriptionPlan, IUpdateUserDirectlyPlan } from "../../../../app/repositories/interfaces/usecases/IPlanUseCaseRepo";
import { SubscriptionMessages } from "../../../../domain/constants/admin/AdminSubscriptionMessages";

@injectable()
export class SubscriptionController {
    constructor(
        @inject(DI_TOKENS.GetPlansAndUserSubscription) private _getPlansAndUserSubscription: IGetPlansAndUserSubscription,
        @inject(DI_TOKENS.CreatePaymentSession) private _createPaymentSessionUseCase: ICreatePaymentSession,
        @inject(DI_TOKENS.UpdateUserDirectlyPlan) private _updatePlanDirectUseCase: IUpdateUserDirectlyPlan,
        @inject(DI_TOKENS.SubscriptionService) private _subscriptionPaymentService: ISubscriptionService,
        @inject(DI_TOKENS.GetUserSubscriptionPlan) private _getUserSubscription: IGetUserSubscriptionPlan,
    ) { }

    getUserPlan = async (httpRequest: IHttpRequest): Promise<IHttpResponse> => {
        const { userId, role } = httpRequest.params;
        const plans = await this._getPlansAndUserSubscription.execute({ userId, role });

        return new HttpResponse(HttpStatusCode.OK, buildResponse(true, SubscriptionMessages.USER_PLAN_FETCHED, plans));
    }

    getUserPlanOnly = async (httpRequest: IHttpRequest): Promise<IHttpResponse> => {
        const { userId } = httpRequest.params;
        const plan = await this._getUserSubscription.execute(userId);

        return new HttpResponse(HttpStatusCode.OK, buildResponse(true, SubscriptionMessages.USER_PLAN_FETCHED, plan));
    }

    initiateOrder = async (httpRequest: IHttpRequest): Promise<IHttpResponse> => {
        const { amount, currency, title, metadata } = httpRequest.body;

        const plans = await this._createPaymentSessionUseCase.execute({ amount, currency, title, metadata });

        return new HttpResponse(HttpStatusCode.CREATED, buildResponse(true, "Subscription payment created successfully", plans));
    }


    finalizeOrder = async (httpRequest: IHttpRequest): Promise<IHttpResponse> => {
        const { paymentId } = httpRequest.body;

        const result = await this._subscriptionPaymentService.finalize(paymentId);

        let message: string;

        switch (result.status) {
            case "completed":
                message = "Subscription updated successfully";
                break;
            case "pending":
                message = "Payment is still pending";
                break;
            case "failed":
            default:
                message = result.reason ?? "Payment verification failed";
        }

        return new HttpResponse(HttpStatusCode.OK, buildResponse(true, message, result));
    }

    updatePlan = async (httpRequest: IHttpRequest): Promise<IHttpResponse> => {
        const { userId, planLevel, billingCycle } = httpRequest.body;

        const plans = await this._updatePlanDirectUseCase.execute(userId, planLevel, billingCycle);

        return new HttpResponse(HttpStatusCode.CREATED, buildResponse(true, "Subscription plan changed successfully", plans));
    }
}
