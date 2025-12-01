import { SUBSCRIPTION_ROUTES } from "../../constants/SubscriptionRoutes";
import type { Plan } from "../../features/admin/subscription/subscriptionTypes";
import type { UserSubscription, AvailablePlan, InitiateOrderPayload, InitiateOrderResponse, FinalizePaymentPayload, FinalizePaymentResponse } from "../../features/shared/subscription/subscriptionTypes";
import axiosClient from "../http/axiosClient";

export const subscriptionEndpoints = {

    // Admin side
    fetchPlans: async (): Promise<Plan[]> => {
        const { data } = await axiosClient.get(SUBSCRIPTION_ROUTES.GET_PLANS);
        return data.data;
    },


    addPlan: async (newPlan: Omit<Plan, "_id">): Promise<Plan> => {
        const { data } = await axiosClient.post(SUBSCRIPTION_ROUTES.ADD_PLAN, newPlan);
        return data.data;
    },

    deletePlan: async (id: string): Promise<string> => {
        await axiosClient.delete(SUBSCRIPTION_ROUTES.DELETE_PLAN(id));
        return id;
    },

    // User side
    fetchAvailablePlans: async ({ userId, role }: { userId: string, role: string }): Promise<{ plans: AvailablePlan[], userSubscription: UserSubscription }> => {
        const { data } = await axiosClient.get(SUBSCRIPTION_ROUTES.GET_USER_PLANS(userId, role));

        return data.data;
    },

    initiateOrder: async (InitiateOrderPayload: InitiateOrderPayload): Promise<InitiateOrderResponse> => {
        const { data } = await axiosClient.post(SUBSCRIPTION_ROUTES.INITIALIZE_ORDER, InitiateOrderPayload);

        return data.data;
    },

    finalizePayment: async (finalizePayment: FinalizePaymentPayload): Promise<FinalizePaymentResponse> => {
        const { data } = await axiosClient.post(SUBSCRIPTION_ROUTES.VERIFY_PAYMENT, finalizePayment);
        return data.data;
    }
};