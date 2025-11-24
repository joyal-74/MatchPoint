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
        <div>
            <label className="block text-sm font-medium text-neutral-300 mb-3">Payment Method</label>
            <div className="grid grid-cols-3 gap-3">
                {paymentMethods.map((method) => (
                    <button
                        key={method.id}
                        onClick={() => onSelect(method.id)}
                        className={`p-4 rounded-xl border-2 text-left transition-all ${
                            selectedPayment === method.id
                                ? `border-green-500 bg-gradient-to-r ${method.color}/20`
                                : "border-neutral-700 bg-neutral-800 hover:border-neutral-600"
                        }`}
                    >
                        <div className="flex justify-between items-center">
                            <div className="font-semibold text-sm text-white">{method.name}</div>
                            {selectedPayment === method.id && (
                                <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                                    <div className="w-2 h-2 bg-white rounded-full"></div>
                                </div>
                            )}
                        </div>
                    </button>
                ))}
            </div>
        </div>
    );
}