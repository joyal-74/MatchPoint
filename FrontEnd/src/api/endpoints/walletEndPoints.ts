import { Wallet_ROUTES } from "../../constants/routes/walletRoutes";
import type { IRazorpayOrderResponse, IRazorpayPaymentData, IVerifyPaymentResponse, PayoutMethod, SavePayoutMethodPayload, WithdrawalResponse } from "../../features/manager/financials/financialTypes";
import axiosClient from "../http/axiosClient";

export const walletEndpoints = {
    saveNewAccountMethod: async ({ managerId, payload }: { managerId: string, payload: SavePayoutMethodPayload }): Promise<PayoutMethod> => {
        const { data } = await axiosClient.post(Wallet_ROUTES.SAVE_ACCOUNT_METHOD(managerId), { payload });
        return data.data;
    },

    fetchPayoutMethods: async (managerId: string): Promise<PayoutMethod[]> => {
        const { data } = await axiosClient.get(Wallet_ROUTES.GET_ACCOUNT_METHOD(managerId));
        return data.data;
    },

    deletePayoutMethod: async ({ managerId, payoutId }: { managerId: string, payoutId: string }): Promise<PayoutMethod[]> => {
        const { data } = await axiosClient.delete(Wallet_ROUTES.DELETE_ACCOUNT_METHOD(managerId), {
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

    initiateWithdrawal: async ({ managerId, payoutData, amount }: { managerId: string, payoutData: string | SavePayoutMethodPayload, amount: number }): Promise<WithdrawalResponse> => {
        const { data } = await axiosClient.post(Wallet_ROUTES.WALLET_WITHDRAWAL(managerId), { payoutData, amount });
        return data.data;
    },
};