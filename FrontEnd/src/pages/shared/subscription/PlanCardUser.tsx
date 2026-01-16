import { ArrowUpCircle, ArrowDownCircle, Check, Tag, Clock } from "lucide-react";
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

    // Logic: Disable if current OR if this specific plan is already the pending one
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
                relative p-6 rounded-2xl flex flex-col h-full border transition-all duration-300
                ${isCurrent 
                    ? "bg-primary/5 border-primary/50 shadow-[0_0_20px_rgba(var(--primary),0.1)]" 
                    : "bg-card border-border hover:border-primary/30 hover:shadow-lg hover:-translate-y-1" 
                }
            `}
        >
            {isPopular && !isCurrent && (
                <div className="absolute -top-3 right-4 bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-full shadow-md">
                    Most Popular
                </div>
            )}

            {isCurrent && (
                <div className="absolute -top-3 right-4 bg-primary/10 text-primary border border-primary/20 text-xs font-bold px-3 py-1 rounded-full">
                    Current Plan
                </div>
            )}
            
            {isPending && (
                <div className="absolute -top-3 right-4 bg-yellow-100 text-yellow-700 border border-yellow-200 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                    <Clock size={12} /> Starts Next Cycle
                </div>
            )}

            <div className="flex-grow">
                <div className="mb-5">
                    <div className="flex justify-between items-center mb-2">
                        <h3 className={`text-xl font-bold ${isCurrent ? 'text-primary' : 'text-card-foreground'}`}>
                            {plan.title}
                        </h3>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                        {plan.description}
                    </p>
                </div>

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

                <div className="w-full h-px bg-border mb-6"></div>

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
                    variant={variant as any}
                    icon={isDisabled ? undefined : <ButtonIcon className="w-4 h-4" />}
                    disabled={isDisabled}
                    onClick={() => !isDisabled && onChoosePlan(plan)}
                    className="w-full justify-center"
                >
                    {buttonText}
                </UserButton>
            </div>
        </div>
    );
};