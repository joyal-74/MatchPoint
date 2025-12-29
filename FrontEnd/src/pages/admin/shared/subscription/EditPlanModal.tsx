import React, { useEffect, useState } from "react";
import { Edit3, User, X, IndianRupee, AlertCircle } from "lucide-react";
import type { Plan, PlanForm } from "./SubscriptionTypes";

export const EditPlanModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    // FIX: Strictly typed to match API expectation
    onSave: (id: string, updatedPlan: Omit<Plan, "_id">) => void;
    planToEdit: Plan | null;
}> = ({ isOpen, onClose, onSave, planToEdit }) => {

    const [formData, setFormData] = useState<PlanForm>({
        userType: "player",
        level: "Free",
        title: "",
        price: "",
        featuresInput: "",
        billingCycle: undefined,
    });

    const [errors, setErrors] = useState<Record<string, string>>({});
    const [touched, setTouched] = useState<Record<string, boolean>>({});

    // Pre-fill Data
    useEffect(() => {
        if (planToEdit && isOpen) {
            setFormData({
                userType: planToEdit.userType,
                level: planToEdit.level,
                title: planToEdit.title,
                price: planToEdit.price === 0 ? "" : planToEdit.price.toString(),
                featuresInput: planToEdit.features.join("\n"),
                billingCycle: planToEdit.billingCycle,
            });
            setErrors({});
            setTouched({});
        }
    }, [planToEdit, isOpen]);

    // --- Validation Logic ---
    const validateField = (name: string, value: string, currentForm: PlanForm): string => {
        switch (name) {
            case "title":
                if (!value.trim()) return "Plan title is required.";
                if (value.length < 3) return "Title must be at least 3 characters.";
                if (value.length > 50) return "Title cannot exceed 50 characters.";
                return "";
            
            case "price":
                if (currentForm.level !== "Free") {
                    if (value === "" || value === null) return "Price is required.";
                    if (parseFloat(value) <= 0) return "Price must be greater than 0.";
                }
                return "";

            case "featuresInput": {
                const features = value.split("\n").map((f: string) => f.trim()).filter(Boolean);
                if (features.length === 0) return "At least one feature is required.";
                if (features.length > 15) return `Max 15 features allowed.`;
                if (features.some((f: string) => f.length > 100)) return "Features cannot exceed 100 characters.";
                return "";
            }

            default:
                return "";
        }
    };

    // --- Handlers ---
    const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setTouched(prev => ({ ...prev, [name]: true }));
        const error = validateField(name, value, formData);
        setErrors(prev => ({ ...prev, [name]: error }));
    };

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;

        if (name === "level") {
            const isFree = value === "Free";
            const updatedForm = {
                ...formData,
                level: value,
                price: isFree ? "0" : "",
                billingCycle: undefined,
            } as PlanForm;

            setFormData(updatedForm);
            if (isFree) setErrors(prev => ({ ...prev, price: "" }));
            return;
        }

        if (name === "price") {
            if (value !== "" && !/^\d*\.?\d{0,2}$/.test(value)) return;
        }

        const updatedForm = { ...formData, [name]: value };
        setFormData(updatedForm);

        if (touched[name] || errors[name]) {
            const error = validateField(name, value, updatedForm);
            setErrors(prev => ({ ...prev, [name]: error }));
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!planToEdit) return;

        // Validation Check
        const validationErrors: Record<string, string> = {};
        const titleErr = validateField("title", formData.title, formData);
        if (titleErr) validationErrors.title = titleErr;
        const priceErr = validateField("price", formData.price, formData);
        if (priceErr) validationErrors.price = priceErr;
        const featErr = validateField("featuresInput", formData.featuresInput, formData);
        if (featErr) validationErrors.featuresInput = featErr;

        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            setTouched({ title: true, price: true, featuresInput: true });
            return;
        }

        // Prepare Payload
        const features = formData.featuresInput.split("\n").map(f => f.trim()).filter(Boolean);
        
        // FIX: Construct object typed as Omit<Plan, "_id">
        const updatedPlan: Omit<Plan, "_id"> = {
            userType: formData.userType,
            level: formData.level,
            title: formData.title,
            price: parseFloat(formData.price || "0"),
            features,
            billingCycle: formData.level === "Free" ? undefined : formData.billingCycle,
        };

        onSave(planToEdit._id, updatedPlan);
        onClose();
    };

    if (!isOpen || !planToEdit) return null;

    const getInputClass = (fieldName: string) => `
        flex h-10 w-full rounded-md border bg-background px-3 py-2 text-sm ring-offset-background 
        placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 
        disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200
        ${errors[fieldName] 
            ? "border-destructive focus-visible:ring-destructive/50" 
            : "border-input focus-visible:ring-primary"
        }
    `;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="bg-popover text-popover-foreground rounded-xl shadow-2xl w-full max-w-2xl border border-border flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200">

                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-muted/20">
                    <div className="flex items-center gap-2">
                        <div className="p-2 bg-amber-500/10 rounded-lg text-amber-500">
                            <Edit3 className="w-5 h-5" />
                        </div>
                        <h2 className="text-lg font-semibold tracking-tight">Edit Plan</h2>
                    </div>
                    <button onClick={onClose} className="p-2 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Form */}
                <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
                    <form id="edit-plan-form" onSubmit={handleSubmit} className="space-y-5">
                        
                        {/* Target Role (Locked) */}
                        <div className="p-3 rounded-lg border border-border bg-muted/30 flex items-center gap-3 opacity-80 cursor-not-allowed">
                            <div className="p-1.5 bg-muted rounded-full text-muted-foreground">
                                <User className="w-4 h-4" />
                            </div>
                            <div>
                                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Target User Role</p>
                                <p className="font-semibold text-foreground capitalize">{formData.userType}</p>
                            </div>
                        </div>

                        {/* Title */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium leading-none">Plan Title <span className="text-destructive">*</span></label>
                            <input
                                type="text"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                className={getInputClass("title")}
                            />
                            {errors.title && <p className="text-xs text-destructive flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {errors.title}</p>}
                        </div>

                        {/* Level & Price */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium leading-none">Plan Level <span className="text-destructive">*</span></label>
                                <select name="level" value={formData.level} onChange={handleChange} className={getInputClass("level")}>
                                    <option value="Free">Free</option>
                                    <option value="Premium">Premium</option>
                                    <option value="Super">Super</option>
                                </select>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium leading-none">Price (₹) <span className="text-destructive">*</span></label>
                                <div className="relative">
                                    <span className="absolute left-3 top-2.5 text-muted-foreground"><IndianRupee className="w-4 h-4" /></span>
                                    <input
                                        type="text"
                                        name="price"
                                        value={formData.price}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        disabled={formData.level === "Free"}
                                        className={`${getInputClass("price")} pl-9`}
                                    />
                                </div>
                                {errors.price && <p className="text-xs text-destructive flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {errors.price}</p>}
                            </div>
                        </div>

                        {/* Billing Cycle */}
                        {formData.level !== "Free" && (
                            <div className="space-y-2 animate-in slide-in-from-top-2 fade-in duration-300">
                                <label className="text-sm font-medium leading-none">Billing Cycle <span className="text-destructive">*</span></label>
                                <select name="billingCycle" value={formData.billingCycle || ""} onChange={handleChange} required className={getInputClass("billingCycle")}>
                                    <option value="" disabled>Select Billing Cycle</option>
                                    <option value="Monthly">Monthly</option>
                                    <option value="Yearly">Yearly</option>
                                </select>
                            </div>
                        )}

                        {/* Features */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium leading-none">Features (One per line) <span className="text-destructive">*</span></label>
                            <textarea
                                name="featuresInput"
                                rows={5}
                                value={formData.featuresInput}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                className={`${getInputClass("featuresInput")} h-auto min-h-[120px] resize-none`}
                            />
                            <div className="flex justify-between items-start text-[0.8rem]">
                                <p className="text-muted-foreground">Press Enter to separate features.</p>
                                <span className={(formData.featuresInput.match(/\n/g) || []).length >= 15 ? "text-destructive font-bold" : "text-muted-foreground"}>
                                    {formData.featuresInput ? (formData.featuresInput.match(/\n/g) || []).length + 1 : 0} / 15
                                </span>
                            </div>
                            {errors.featuresInput && <p className="text-xs text-destructive flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {errors.featuresInput}</p>}
                        </div>
                    </form>
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-border bg-muted/20 flex justify-end gap-3">
                    <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium rounded-md border border-input bg-background hover:bg-accent hover:text-accent-foreground transition-colors">Cancel</button>
                    <button type="submit" form="edit-plan-form" className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors shadow-sm">
                        <Edit3 className="w-4 h-4" /> Save Changes
                    </button>
                </div>

            </div>
        </div>
    );
};