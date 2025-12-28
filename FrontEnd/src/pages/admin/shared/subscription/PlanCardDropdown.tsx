import { Edit3, Eye, MoreVertical, Trash2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { Plan } from "./SubscriptionTypes";
import { DeleteConfirmationModal } from "./DeleteConfirmationModal";

export const PlanCardDropdown: React.FC<{ 
    plan: Plan; 
    onView: (plan: Plan) => void; 
    onEdit: (plan: Plan) => void; 
    onDelete: (id: string) => void 
}> = ({ plan, onView, onEdit, onDelete }) => {
    
    const [isOpen, setIsOpen] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false); 
    const dropdownRef = useRef<HTMLDivElement>(null);

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

    const handleDeleteClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsOpen(false);
        setShowDeleteModal(true);
    };

    const handleConfirmDelete = () => {
        onDelete(plan._id);
        setShowDeleteModal(false);
    };

    return (
        <>
            {/* Dropdown Menu */}
            <div className="absolute top-4 right-4 z-20" ref={dropdownRef}>
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        setIsOpen(!isOpen);
                    }}
                    className={`
                        h-8 w-8 flex items-center justify-center rounded-full transition-colors duration-200
                        ${isOpen 
                            ? "bg-accent text-accent-foreground" 
                            : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
                        }
                    `}
                    aria-label="Plan actions"
                >
                    <MoreVertical className="w-5 h-5" />
                </button>

                {isOpen && (
                    <div className="absolute right-0 mt-2 w-48 rounded-lg border border-border bg-popover text-popover-foreground shadow-lg animate-in fade-in zoom-in-95 duration-200 overflow-hidden z-30">
                        <div className="p-1">
                            <button
                                onClick={() => handleAction(() => onView(plan))}
                                className="flex w-full items-center rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
                            >
                                <Eye className="w-4 h-4 mr-2 text-primary" /> 
                                View Details
                            </button>
                            
                            <button
                                onClick={() => handleAction(() => onEdit(plan))}
                                className="flex w-full items-center rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
                            >
                                <Edit3 className="w-4 h-4 mr-2 text-amber-500" /> 
                                Edit Plan
                            </button>
                        </div>

                        <div className="h-px bg-border my-1" />

                        <div className="p-1">
                            <button
                                onClick={handleDeleteClick}
                                className="flex w-full items-center rounded-md px-3 py-2 text-sm font-medium text-destructive transition-colors hover:bg-destructive/10 hover:text-destructive"
                            >
                                <Trash2 className="w-4 h-4 mr-2" /> 
                                Delete Plan
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Separate Modal Component */}
            <DeleteConfirmationModal 
                isOpen={showDeleteModal}
                onClose={() => setShowDeleteModal(false)}
                onConfirm={handleConfirmDelete}
                title={`Delete "${plan.title}"?`}
                description={
                    <span>
                        Are you sure you want to delete the plan <strong>{plan.title}</strong>? 
                        Users currently subscribed to this plan may be affected.
                    </span>
                }
            />
        </>
    );
};