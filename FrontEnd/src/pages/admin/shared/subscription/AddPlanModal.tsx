import { Plus, User, X } from "lucide-react";
import { AdminButton } from "./AdminButton";
import type { Plan, PlanForm, UserRole } from "./SubscriptionTypes";
import React, { useEffect, useState } from "react";

export const AddPlanModal: React.FC<{ isOpen: boolean; onClose: () => void; onSave: (plan: Omit<Plan, 'id'>) => void; selectedUserType: UserRole }> = ({ isOpen, onClose, onSave, selectedUserType }) => {
    const [formData, setFormData] = useState<PlanForm>({
        userType: selectedUserType,
        level: 'Free',
        title: '',
        price: '0.00',
        featuresInput: '',
    });

    useEffect(() => {
        // Reset userType when modal opens with a new tab
        setFormData(prev => ({ ...prev, userType: selectedUserType }));
    }, [selectedUserType]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.replace(/[^\d.]/g, ''); // Allow only digits and one dot
        setFormData(prev => ({ ...prev, price: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const features = formData.featuresInput.split('\n').map(f => f.trim()).filter(f => f.length > 0);
        const newPlan: Omit<Plan, 'id'> = {
            userType: formData.userType,
            level: formData.level,
            title: formData.title,
            price: parseFloat(formData.price || '0'),
            features: features,
        };
        onSave(newPlan);
        onClose(); // Close after saving
        // Reset form after submission
        setFormData({
            userType: selectedUserType,
            level: 'Free',
            title: '',
            price: '0.00',
            featuresInput: '',
        });
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50 backdrop-blur">
            <div className="bg-neutral-900 rounded-xl shadow-xl max-w-3xl w-full p-6 text-white">
                <div className="flex justify-between items-center p-5 border-b border-neutral-700">
                    <h2 className="text-xl font-bold text-neutral-100 flex items-center">
                        Add New {selectedUserType} subscription Plan
                    </h2>
                    <AdminButton icon={<X className="w-5 h-5" />} variant="none" onClick={onClose} className="p-2 !shadow-none bg-none" />
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    {/* User Type (Pre-selected by Tab) */}
                    <div className="bg-neutral-700 p-3 rounded-lg flex items-center">
                        <User className="w-5 h-5 mr-2 text-emerald-300" />
                        <span className="font-semibold text-neutral-200">User Role: {selectedUserType}</span>
                    </div>

                    {/* Plan Title */}
                    <div>
                        <label htmlFor="title" className="block text-sm font-medium text-neutral-400 mb-1">Plan Title</label>
                        <input
                            type="text"
                            id="title"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            required
                            className="w-full bg-neutral-900 border border-neutral-700 text-neutral-100 p-3 rounded-lg focus:ring-emerald-500 focus:border-emerald-500 shadow-inner"
                            placeholder="e.g., Ultimate Manager Plan"
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Plan Level (Free, Premium, Super) */}
                        <div>
                            <label htmlFor="level" className="block text-sm font-medium text-neutral-400 mb-1">Plan Level</label>
                            <select
                                id="level"
                                name="level"
                                value={formData.level}
                                onChange={handleChange}
                                required
                                className="w-full bg-neutral-900 border border-neutral-700 text-neutral-100 p-3 rounded-lg focus:ring-emerald-500 focus:border-emerald-500 shadow-inner appearance-none"
                            >
                                <option value="Free">Free</option>
                                <option value="Premium">Premium</option>
                                <option value="Super">Super</option>
                            </select>
                        </div>

                        {/* Price */}
                        <div>
                            <label htmlFor="price" className="block text-sm font-medium text-neutral-400 mb-1">Monthly Price (₹)</label>
                            <div className="relative">
                                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-neutral-400">
                                    ₹
                                </span>
                                <input
                                    type="text"
                                    id="price"
                                    name="price"
                                    value={formData.price}
                                    onChange={handlePriceChange}
                                    required
                                    className="w-full bg-neutral-900 border border-neutral-700 text-neutral-100 p-3 rounded-lg focus:ring-emerald-500 focus:border-emerald-500 shadow-inner pl-10"
                                    placeholder="0.00"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Features Input */}
                    <div>
                        <label htmlFor="featuresInput" className="block text-sm font-medium text-neutral-400 mb-1">Plan Features (One per line)</label>
                        <textarea
                            id="featuresInput"
                            name="featuresInput"
                            rows={5}
                            value={formData.featuresInput}
                            onChange={handleChange}
                            required
                            className="w-full bg-neutral-900 border border-neutral-700 text-neutral-100 p-3 rounded-lg focus:ring-emerald-500 focus:border-emerald-500 shadow-inner resize-none"
                            placeholder="e.g.,&#10;Access to full API&#10;Dedicated account manager&#10;Priority bug fixes"
                        />
                    </div>

                    <div className="pt-4 flex justify-end space-x-3">
                        <AdminButton type="button" icon={<X className="w-5 h-5" />} variant="secondary" onClick={onClose}>
                            Cancel
                        </AdminButton>
                        <AdminButton type="submit" icon={<Plus className="w-5 h-5" />}>
                            Create Plan
                        </AdminButton>
                    </div>
                </form>
            </div>
        </div>
    );
};