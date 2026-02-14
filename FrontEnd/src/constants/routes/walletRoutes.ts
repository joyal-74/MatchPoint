import { API_PREFIX } from "../../utils/api";

export const Wallet_ROUTES = {
    SAVE_ACCOUNT_METHOD: (userId: string) => `${API_PREFIX}/wallet/${userId}/save`,
    GET_ACCOUNT_METHOD: (userId: string) => `${API_PREFIX}/wallet/${userId}/methods`,
    DELETE_ACCOUNT_METHOD: (userId: string) => `${API_PREFIX}/wallet/${userId}/remove`,
    CREATE_WALLET_PAYMENT: (userId: string) => `${API_PREFIX}/wallet/${userId}/add-money`,
    VERIFY_WALLET_PAYMENT: (userId: string) => `${API_PREFIX}/wallet/${userId}/verify`,
    WALLET_WITHDRAWAL: (userId: string) => `${API_PREFIX}/wallet/${userId}/withdraw`,
} as const;