import { UpdateUserPlan } from "app/usecases/shared/UpdateUserPlan";
import { SubscriptionController } from "presentation/http/controllers/shared/SubscriptionPlanController";
import { planRepository, subscriptionRepository } from "./repositories";
import { logger } from "./providers";
import { GetPlansAndUserSubscription } from "infra/services/GetPlansAndUserSubscription";

const getPlansAndUserSubscription = new GetPlansAndUserSubscription(planRepository, subscriptionRepository, logger);

const updateUserPlanUseCase = new UpdateUserPlan(subscriptionRepository, logger);


export const subscriptionController = new SubscriptionController(getPlansAndUserSubscription, updateUserPlanUseCase);