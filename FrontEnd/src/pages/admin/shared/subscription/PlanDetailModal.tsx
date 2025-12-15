import type { Plan } from "./SubscriptionTypes";
import { AdminButton } from "./AdminButton";
import { CheckSquare, Edit3, Eye, Tag, Trash2, User, X } from "lucide-react";

export const PlanDetailModal: React.FC<{ selectedPlan: Plan | null; onClose: () => void; onEdit: (plan: Plan) => void; onDelete: (id: string) => void }>
    = ({ selectedPlan, onClose, onEdit, onDelete }) => {
        if (!selectedPlan) return null;

        const { title, level, userType, price, features, _id } = selectedPlan;

        const levelColor = (() => {
            switch (level) {
                case 'Super': return 'bg-yellow-500 text-neutral-900';
                case 'Premium': return 'bg-emerald-600 text-white';
                default: return 'bg-neutral-500 text-white';
            }
        })();

        return (
            <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50 backdrop-blur p-4">
                <div className="bg-neutral-900 rounded-xl shadow-2xl max-w-4xl w-full p-6 text-white border border-neutral-700">
                    <div className="flex justify-between items-center p-5 border-b border-neutral-700 -mx-6 -mt-6 mb-6">
                        <h2 className="text-2xl font-bold text-neutral-100 flex items-center px-6">
                            <Eye className="w-6 h-6 mr-2 text-emerald-400" />
                            Plan Details: {title}
                        </h2>
                        <div className="flex space-x-2 mr-6">
                            <AdminButton icon={<Edit3 className="w-4 h-4" />} variant="secondary" onClick={() => onEdit(selectedPlan)}>
                                Edit
                            </AdminButton>
                            <AdminButton icon={<Trash2 className="w-4 h-4" />} variant="danger" onClick={() => onDelete(_id)}>
                                Delete
                            </AdminButton>
                            <AdminButton icon={<X className="w-5 h-5" />} variant="none" onClick={onClose} className="p-2" />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:gr_id-cols-3 gap-6">

                        {/* Plan Summary */}
                        <div className="lg:col-span-1 space-y-4 bg-neutral-800 p-5 rounded-xl border border-neutral-700 h-fit">
                            <h3 className="text-xl font-semibold text-emerald-400 border-b border-neutral-700 pb-2 mb-3">Summary</h3>

                            <div className="flex items-center space-x-3">
                                <User className="w-5 h-5 text-neutral-400" />
                                <div>
                                    <p className="text-sm text-neutral-400">User Role</p>
                                    <p className="font-semibold">{userType}</p>
                                </div>
                            </div>

                            <div className="flex items-center space-x-3">
                                <Tag className="w-5 h-5 text-neutral-400" />
                                <div>
                                    <p className="text-sm text-neutral-400">Level</p>
                                    <p className={`font-bold ${levelColor} py-0.5 px-2 rounded-full inline-block`}>{level}</p>
                                </div>
                            </div>

                            <div className="flex items-center space-x-3">
                                ₹
                                <div>
                                    <p className="text-sm text-neutral-400">Price</p>
                                    <p className="text-2xl font-bold text-emerald-400">
                                        {price === 0 ? 'FREE' : `₹${price.toFixed(2)}`}
                                        {price > 0 && <span className="text-sm text-neutral-400"> / mo</span>}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Features List */}
                        <div className="lg:col-span-2">
                            <h3 className="text-xl font-semibold text-neutral-200 border-b border-neutral-700 pb-2 mb-4 flex items-center">
                                <CheckSquare className="w-5 h-5 mr-2 text-emerald-400" />
                                Detailed Features ({features.length})
                            </h3>
                            <ul className="space-y-3 columns-1 sm:columns-2 text-neutral-300">
                                {features.map((feature, index) => (
                                    <li key={index} className="flex items-start text-base">
                                        <svg className="w-5 h-5 mr-2 mt-1 flex-shrink-0 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                                        {feature}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    <div className="mt-8 pt-4 border-t border-neutral-800 flex justify-end">
                        <AdminButton icon={<X className="w-5 h-5" />} variant="secondary" onClick={onClose}>
                            Close
                        </AdminButton>
                    </div>
                </div>
            </div>
        );
    };