import React, { useId, useMemo } from "react";
import CustomSelect, { type Option } from "../../../ui/CustomSelect"; // Import Option from CustomSelect
import { normalizeValue } from "../../../../utils/NormalizeDate";
import { AlertCircle } from "lucide-react";

export interface FormInputProps {
    label: string;
    name: string;
    value: string | number | undefined;
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
    type?: "text" | "number" | "email" | "password" | "date" | "datetime-local" | "textarea" | "select";
    icon?: React.ReactNode;
    placeholder?: string;
    required?: boolean;
    min?: string | number;
    rows?: number;
    // UPDATED: Accepts simple strings OR objects
    options?: string[] | Option[]; 
    error?: string;
    disabled?: boolean;
}

export default function FormInput({
    label, icon, type = "text", name, value, onChange,
    placeholder, required = false, min, options, rows, error, disabled
}: FormInputProps) {

    const id = useId();

    // 1. Smart Normalization: Convert string[] to Option[] automatically
    const normalizedOptions: Option[] = useMemo(() => {
        if (!options) return [];
        // Check if the first item is a string
        if (typeof options[0] === 'string') {
            return (options as string[]).map(opt => ({ label: opt, value: opt }));
        }
        // Otherwise assume it's already Option[]
        return options as Option[];
    }, [options]);

    // 2. Helper to find the selected option object
    const getSelectedOption = () => {
        if (!normalizedOptions || value === undefined || value === null) return null;
        // String comparison to be safe
        return normalizedOptions.find(opt => String(opt.value) === String(value)) || null;
    };

    // 3. Styles
    const baseClasses = 
        "w-full px-4 py-2.5 bg-background border rounded-lg text-foreground text-sm " +
        "placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 transition-all duration-200 " +
        "file:border-0 file:bg-transparent file:text-sm file:font-medium " +
        "dark:[&::-webkit-calendar-picker-indicator]:invert " +
        "disabled:opacity-50 disabled:cursor-not-allowed ";

    const stateClasses = error
        ? "border-destructive focus:ring-destructive/30 focus:border-destructive"
        : "border-input focus:ring-primary/50 focus:border-primary";

    const commonClasses = `${baseClasses} ${stateClasses}`;

    return (
        <div className="space-y-1.5">
            <label 
                htmlFor={id} 
                className="text-sm font-medium text-muted-foreground flex items-center gap-2"
            >
                {icon && <span className="text-primary">{icon}</span>}
                {label}
                {required && <span className="text-destructive">*</span>}
            </label>

            {type === "select" ? (
                <CustomSelect
                    id={id}
                    options={normalizedOptions}
                    name={name}
                    value={getSelectedOption()} 
                    isDisabled={disabled}
                    onChange={(selectedOption) => {
                        const syntheticEvent = {
                            target: {
                                name: name,
                                value: selectedOption?.value ?? ""
                            }
                        } as React.ChangeEvent<HTMLSelectElement>;
                        onChange(syntheticEvent);
                    }}
                    placeholder={placeholder || `Select ${label.toLowerCase()}`}
                    className={error ? "border-destructive" : ""} 
                />
            ) : type === "textarea" ? (
                <textarea
                    id={id}
                    name={name}
                    value={normalizeValue(value)}
                    onChange={onChange}
                    placeholder={placeholder}
                    rows={rows || 4}
                    className={`${commonClasses} resize-none`}
                    required={required}
                    disabled={disabled}
                />
            ) : (
                <input
                    id={id}
                    type={type}
                    name={name}
                    value={normalizeValue(value, type)}
                    onChange={onChange}
                    placeholder={placeholder}
                    className={commonClasses}
                    required={required}
                    min={min}
                    disabled={disabled}
                />
            )}

            {error && (
                <p className="text-xs text-destructive flex items-center gap-1 animate-in slide-in-from-top-1 fade-in duration-200">
                    <AlertCircle size={12} />
                    {error}
                </p>
            )}
        </div>
    );
}