import { ArrowUpCircle, ArrowDownCircle, Check, Tag, Clock, X } from "lucide-react";
import type { AvailablePlan, PlanLevel } from "./SubscriptionTypes";
import { UserButton } from "./UserButton";

// Helper to determine rank
const getPlanRank = (level: PlanLevel): number => {
    const ranks: Record<PlanLevel, number> = { "Free": 0, "Basic": 1, "Super": 2, "Premium": 3 };
    return ranks[level] || 0;
};

export const PlanCardUser: React.FC<{
    plan: AvailablePlan;
    currentLevel: PlanLevel;
    onChoosePlan: (plan: AvailablePlan) => void;
    pendingDowngrade?: PlanLevel; 
}> = ({ plan, currentLevel, onChoosePlan, pendingDowngrade }) => {

    const currentRank = getPlanRank(currentLevel);
    const thisRank = getPlanRank(plan.level);

    const isCurrent = plan.level === currentLevel;
    const isPending = pendingDowngrade === plan.level;
    const isUpgrade = thisRank > currentRank;
    const isDowngrade = thisRank < currentRank;
    const isPopular = plan.level === "Super"; 

    const isDisabled = isCurrent || isPending;

    // Determine Button Styling
    let buttonText = "Choose Plan";
    let ButtonIcon = Tag;
    let variant: "primary" | "secondary" | "outline" | "ghost" = "secondary";

    if (isCurrent) {
        buttonText = "Active Plan";
        variant = "outline";
        ButtonIcon = Check;
    } else if (isPending) {
        buttonText = "Scheduled";
        variant = "outline";
        ButtonIcon = Clock;
    } else if (isUpgrade) {
        buttonText = "Upgrade";
        variant = isPopular ? "primary" : "secondary";
        ButtonIcon = ArrowUpCircle;
    } else if (isDowngrade) {
        buttonText = "Downgrade";
        variant = "ghost";
        ButtonIcon = ArrowDownCircle;
    }

    return (
        <div
            className={`
                relative p-5 rounded-xl flex flex-col h-full border transition-all duration-300
                ${isCurrent 
                    ? "bg-primary/5 border-primary/50 shadow-md" 
                    : "bg-card border-border hover:border-primary/30 hover:shadow-lg hover:-translate-y-1" 
                }
            `}
        >
            {isPopular && !isCurrent && (
                <div className="absolute -top-2.5 right-3 bg-primary text-primary-foreground text-[10px] uppercase font-bold px-2 py-0.5 rounded-full shadow-md">
                    Most Popular
                </div>
            )}

            {isCurrent && (
                <div className="absolute -top-2.5 right-3 bg-primary/10 text-primary border border-primary/20 text-[10px] uppercase font-bold px-2 py-0.5 rounded-full">
                    Current
                </div>
            )}
            
            {isPending && (
                <div className="absolute -top-2.5 right-3 bg-yellow-100 text-yellow-700 border border-yellow-200 text-[10px] uppercase font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                    <Clock size={10} /> Next Cycle
                </div>
            )}

            <div className="flex-grow">
                {/* Header Section */}
                <div className="mb-3">
                    <div className="flex justify-between items-center mb-1">
                        <h3 className={`text-lg font-bold ${isCurrent ? 'text-primary' : 'text-card-foreground'}`}>
                            {plan.title}
                        </h3>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
                        {plan.description}
                    </p>
                </div>

                {/* Price Section */}
                <div className="mb-4">
                    <p className="text-3xl font-bold text-foreground flex items-end gap-0.5">
                        {plan.level === "Free" ? "Free" : `₹${plan.price}`}
                        {plan.level !== "Free" && plan.price > 0 && (
                            <span className="text-xs font-medium text-muted-foreground mb-1.5 ml-1">
                                /{plan.billingCycle?.toLowerCase() ?? "mo"}
                            </span>
                        )}
                    </p>
                </div>

                <div className="w-full h-px bg-border mb-4"></div>

                {/* Features Section */}
                <ul className="space-y-3 mb-5">
                    {plan.features.map((feature, index) => {
                        // Logic check for "No"
                        const isNegative = feature.trim().toLowerCase().startsWith('no');

                        return (
                            <li key={index} className="flex items-start text-sm group">
                                <div className="mt-0.5 mr-2.5 flex-shrink-0">
                                    {isNegative ? (
                                        <X size={15} className="text-red-500" strokeWidth={2.5} />
                                    ) : (
                                        <Check 
                                            size={15} 
                                            className={`${isCurrent ? 'text-primary' : 'text-primary/80'} transition-colors`} 
                                            strokeWidth={2.5} 
                                        />
                                    )}
                                </div>
                                <span 
                                    className={`leading-tight text-[13px] ${isNegative ? 'text-muted-foreground opacity-80' : 'text-foreground/90'}`}
                                >
                                    {feature}
                                </span>
                            </li>
                        );
                    })}
                </ul>
            </div>

            <div className="mt-auto">
                <UserButton
                    variant={variant}
                    icon={isDisabled ? undefined : <ButtonIcon className="w-3.5 h-3.5" />}
                    disabled={isDisabled}
                    onClick={() => !isDisabled && onChoosePlan(plan)}
                    className="w-full justify-center text-sm py-2 h-9"
                >
                    {buttonText}
                </UserButton>
            </div>
        </div>
    );
};