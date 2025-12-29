import { Check, Edit3, Eye, IndianRupee, Tag, Trash2, User, X } from "lucide-react";
import type { Plan } from "./SubscriptionTypes";

export const PlanDetailModal: React.FC<{ 
    selectedPlan: Plan | null; 
    onClose: () => void; 
    onEdit: (plan: Plan) => void; 
    onDelete: (id: string) => void 
}> = ({ selectedPlan, onClose, onEdit, onDelete }) => {
    
    if (!selectedPlan) return null;

    const { title, level, userType, price, features, _id } = selectedPlan;

    // Badge Logic
    const levelBadgeStyles = level === 'Premium' 
        ? 'bg-primary/10 text-primary border-primary/20' 
        : 'bg-muted text-muted-foreground border-border';

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            
            {/* Modal Container */}
            <div className="bg-popover text-popover-foreground rounded-2xl shadow-2xl w-full max-w-3xl border border-border overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
                
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-muted/30">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary/10 rounded-lg text-primary">
                            <Eye className="w-5 h-5" />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-foreground">Plan Details</h2>
                            <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium">{_id}</p>
                        </div>
                    </div>
                    <button 
                        onClick={onClose}
                        className="p-2 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Scrollable Content */}
                <div className="p-6 overflow-y-auto custom-scrollbar">
                    
                    {/* Top Row: Title & Price */}
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                        <div>
                            <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold border mb-2 ${levelBadgeStyles}`}>
                                {level} Tier
                            </div>
                            <h1 className="text-3xl font-extrabold text-foreground tracking-tight">{title}</h1>
                        </div>
                        <div className="text-right">
                            <p className="text-sm text-muted-foreground font-medium mb-1">Monthly Price</p>
                            <div className="text-3xl font-bold text-primary flex items-center justify-end">
                                {price === 0 ? 'Free' : (
                                    <>
                                        <IndianRupee className="w-6 h-6" strokeWidth={3} />
                                        {price}
                                    </>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Metadata Grid */}
                    <div className="grid grid-cols-2 gap-4 mb-8">
                        <div className="p-4 rounded-xl border border-border bg-card flex items-center gap-4">
                            <div className="p-2.5 rounded-full bg-secondary text-secondary-foreground">
                                <User className="w-5 h-5" />
                            </div>
                            <div>
                                <p className="text-xs text-muted-foreground font-medium uppercase">Target Audience</p>
                                <p className="font-semibold text-foreground capitalize">{userType}</p>
                            </div>
                        </div>

                        <div className="p-4 rounded-xl border border-border bg-card flex items-center gap-4">
                            <div className="p-2.5 rounded-full bg-secondary text-secondary-foreground">
                                <Tag className="w-5 h-5" />
                            </div>
                            <div>
                                <p className="text-xs text-muted-foreground font-medium uppercase">Plan Level</p>
                                <p className="font-semibold text-foreground">{level}</p>
                            </div>
                        </div>
                    </div>

                    {/* Features List */}
                    <div className="bg-muted/30 rounded-xl p-5 border border-border">
                        <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
                            <Check className="w-4 h-4 text-primary" />
                            Included Features ({features.length})
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3">
                            {features.map((feature, index) => (
                                <div key={index} className="flex items-start gap-3 text-sm text-muted-foreground">
                                    <div className="mt-1 min-w-[6px] h-[6px] rounded-full bg-primary/60" />
                                    <span>{feature}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Footer Actions */}
                <div className="p-4 border-t border-border bg-muted/30 flex justify-end gap-3">
                    <button 
                        onClick={() => onDelete(_id)}
                        className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
                    >
                        <Trash2 className="w-4 h-4" />
                        Delete Plan
                    </button>
                    
                    <button 
                        onClick={() => onEdit(selectedPlan)}
                        className="flex items-center gap-2 px-5 py-2 text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg shadow-sm transition-all"
                    >
                        <Edit3 className="w-4 h-4" />
                        Edit Plan
                    </button>
                </div>

            </div>
        </div>
    );
};