import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../hooks/hooks';
import { useRazorpayGateway } from './useRazorpayGateway';
import type { AvailablePlan } from '../features/shared/subscription/subscriptionTypes';

import { initiateSubscriptionOrder, finalizeSubscriptionPayment } from '../features/shared/subscription/subscriptionThunks';
import toast from 'react-hot-toast';

interface PlanDetails {
    plan: AvailablePlan | null;
    userId: string | undefined;
    userName?: string;
    userEmail?: string;
    userPhone?: string;
    onModalClose: () => void;
}

export function useSubscribePlan({ plan, userId, userEmail, userName, userPhone, onModalClose }: PlanDetails) {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const { isProcessing: isRazorpayProcessing, initiatePayment } = useRazorpayGateway();

    const navigateToSuccess = () => {
        navigate(`/subscription`);
    }

    if (!plan || !userId) {
        return {
            isRazorpayProcessing: false,
            handleRazorpaySubscription: async () => { }
        };
    }

    const handleRazorpaySubscription = async () => {
        if (!userId || plan.price <= 0) {
            toast.error("Invalid user or plan details.");
            return;
        }

        let initiationResult;
        try {
            initiationResult = await dispatch(
                initiateSubscriptionOrder({
                    amount: plan.price,
                    currency: "INR",
                    title: "Premium Subscription",
                    metadata: {
                        type: "subscription",
                        userId: userId,
                        planLevel: plan.level,
                        billingCycle: plan.billingCycle
                    }
                })
            ).unwrap();
            console.log(initiationResult)
        } catch (error) {
            console.log(error)
            toast.error("Failed to prepare order. Please try again.");
            return;
        }

        if (!initiationResult.keyId || !initiationResult.orderId) {
            toast.error("Payment configuration missing from server.");
            return;
        }

        const options = {
            key: initiationResult.keyId,
            amount: plan.price * 100,
            currency: "INR",
            order_id: initiationResult.orderId,
            name: "Premium Subscription",
            description: `Subscription for plan: ${plan.title} (${plan.billingCycle})`,
            prefill: {
                name: userName || "User",
                email: userEmail || "user@example.com",
                contact: userPhone || ""
            },
            themeColor: "#10B981"
        };


        initiatePayment(
            options,
            async (response) => {
                onModalClose();

                try {
                    await dispatch(
                        finalizeSubscriptionPayment({
                            userId: userId,
                            transactionId: initiationResult.transactionId ?? "",
                            paymentId: response.razorpay_payment_id,
                            razorpayOrderId: response.razorpay_order_id,
                            razorpaySignature: response.razorpay_signature,
                        })
                    ).unwrap();

                    // 5. Final Success
                    toast.success(`Subscription updated to ${plan.title}!`);
                    navigateToSuccess();

                } catch (verifyError) {
                    console.error("Subscription Verification Failed:", verifyError);
                    toast.error("Payment verified failed. Contact support with your payment receipt.");
                    navigateToSuccess();
                }
            },
            (error) => {
                console.error("Razorpay Payment Error:", error);

                if ('message' in error && error.message.includes("cancelled")) {
                    toast.error("Subscription payment was cancelled.");
                } else {
                    toast.error("Payment failed. Please try again.");
                }
            }

        );
    }

    return {
        isRazorpayProcessing,
        handleRazorpaySubscription,
    };
}