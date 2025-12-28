import { useMemo } from "react";
import type { Plan } from "./SubscriptionTypes";
import { PlanCardDropdown } from "./PlanCardDropdown";
import { Check, Zap } from "lucide-react"; // Using Lucide icons for consistency

export const PlanCard: React.FC<{ 
    plan: Plan; 
    onDelete: (id: string) => void; 
    onEdit: (plan: Plan) => void; 
    onView: (plan: Plan) => void 
}> = ({ plan, onDelete, onEdit, onView }) => {
    
    // Theme-aware Badge Colors
    const levelBadgeStyles = useMemo(() => {
        switch (plan.level) {
            case 'Super':
                // Gold/Yellow usually stays distinct, but we can make it softer or theme-aligned
                return 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20 dark:text-yellow-400';
            case 'Premium':
                // Primary Theme Color
                return 'bg-primary/10 text-primary border-primary/20';
            case 'Free':
            default:
                // Muted/Grey
                return 'bg-muted text-muted-foreground border-border';
        }
    }, [plan.level]);

    return (
        <div className="group relative bg-card text-card-foreground p-6 rounded-xl shadow-sm border border-border flex flex-col h-full transition-all duration-300 hover:shadow-md hover:border-primary/50">
            
            {/* Dropdown Menu (Positioned Absolute Top-Right) */}
            <PlanCardDropdown plan={plan} onDelete={onDelete} onEdit={onEdit} onView={onView} />

            {/* Badge */}
            <div className={`text-xs font-bold uppercase tracking-wider py-1 px-3 rounded-full border self-start mb-4 ${levelBadgeStyles}`}>
                {plan.level}
            </div>

            {/* Title & Price */}
            <h3 className="text-xl font-bold text-foreground mb-2 tracking-tight">{plan.title}</h3>
            
            <div className="flex items-baseline gap-1 mb-6">
                <p className="text-3xl font-extrabold text-primary">
                    {plan.price === 0 ? 'Free' : `₹${plan.price.toFixed(0)}`}
                </p>
                {plan.price > 0 && (
                    <span className="text-sm font-medium text-muted-foreground">/ month</span>
                )}
            </div>

            {/* Features List */}
            <div className="flex-grow border-t border-border pt-4">
                <h4 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
                    <Zap size={16} className="text-primary fill-primary/20" />
                    Key Features
                </h4>
                
                <ul className="space-y-3">
                    {plan.features.map((feature, index) => (
                        <li key={index} className="flex items-start gap-3 text-sm text-muted-foreground">
                            <div className="mt-0.5 min-w-[16px]">
                                <Check size={16} className="text-primary" />
                            </div>
                            <span className="leading-tight">{feature}</span>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};