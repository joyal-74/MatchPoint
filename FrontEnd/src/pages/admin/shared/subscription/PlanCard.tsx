import { useMemo } from "react";
import type { Plan } from "./SubscriptionTypes";
import { PlanCardDropdown } from "./PlanCardDropdown";
import { List } from "lucide-react";

export const PlanCard: React.FC<{ plan: Plan; onDelete: (id: string) => void; onEdit: (plan: Plan) => void; onView: (plan: Plan) => void }> = ({ plan, onDelete, onEdit, onView }) => {
    const levelColor = useMemo(() => {
        switch (plan.level) {
            case 'Super':
                return 'bg-yellow-500 text-neutral-900';
            case 'Premium':
                return 'bg-emerald-600 text-white';
            case 'Free':
            default:
                return 'bg-neutral-500 text-white';
        }
    }, [plan.level]);

    return (
        // Added relative for dropdown positioning and bg-neutral-800 for card background
        <div className="relative bg-neutral-800 p-6 rounded-xl shadow-2xl border border-neutral-700 flex flex-col h-full transition duration-300 hover:shadow-emerald-500/30">
            
            {/* Dropdown Menu */}
            <PlanCardDropdown plan={plan} onDelete={onDelete} onEdit={onEdit} onView={onView} />

            <div className={`text-sm font-bold uppercase tracking-wider py-1 px-3 rounded-full self-start mb-3 ${levelColor}`}>
                {plan.level}
            </div>
            <h3 className="text-xl font-bold text-neutral-100 mb-2">{plan.title}</h3>
            <p className="text-3xl font-extrabold text-emerald-400 mb-4">
                {plan.price === 0 ? 'FREE' : `₹${plan.price.toFixed(2)}`}
                {plan.price > 0 && <span className="text-base font-medium text-neutral-400"> / mo</span>}
            </p>

            <div className="flex-grow">
                <h4 className="text-lg font-semibold text-neutral-300 mb-3 flex items-center">
                    <List className="w-5 h-5 mr-2 text-emerald-400" />
                    Key Features
                </h4>
                <ul className="space-y-2 text-neutral-300">
                    {plan.features.map((feature, index) => (
                        <li key={index} className="flex items-start text-sm">
                            <svg className="w-4 h-4 mr-2 mt-1 flex-shrink-0 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                            {feature}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};