import { Plan, UserSubscription } from "../../domain/entities/Plan.js"; 
import { IUseCase } from "../repositories/interfaces/IUseCase.js";


export type SubscriptionFinalizeResult =
  | { status: "completed"; subscription?: UserSubscription }
  | { status: "pending" }
  | { status: "failed"; reason?: string };


export interface IGetPlansAndUserSubscription
  extends IUseCase<{ role: string; userId: string }, { plans: Plan[]; userSubscription: UserSubscription | null }> { _tag?: "GET_PLANS_AND_USER_SUBSCRIPTION"; }


export interface ISubscriptionService {
  finalize(sessionId: string): Promise<SubscriptionFinalizeResult>;
}
