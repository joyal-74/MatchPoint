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
    const isPopular = plan.level === "Super"; // Logic for popular badge

    // Determine Button Variant based on state
    const buttonVariant = isCurrent
        ? "outline" // Current plan usually just shows status
        : disableFreeForPremiumUser
            ? "ghost" // Disabled state
            : isPopular ? "primary" : "secondary";

    return (
        <div
            className={`
                relative p-6 rounded-2xl flex flex-col h-full border transition-all duration-300
                ${isCurrent 
                    ? "bg-primary/5 border-primary/50 shadow-[0_0_20px_rgba(var(--primary),0.1)]" // Active Plan Styling
                    : "bg-card border-border hover:border-primary/30 hover:shadow-lg hover:-translate-y-1" // Inactive Plan Styling
                }
            `}
        >
            {/* Popular Badge - Adapts to Primary Color */}
            {isPopular && !isCurrent && (
                <div className="absolute -top-3 right-4 bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-full shadow-md animate-in fade-in slide-in-from-bottom-2">
                    Most Popular
                </div>
            )}

            {isCurrent && (
                <div className="absolute -top-3 right-4 bg-primary/10 text-primary border border-primary/20 text-xs font-bold px-3 py-1 rounded-full">
                    Current Plan
                </div>
            )}

            <div className="flex-grow">
                {/* Title */}
                <div className="mb-5">
                    <div className="flex justify-between items-center mb-2">
                        <h3 className={`text-xl font-bold ${isCurrent ? 'text-primary' : 'text-card-foreground'}`}>
                            {plan.title}
                        </h3>
                        {isCurrent && <Check className="w-5 h-5 text-primary" />}
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                        {plan.description}
                    </p>
                </div>

                {/* Price */}
                <div className="mb-6">
                    <p className="text-4xl font-bold text-foreground flex items-end gap-1">
                        {plan.level === "Free" ? "Free" : `₹${plan.price}`}

                        {plan.level !== "Free" && plan.price > 0 && (
                            <span className="text-sm font-medium text-muted-foreground mb-1.5 ml-1">
                                /{plan.billingCycle?.toLowerCase() ?? "monthly"}
                            </span>
                        )}
                    </p>
                </div>

                {/* Divider */}
                <div className="w-full h-px bg-border mb-6"></div>

                {/* Features */}
                <ul className="space-y-3 mb-8">
                    {plan.features.map((feature, index) => (
                        <li key={index} className="flex items-start text-sm text-muted-foreground group">
                            <div className={`mt-0.5 mr-3 flex-shrink-0 ${isCurrent ? 'text-primary' : 'text-muted-foreground/70 group-hover:text-primary transition-colors'}`}>
                                <Check size={16} strokeWidth={3} />
                            </div>
                            <span className="leading-snug text-foreground/90" dangerouslySetInnerHTML={{ __html: feature }} />
                        </li>
                    ))}
                </ul>
            </div>

            <div className="mt-auto">
                <UserButton
                    variant={buttonVariant}
                    icon={isDisabled ? <Tag className="w-4 h-4" /> : <ArrowUpCircle className="w-4 h-4" />}
                    disabled={isDisabled}
                    onClick={() => !isDisabled && onChoosePlan(plan)}
                    className="w-full justify-center"
                >
                    {isCurrent
                        ? "Active Plan"
                        : disableFreeForPremiumUser
                            ? "Downgrade Unavailable"
                            : (isPopular ? "Upgrade to Super" : "Choose Plan")}
                </UserButton>
            </div>
        </div>
    );
};