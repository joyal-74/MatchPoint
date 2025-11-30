import { ArrowUpCircle, Check, Tag } from "lucide-react";
import type { AvailablePlan, PlanLevel } from "./SubscriptionTypes";
import { UserButton } from "./UserButton";

export const PlanCardUser: React.FC<{ plan: AvailablePlan; currentLevel: PlanLevel; onChoosePlan: (plan: AvailablePlan) => void, loading?: boolean; }> = ({ plan, currentLevel, onChoosePlan }) => {
    const isCurrent = plan.level === currentLevel;
    
    const buttonVariant = isCurrent ? 'current' : (plan.level === 'Super' ? 'secondary' : 'primary');
    
    const cardBg = isCurrent ? 'bg-neutral-700' : 'bg-neutral-800';

function getPriceDisplay(plan: AvailablePlan) {
    if (plan.level === "Free" || plan.price === 0) {
        return "Free";
    }

    const cycle = plan.billingCycle?.toLowerCase() ?? "monthly";

    return `${plan.price}/${cycle}`;
}

    return (
        <div className={`relative p-6 rounded-2xl shadow-2xl flex flex-col h-full border ${isCurrent ? 'border-emerald-500' : 'border-neutral-700'} ${cardBg} transition duration-300 hover:shadow-emerald-500/30`}>
            
            {plan.isPopular && (
                <div className="absolute top-0 right-0 -mt-3 mr-6 bg-emerald-500 text-neutral-900 text-xs font-bold px-3 py-1 rounded-full uppercase shadow-lg">
                    Most Popular
                </div>
            )}

            <div className="flex-grow">
     
                <div className="mb-5 pb-3 border-b border-neutral-600">
                    <div className="flex justify-between items-center">
                        <h3 className="text-xl font-extrabold text-neutral-100">{plan.title}</h3>
                        {isCurrent && <Check className="w-6 h-6 text-emerald-500" />}
                    </div>
                    <p className="text-xs text-neutral-400 mt-1">{plan.description}</p>
                </div>

                {/* Price */}
                <p className="text-3xl font-extrabold text-emerald-400 mb-5">
                    {getPriceDisplay(plan)}
                </p>

                {/* Features */}
                <ul className="space-y-2 text-neutral-300 mb-6">
                    {plan.features.map((feature, index) => (
                        <li key={index} className="flex items-start text-[13px]">
                            <Check className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0 text-emerald-400" />
                            <span dangerouslySetInnerHTML={{ __html: feature }} />
                        </li>
                    ))}
                </ul>
            </div>

            {/* Action Button */}
            <div className="mt-auto">
                <UserButton 
                    variant={buttonVariant} 
                    icon={isCurrent ? <Tag className="w-5 h-5" /> : <ArrowUpCircle className="w-5 h-5" />}
                    onClick={() => !isCurrent && onChoosePlan(plan)}
                    disabled={isCurrent}
                >
                    {isCurrent ? 'Current Plan' : (plan.level === 'Super' ? 'Upgrade to Super' : 'Choose Plan')}
                </UserButton>
            </div>
        </div>
    );
};