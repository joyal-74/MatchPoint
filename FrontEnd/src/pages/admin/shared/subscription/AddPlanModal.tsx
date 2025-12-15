import { Plus, User, X } from "lucide-react";
import { AdminButton } from "./AdminButton";
import React, { useEffect, useState } from "react";

import type { Plan, PlanForm, UserRole } from "./SubscriptionTypes";

export const AddPlanModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    onSave: (plan: Omit<Plan, "_id">) => void;
    selectedUserType: UserRole;
}> = ({ isOpen, onClose, onSave, selectedUserType }) => {

    const [formData, setFormData] = useState<PlanForm>({
        userType: selectedUserType,
        level: "Free",
        title: "",
        price: "0.00",
        featuresInput: "",
        billingCycle: undefined,
    });

    useEffect(() => {
        setFormData(prev => ({ ...prev, userType: selectedUserType }));
    }, [selectedUserType]);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;

        if (name === "level" && value === "Free") {
            setFormData(prev => ({
                ...prev,
                level: value,
                billingCycle: undefined,
            }));
            return;
        }

        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.replace(/[^\d.]/g, "");
        setFormData(prev => ({ ...prev, price: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const features = formData.featuresInput
            .split("\n")
            .map(f => f.trim())
            .filter(Boolean);

        const newPlan: Omit<Plan, "_id"> = {
            userType: formData.userType,
            level: formData.level,
            title: formData.title,
            price: parseFloat(formData.price || "0"),
            features,
            ...(formData.level !== "Free" && { billingCycle: formData.billingCycle }),
        };

        onSave(newPlan);
        onClose();

        // Reset form
        setFormData({
            userType: selectedUserType,
            level: "Free",
            title: "",
            price: "0.00",
            featuresInput: "",
            billingCycle: undefined,
        });
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50 backdrop-blur">
            <div className="bg-neutral-900 rounded-xl shadow-xl max-w-3xl w-full p-6 text-white">

                {/* Header */}
                <div className="flex justify-between items-center p-5 border-b border-neutral-700">
                    <h2 className="text-xl font-bold text-neutral-100 flex items-center">
                        Add New {selectedUserType} Subscription Plan
                    </h2>
                    <AdminButton
                        icon={<X className="w-5 h-5" />}
                        variant="none"
                        onClick={onClose}
                        className="p-2 !shadow-none bg-none"
                    />
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-4">

                    {/* User Type (fixed) */}
                    <div className="bg-neutral-700 p-3 rounded-lg flex items-center">
                        <User className="w-5 h-5 mr-2 text-emerald-300" />
                        <span className="font-semibold text-neutral-200">
                            User Role: {selectedUserType}
                        </span>
                    </div>

                    {/* Title */}
                    <div>
                        <label className="block text-sm font-medium text-neutral-400 mb-1">
                            Plan Title
                        </label>
                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            required
                            className="w-full bg-neutral-900 border border-neutral-700 text-neutral-100 p-3 rounded-lg focus:ring-emerald-500"
                            placeholder="e.g., Ultimate Manager Plan"
                        />
                    </div>

                    {/* Level + Price */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                        {/* Plan Level */}
                        <div>
                            <label className="block text-sm font-medium text-neutral-400 mb-1">
                                Plan Level
                            </label>
                            <select
                                name="level"
                                value={formData.level}
                                onChange={handleChange}
                                required
                                className="w-full bg-neutral-900 border border-neutral-700 text-neutral-100 p-3 rounded-lg focus:ring-emerald-500 appearance-none"
                            >
                                <option value="Free">Free</option>
                                <option value="Premium">Premium</option>
                                <option value="Super">Super</option>
                            </select>
                        </div>

                        {/* Price */}
                        <div>
                            <label className="block text-sm font-medium text-neutral-400 mb-1">
                                Price (₹)
                            </label>

                            <div className="relative">
                                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-neutral-400">
                                    ₹
                                </span>

                                <input
                                    type="text"
                                    name="price"
                                    value={formData.price}
                                    onChange={handlePriceChange}
                                    required
                                    disabled={formData.level === "Free"}
                                    className={`w-full bg-neutral-900 border border-neutral-700 text-neutral-100 p-3 rounded-lg pl-10 focus:ring-emerald-500 
                                        ${formData.level === "Free" ? "opacity-50 cursor-not-allowed" : ""}`}
                                    placeholder="0.00"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Billing Cycle (only for Premium / Super) */}
                    {formData.level !== "Free" && (
                        <div>
                            <label className="block text-sm font-medium text-neutral-400 mb-1">
                                Billing Cycle
                            </label>

                            <select
                                name="billingCycle"
                                value={formData.billingCycle || ""}
                                onChange={handleChange}
                                required
                                className="w-full bg-neutral-900 border border-neutral-700 text-neutral-100 p-3 rounded-lg focus:ring-emerald-500 appearance-none"
                            >
                                <option value="" disabled>Select Billing Cycle</option>
                                <option value="Monthly">Monthly</option>
                                <option value="Yearly">Yearly</option>
                            </select>
                        </div>
                    )}

                    {/* Features */}
                    <div>
                        <label className="block text-sm font-medium text-neutral-400 mb-1">
                            Plan Features (One per line)
                        </label>
                        <textarea
                            name="featuresInput"
                            rows={4}
                            value={formData.featuresInput}
                            onChange={handleChange}
                            required
                            className="w-full bg-neutral-900 border border-neutral-700 text-neutral-100 p-3 rounded-lg focus:ring-emerald-500 resize-none"
                            placeholder={"e.g.,\nAccess to API\nPriority Support\nUnlimited Usage"}
                        />
                    </div>

                    {/* Action buttons */}
                    <div className="pt-4 flex justify-end space-x-3">
                        <AdminButton type="button" variant="secondary" icon={<X />} onClick={onClose}>
                            Cancel
                        </AdminButton>
                        <AdminButton type="submit" icon={<Plus />}>
                            Create Plan
                        </AdminButton>
                    </div>
                </form>
            </div>
        </div>
    );
};