import { IUpdateUserPlan } from "app/repositories/interfaces/usecases/IPlanUseCaseRepo";
import { IGetPlansAndUserSubscription } from "app/services/SubscriptionServices";
import { SubscriptionMessages } from "domain/constants/admin/AdminSubscriptionMessages";
import { HttpStatusCode } from "domain/enums/StatusCodes";
import { buildResponse } from "infra/utils/responseBuilder";
import { HttpResponse } from "presentation/http/helpers/HttpResponse";
import { IHttpRequest } from "presentation/http/interfaces/IHttpRequest";
import { IHttpResponse } from "presentation/http/interfaces/IHttpResponse";

export class SubscriptionController {
    constructor(
        private _getPlansAndUserSubscription: IGetPlansAndUserSubscription,
        private _updateUserPlanUseCase: IUpdateUserPlan,
    ) { }

    getUserPlan = async (httpRequest: IHttpRequest): Promise<IHttpResponse> => {
        const { userId, role } = httpRequest.params;
        const plans = await this._getPlansAndUserSubscription.execute({userId, role});

        return new HttpResponse(HttpStatusCode.OK, buildResponse(true, SubscriptionMessages.USER_PLAN_FETCHED, plans));
    }

    updateUserPlan = async (httpRequest: IHttpRequest): Promise<IHttpResponse> => {
        const { level, billingCycle } = httpRequest.body;
        const { userId } = httpRequest.params;
        const plans = await this._updateUserPlanUseCase.execute(userId, level, billingCycle);

        return new HttpResponse(HttpStatusCode.OK, buildResponse(true, SubscriptionMessages.USER_PLAN_UPDATED, plans));
    }
}