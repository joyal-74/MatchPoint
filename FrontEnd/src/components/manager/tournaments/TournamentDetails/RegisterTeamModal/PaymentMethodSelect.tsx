import type { PaymentMethod } from "../../../../../hooks/manager/useRegisterTeam";


interface PaymentMethodSelectProps {
    selectedPayment: PaymentMethod;
    onSelect: (method: PaymentMethod) => void;
}

const paymentMethods = [
    { id: "razorpay" as PaymentMethod, name: "UPI & Net Banking", color: "from-green-800 to-green-850" },
    { id: "wallet" as PaymentMethod, name: "Wallet Balance", color: "from-green-800 to-green-850" },
];

export default function PaymentMethodSelect({ selectedPayment, onSelect }: PaymentMethodSelectProps) {
    return (
        <div className="space-y-3">
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Payment Method</label>
            <div className="grid grid-cols-2 gap-3">
                {paymentMethods.map((method) => (
                    <button
                        key={method.id}
                        onClick={() => onSelect(method.id)}
                        className={`p-4 rounded-xl border-2 flex flex-col gap-2 transition-all relative overflow-hidden ${
                            selectedPayment === method.id
                                ? "border-primary bg-primary/5"
                                : "border-border bg-card hover:border-accent"
                        }`}
                    >
                        <div className="font-bold text-sm text-foreground">{method.name}</div>
                        <div className="text-[10px] text-muted-foreground uppercase">Instant Processing</div>
                        {selectedPayment === method.id && (
                            <div className="absolute top-2 right-2 w-4 h-4 bg-primary rounded-full flex items-center justify-center">
                                <div className="w-1.5 h-1.5 bg-primary-foreground rounded-full" />
                            </div>
                        )}
                    </button>
                ))}
            </div>
        </div>
    );
}