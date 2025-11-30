import { useState, useCallback } from 'react';
import { toast } from 'react-toastify';

function loadRazorpayScript(): Promise<void> {
    return new Promise((resolve, reject) => {
        if (window.Razorpay) return resolve();
        const script = document.createElement("script");
        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        script.onload = () => resolve();
        script.onerror = () => reject(new Error("Failed to load Razorpay SDK"));
        document.body.appendChild(script);
    });
}

interface PaymentOptions {
    key: string;
    amount: number;
    currency: string;
    order_id: string;
    name: string;
    description: string;
    prefill?: { name?: string; email?: string; contact?: string };
    themeColor: string;
}

export function useRazorpayGateway() {
    const [isProcessing, setIsProcessing] = useState(false);

    const initiatePayment = useCallback(
        async (
            options: PaymentOptions,
            onSuccess: (response: RazorpayPaymentResponse) => void,
            onFailure: (error: RazorpayPaymentError | { message: string }) => void
        ) => {
            setIsProcessing(true);

            try {
                await loadRazorpayScript();
            } catch (error) {
                console.log(error)
                toast.error("Failed to load payment gateway script.");
                onFailure({ message: "Failed to load Razorpay SDK" });
                setIsProcessing(false);
                return;
            }

            const rzpOptions: RazorpayOptions = {
                key: options.key,
                amount: options.amount,
                currency: options.currency,
                order_id: options.order_id,
                name: options.name,
                description: options.description,
                prefill: options.prefill,
                theme: { color: options.themeColor },
                handler: (response) => {
                    setIsProcessing(false);
                    onSuccess(response);
                },
                modal: {
                    ondismiss: () => {
                        setIsProcessing(false);
                        onFailure({ message: "Payment was cancelled by the user." });
                    }
                }
            };

            const rzp = new window.Razorpay!(rzpOptions);

            rzp.on("payment.failed", (resp) => {
                setIsProcessing(false);
                onFailure(resp.error);
            });

            rzp.open();
        },
        []
    );

    return { isProcessing, initiatePayment };
}
