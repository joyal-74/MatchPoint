import { Wallet_ROUTES } from "../../constants/routes/walletRoutes";
import type { Transaction } from "../../features/shared/wallet/walletSlice";
import type { IRazorpayOrderResponse, IRazorpayPaymentData, IVerifyPaymentResponse, PayoutMethod, SavePayoutMethodPayload, WithdrawalResponse } from "../../features/shared/wallet/walletTypes";
import axiosClient from "../http/axiosClient";

export const walletEndpoints = {
    saveNewAccountMethod: async ({ userId, payload }: { userId: string, payload: SavePayoutMethodPayload }): Promise<PayoutMethod> => {
        const { data } = await axiosClient.post(Wallet_ROUTES.SAVE_ACCOUNT_METHOD(userId), { payload });
        return data.data;
    },

    fetchPayoutMethods: async (userId: string): Promise<PayoutMethod[]> => {
        const { data } = await axiosClient.get(Wallet_ROUTES.GET_ACCOUNT_METHOD(userId));
        return data.data;
    },

    deletePayoutMethod: async ({ userId, payoutId }: { userId: string, payoutId: string }): Promise<PayoutMethod[]> => {
        const { data } = await axiosClient.delete(Wallet_ROUTES.DELETE_ACCOUNT_METHOD(userId), {
            data: { payoutId }
        });
        return data.data;
    },

    createRazorpayOrder: async ({ userId, amount }: { userId: string, amount: number }): Promise<IRazorpayOrderResponse> => {
        const { data } = await axiosClient.post(Wallet_ROUTES.CREATE_WALLET_PAYMENT(userId), { amount });
        return data.data;
    },

    verifyPayment: async (paymentData: IRazorpayPaymentData): Promise<IVerifyPaymentResponse> => {
        const { data } = await axiosClient.post(Wallet_ROUTES.VERIFY_WALLET_PAYMENT(paymentData.userId), { paymentData });
        return data.data;
    },

    initiateWithdrawal: async ({ userId, payoutData, amount }: { userId: string, payoutData: string | SavePayoutMethodPayload, amount: number }): Promise<WithdrawalResponse> => {
        const { data } = await axiosClient.post(Wallet_ROUTES.WALLET_WITHDRAWAL(userId), { payoutData, amount });
        return data.data;
    },

    fetchUserPayments: async (userId: string): Promise<{ balance: number, transactions: Transaction[] }> => {
        const { data } = await axiosClient.get(Wallet_ROUTES.GET_USER_WALLET(userId));
        return data.data;
    },
};