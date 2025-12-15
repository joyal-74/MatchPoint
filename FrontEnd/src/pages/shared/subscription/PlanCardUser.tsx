import { ArrowUpCircle, Check, Tag } from "lucide-react";
import type { AvailablePlan, PlanLevel } from "./SubscriptionTypes";
import { UserButton } from "./UserButton";

export const PlanCardUser: React.FC<{
    plan: AvailablePlan;
    currentLevel: PlanLevel;
    onChoosePlan: (plan: AvailablePlan) => void;
    loading?: boolean;
}> = ({ plan, currentLevel, onChoosePlan }) => {

    const isCurrent = plan.level === currentLevel;
    const isFreePlan = plan.level === "Free";
    const isPremiumUser = currentLevel !== "Free";
    const disableFreeForPremiumUser = isFreePlan && isPremiumUser;
    const isDisabled = isCurrent || disableFreeForPremiumUser;

    const buttonVariant = isCurrent
        ? "current"
        : disableFreeForPremiumUser
            ? "tertiary"
            : (plan.level === "Super" ? "secondary" : "primary");

    // Minimal color schemes
    const getPlanColors = () => {
        if (isCurrent) {
            return {
                card: "bg-cyan-950/50",
                border: "border-l-4 border-cyan-500",
                title: "text-cyan-400",
                price: "text-cyan-400",
                accent: "text-cyan-400"
            };
        }

        switch (plan.level) {
            case "Premium":
                return {
                    card: "bg-neutral-900",
                    border: "border-l-4 border-purple-500",
                    title: "text-neutral-100",
                    price: "text-purple-400",
                    accent: "text-purple-400"
                };
            case "Super":
                return {
                    card: "bg-neutral-900",
                    border: "border-l-4 border-blue-500",
                    title: "text-neutral-100",
                    price: "text-blue-400",
                    accent: "text-blue-400"
                };
            default:
                return {
                    card: "bg-neutral-900",
                    border: "border-l-4 border-neutral-700",
                    title: "text-neutral-100",
                    price: "text-neutral-400",
                    accent: "text-neutral-400"
                };
        }
    };

    const colors = getPlanColors();

    return (
        <div
            className={`relative p-6 rounded-lg flex flex-col h-full 
                ${colors.card} ${colors.border}
                transition-all duration-200 hover:bg-opacity-80
            `}
        >
            {/* Minimal badge for popular plan */}
            {plan.level === 'Super' && (
                <div className="absolute -top-2 right-4 bg-purple-500 text-white text-xs font-semibold px-3 py-1 rounded-full">
                    Popular
                </div>
            )}

            <div className="flex-grow">
                {/* Title */}
                <div className="mb-5">
                    <div className="flex justify-between items-center mb-1">
                        <h3 className={`text-xl font-bold ${colors.title}`}>
                            {plan.title}
                        </h3>
                        {isCurrent && <Check className={`w-5 h-5 ${colors.accent}`} />}
                    </div>
                    <p className="text-sm text-neutral-400">{plan.description}</p>
                </div>

                {/* Price */}
                <div className="mb-6">
                    <p className={`text-4xl font-bold ${colors.price} flex items-end gap-1`}>
                        {plan.level === "Free" ? "Free" : `₹${plan.price}`}

                        {plan.level !== "Free" && plan.price > 0 && (
                            <span className="text-sm opacity-80 mb-1">
                                /{plan.billingCycle?.toLowerCase() ?? "monthly"}
                            </span>
                        )}
                    </p>
                </div>

                {/* Features */}
                <ul className="space-y-2 text-neutral-300 mb-6">
                    {plan.features.map((feature, index) => (
                        <li key={index} className="flex items-start text-sm">
                            <Check className={`w-4 h-4 mr-2 mt-0.5 flex-shrink-0 ${colors.accent}`} />
                            <span dangerouslySetInnerHTML={{ __html: feature }} />
                        </li>
                    ))}
                </ul>
            </div>

            {/* Button */}
            <div className="mt-auto">
                <UserButton
                    variant={buttonVariant}
                    icon={isDisabled ? <Tag className="w-5 h-5" /> : <ArrowUpCircle className="w-5 h-5" />}
                    disabled={isDisabled}
                    onClick={() => !isDisabled && onChoosePlan(plan)}
                >
                    {isCurrent
                        ? "Current Plan"
                        : disableFreeForPremiumUser
                            ? "Not Available"
                            : (plan.level === "Super" ? "Upgrade to Super" : "Choose Plan")}
                </UserButton>
            </div>
        </div>
    );
};