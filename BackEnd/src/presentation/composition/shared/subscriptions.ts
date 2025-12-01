import { UpdateUserPlan } from "app/usecases/shared/UpdateUserPlan";
import { SubscriptionController } from "presentation/http/controllers/shared/SubscriptionPlanController";
import { planRepository, subscriptionRepository } from "./repositories";
import { logger, razorpayProvider } from "./providers";
import { GetPlansAndUserSubscription } from "infra/services/GetPlansAndUserSubscription";
import { CreatePaymentSession } from "app/usecases/shared/InitiateOrderUseCase";
import { SubscriptionPaymentService } from "infra/services/SubscriptionService";
import { VerifyPaymentUseCase } from "app/usecases/shared/FinalizePaymentUseCase";

const getPlansAndUserSubscription = new GetPlansAndUserSubscription(planRepository, subscriptionRepository, logger);

const updateUserPlanUC = new UpdateUserPlan(subscriptionRepository, logger);
const verifyPaymentUC = new VerifyPaymentUseCase(razorpayProvider);
const createPaymentSessionUC = new CreatePaymentSession(razorpayProvider);

export const subscriptionServices = new SubscriptionPaymentService(verifyPaymentUC, updateUserPlanUC, subscriptionRepository, logger);

export const subscriptionController = new SubscriptionController(getPlansAndUserSubscription, createPaymentSessionUC, subscriptionServices);