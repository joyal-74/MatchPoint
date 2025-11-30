import { Plan, UserSubscription } from "domain/entities/Plan";
import { IUseCase } from "../repositories/interfaces/IUseCase";


export interface IGetPlansAndUserSubscription
    extends IUseCase<{ role: string; userId: string }, { plans: Plan[]; userSubscription: UserSubscription | null }> 
    { _tag?: "GET_PLANS_AND_USER_SUBSCRIPTION"; }
