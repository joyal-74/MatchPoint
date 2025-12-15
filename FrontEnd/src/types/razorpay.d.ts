export { };

declare global {
  interface Window {
    Razorpay?: Razorpay;
  }
  interface Razorpay {
    new(options: RazorpayOptions): RazorpayInstance;
  }
  interface RazorpayInstance {
    open(): void;
    on(event: "payment.failed", handler: (resp: { error: RazorpayPaymentError }) => void): void;
  }
  interface RazorpayOptions {
    key: string;
    amount: number;
    currency: string;
    order_id: string;
    name: string;
    description: string;
    prefill?: { name?: string; email?: string; contact?: string };
    theme?: { color?: string };
    handler?: (response: RazorpayPaymentResponse) => void;
    modal?: { ondismiss?: () => void };
  }
  interface RazorpayPaymentResponse {
    razorpay_payment_id: string;
    razorpay_order_id: string;
    razorpay_signature: string;
  }
  interface RazorpayPaymentError {
    code: string;
    description: string;
    source: string;
    step: string;
    reason: string;
    metadata: { payment_id?: string; order_id?: string };
  }
}
