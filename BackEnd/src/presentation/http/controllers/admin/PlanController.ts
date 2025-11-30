import { IGetPlans, ICreatePlan, IDeletePlan } from "app/repositories/interfaces/admin/IAdminUsecases";
import { SubscriptionMessages } from "domain/constants/admin/AdminSubscriptionMessages";
import { HttpStatusCode } from "domain/enums/StatusCodes";
import { buildResponse } from "infra/utils/responseBuilder";
import { HttpResponse } from "presentation/http/helpers/HttpResponse";
import { IHttpRequest } from "presentation/http/interfaces/IHttpRequest";
import { IHttpResponse } from "presentation/http/interfaces/IHttpResponse";

export class PlanController {
    constructor(
        private _getPlansUseCase: IGetPlans,
        private _createPlanUseCase: ICreatePlan,
        private _deletePlanUseCase: IDeletePlan,
    ) { }

    create = async (httpRequest: IHttpRequest): Promise<IHttpResponse> => {
        const planData = httpRequest.body
        console.log(httpRequest.body, "kjghkdgjh")
        const plan = await this._createPlanUseCase.execute(planData);

        return new HttpResponse(HttpStatusCode.CREATED, buildResponse(true, SubscriptionMessages.PLAN_CREATED, plan));
    }

    getAll = async (): Promise<IHttpResponse> => {

        const plans = await this._getPlansUseCase.execute();

        return new HttpResponse(HttpStatusCode.OK, buildResponse(true, SubscriptionMessages.PLAN_FETCHED, plans));
    }

    delete = async (httpRequest: IHttpRequest): Promise<IHttpResponse> => {
        const { id } = httpRequest.params;
        const deleted = await this._deletePlanUseCase.execute(id);

        if (!deleted) {
            return new HttpResponse(HttpStatusCode.NOT_FOUND, buildResponse(true, SubscriptionMessages.PLAN_NOT_FOUND));
        }

        return new HttpResponse(HttpStatusCode.CREATED, buildResponse(true, SubscriptionMessages.PLAN_DELETED));
    }

}