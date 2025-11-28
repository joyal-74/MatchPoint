import { Edit3, Eye, MoreVertical, Trash2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";

type UserRole = 'Player' | 'Manager' | 'Viewer';
type PlanLevel = 'Free' | 'Premium' | 'Super';

interface Plan {
    id: string;
    userType: UserRole;
    level: PlanLevel;
    title: string;
    price: number;
    features: string[];
}

// Dropdown Menu Component for PlanCard
export const PlanCardDropdown: React.FC<{ plan: Plan; onView: (plan: Plan) => void; onEdit: (plan: Plan) => void; onDelete: (id: string) => void }> = ({ plan, onView, onEdit, onDelete }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleAction = (action: () => void) => {
        action();
        setIsOpen(false);
    };

    return (
        <div className="absolute top-4 right-4 z-10" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-1 rounded-full text-neutral-400 hover:bg-neutral-700 transition"
                aria-label="Plan actions"
            >
                <MoreVertical className="w-5 h-5" />
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-40 bg-neutral-700 rounded-md shadow-xl overflow-hidden border border-neutral-600">
                    <button
                        onClick={() => handleAction(() => onView(plan))}
                        className="flex items-center w-full px-4 py-2 text-sm text-neutral-200 hover:bg-neutral-600 transition"
                    >
                        <Eye className="w-4 h-4 mr-2 text-emerald-400" /> View Details
                    </button>
                    <button
                        onClick={() => handleAction(() => onEdit(plan))}
                        className="flex items-center w-full px-4 py-2 text-sm text-neutral-200 hover:bg-neutral-600 transition"
                    >
                        <Edit3 className="w-4 h-4 mr-2 text-yellow-400" /> Edit Plan
                    </button>
                    <button
                        onClick={() => handleAction(() => onDelete(plan.id))}
                        className="flex items-center w-full px-4 py-2 text-sm text-red-400 hover:bg-neutral-600 transition"
                    >
                        <Trash2 className="w-4 h-4 mr-2" /> Delete Plan
                    </button>
                </div>
            )}
        </div>
    );
};