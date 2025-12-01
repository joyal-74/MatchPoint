export const SUBSCRIPTION_ROUTES = {
    GET_PLANS: `/admin/subscriptions/plans`,
    ADD_PLAN: `/admin/subscriptions/plan`,
    INITIALIZE_ORDER: `/subscriptions/plan/order`,
    VERIFY_PAYMENT: `/subscriptions/plan/verify`,
    DELETE_PLAN: (id: string) => `/admin/subscriptions/plan/${id}`,
    GET_USER_PLANS: (userId: string, role: string) => `/subscriptions/roles/${role}/${userId}/plans`,
} as const;