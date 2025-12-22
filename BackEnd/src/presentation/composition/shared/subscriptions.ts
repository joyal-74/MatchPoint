import { UpdateUserPlan } from "app/usecases/shared/UpdateUserPlan";
import { SubscriptionController } from "presentation/http/controllers/shared/SubscriptionPlanController";
import { planRepository, subscriptionRepository, transactionRepo } from "./repositories";
import { logger, razorpayProvider, walletRepository } from "./providers";
import { GetPlansAndUserSubscription } from "infra/services/GetPlansAndUserSubscription";
import { CreatePaymentSession } from "app/usecases/shared/InitiateOrderUseCase";
import { SubscriptionPaymentService } from "infra/services/SubscriptionService";
import { VerifyPaymentUseCase } from "app/usecases/shared/FinalizePaymentUseCase";

const getPlansAndUserSubscription = new GetPlansAndUserSubscription(planRepository, subscriptionRepository, logger);

const updateUserPlanUC = new UpdateUserPlan(subscriptionRepository, logger);
const verifyPaymentUC = new VerifyPaymentUseCase(razorpayProvider);
const createPaymentSessionUC = new CreatePaymentSession(razorpayProvider, planRepository);

export const subscriptionServices = new SubscriptionPaymentService(verifyPaymentUC, updateUserPlanUC, subscriptionRepository, transactionRepo, walletRepository, logger);

export const subscriptionController = new SubscriptionController(getPlansAndUserSubscription, createPaymentSessionUC, subscriptionServices);