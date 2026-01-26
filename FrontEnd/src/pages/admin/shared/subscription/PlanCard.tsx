import React, { useMemo } from "react";
import type { Plan } from "./SubscriptionTypes";
import { PlanCardDropdown } from "./PlanCardDropdown";
import { Check, Zap, X } from "lucide-react"; // 1. Added X to imports

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
                return 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20 dark:text-yellow-400';
            case 'Premium':
                return 'bg-primary/10 text-primary border-primary/20';
            case 'Free':
            default:
                return 'bg-muted text-muted-foreground border-border';
        }
    }, [plan.level]);

    return (
        <div className="group relative bg-card text-card-foreground p-6 rounded-xl shadow-sm border border-border flex flex-col h-full transition-all duration-300 hover:shadow-md hover:border-primary/50">
            
            {/* Dropdown Menu */}
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
                    <span className="text-sm font-medium text-muted-foreground">/ {plan.billingCycle}</span>
                )}
            </div>

            {/* Features List */}
            <div className="flex-grow border-t border-border pt-4">
                <h4 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
                    <Zap size={16} className="text-primary fill-primary/20" />
                    Key Features
                </h4>
                
                <ul className="space-y-3">
                    {plan.features.map((feature, index) => {
                        // 2. Logic to check for negative features
                        const isNegative = feature.trim().toLowerCase().startsWith('no');

                        return (
                            <li key={index} className="flex items-start gap-3 text-sm text-muted-foreground">
                                <div className="mt-0.5 min-w-[16px]">
                                    {/* 3. Conditional Rendering based on isNegative */}
                                    {isNegative ? (
                                        <X size={16} className="text-red-500" />
                                    ) : (
                                        <Check size={16} className="text-primary" />
                                    )}
                                </div>
                                <span className={`leading-tight ${isNegative ? 'opacity-80' : ''}`}>
                                    {feature}
                                </span>
                            </li>
                        );
                    })}
                </ul>
            </div>
        </div>
    );
};