import { injectable, inject } from "tsyringe";
import { DI_TOKENS } from "../../../../domain/constants/Identifiers.js";
import { IHttpRequest } from "../../interfaces/IHttpRequest.js";
import { IHttpResponse } from "../../interfaces/IHttpResponse.js";
import { HttpResponse } from "../../helpers/HttpResponse.js";
import { HttpStatusCode } from "../../../../domain/enums/StatusCodes.js";
import { buildResponse } from "../../../../infra/utils/responseBuilder.js";
import { ICreatePlan, IDeletePlan, IGetPlans, IUpdatePlan } from "../../../../app/repositories/interfaces/admin/IAdminUsecases.js";
import { SubscriptionMessages } from "../../../../domain/constants/admin/AdminSubscriptionMessages.js";

@injectable()
export class PlanController {
    constructor(
        @inject(DI_TOKENS.GetPlansUseCase) private _getPlansUseCase: IGetPlans,
        @inject(DI_TOKENS.CreatePlanUseCase) private _createPlanUseCase: ICreatePlan,
        @inject(DI_TOKENS.DeletePlanUseCase) private _deletePlanUseCase: IDeletePlan,
        @inject(DI_TOKENS.UpdatePlanUseCase) private _updatePlanUseCase: IUpdatePlan,
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

    update = async (httpRequest: IHttpRequest): Promise<IHttpResponse> => {
        const { id, newData } = httpRequest.body;
        const updated = await this._updatePlanUseCase.execute(id, newData);

        if (!updated) {
            return new HttpResponse(HttpStatusCode.NOT_FOUND, buildResponse(true, SubscriptionMessages.PLAN_NOT_FOUND));
        }

        return new HttpResponse(HttpStatusCode.CREATED, buildResponse(true, SubscriptionMessages.PLAN_UPDATED, updated));
    }
}
