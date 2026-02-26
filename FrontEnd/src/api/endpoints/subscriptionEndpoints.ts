import { SUBSCRIPTION_ROUTES } from "../../constants/routes/SubscriptionRoutes";
import type { Plan } from "../../features/admin/subscription/subscriptionTypes";
import type { UserSubscription, AvailablePlan, InitiateOrderPayload, InitiateOrderResponse, FinalizePaymentPayload, FinalizePaymentResponse, PlanLevel } from "../../features/shared/subscription/subscriptionTypes";
import type { BillingCycle } from "../../pages/admin/shared/subscription/SubscriptionTypes";
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

    updatePlan: async ({ id, newData }: { id: string, newData: Omit<Plan, "_id"> }): Promise<Plan> => {
        const { data } = await axiosClient.put(SUBSCRIPTION_ROUTES.EDIT_PLAN, { id, newData });
        return data.data;
    },

    updatePlanDirectly: async ({userId, planLevel, billingCycle }: { userId: string, planLevel: PlanLevel, billingCycle: BillingCycle }): Promise<Plan> => {
        const { data } = await axiosClient.put(SUBSCRIPTION_ROUTES.UPDATE_PLAN, { userId, planLevel, billingCycle });
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
    
    fetchUserPlan: async ({ userId }: { userId: string}): Promise<UserSubscription> => {
        const { data } = await axiosClient.get(SUBSCRIPTION_ROUTES.GET_USER_PLAN(userId));

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