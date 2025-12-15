import { API_PREFIX } from "../../utils/api";

export const SUBSCRIPTION_ROUTES = {
    GET_PLANS: `${API_PREFIX}/admin/subscriptions/plans`,
    ADD_PLAN: `${API_PREFIX}/admin/subscriptions/plan`,
    INITIALIZE_ORDER: `${API_PREFIX}/subscriptions/plan/order`,
    VERIFY_PAYMENT: `${API_PREFIX}/subscriptions/plan/verify`,
    DELETE_PLAN: (id: string) => `${API_PREFIX}/admin/subscriptions/plan/${id}`,
    GET_USER_PLANS: (userId: string, role: string) => `${API_PREFIX}/subscriptions/roles/${role}/${userId}/plans`,
} as const;