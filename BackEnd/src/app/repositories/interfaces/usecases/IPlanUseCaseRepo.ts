import { PaymentSession } from "../../../../app/providers/IPaymentProvider.js";
import { VerifyPaymentResponse } from "../../../../app/usecases/shared/FinalizePaymentUseCase.js";
import { CreatePaymentSessionDTO } from "../../../../app/usecases/shared/InitiateOrderUseCase.js";
import { BillingCycle, Plan, PlanLevel, UserSubscription } from "../../../../domain/entities/Plan.js";

export interface IGetUserSubscriptionPlan {
    execute(userId: string): Promise<UserSubscription | null>
}

export interface ICreatePaymentSession {
    execute(dto: CreatePaymentSessionDTO): Promise<PaymentSession>
}

export interface IVerifyPaymentUseCase {
    execute(sessionId: string): Promise<VerifyPaymentResponse>
}

export interface IUpdateUserPlan {
    execute(userId: string, level: PlanLevel, billingCycle?: BillingCycle) : Promise<UserSubscription>;
}

export interface IUpdateUserDirectlyPlan {
    execute(userId: string, level: PlanLevel, billingCycle?: BillingCycle) : Promise<UserSubscription>;
}

export interface IGetAvailablePlansByRole {
    execute(role: string): Promise<Plan[]>
}
