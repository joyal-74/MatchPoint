import React, { useId, useMemo } from "react";
import  { type Option } from "../../../ui/CustomSelect";
import { normalizeValue } from "../../../../utils/NormalizeDate";
import { AlertCircle } from "lucide-react";

export interface FormInputProps {
    label: string;
    name: string;
    value: string | number | undefined;
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
    onSelectChange?: (name: string, value: string) => void;
    type?: "text" | "number" | "email" | "password" | "date" | "datetime-local" | "textarea" | "select";
    icon?: React.ReactNode;
    placeholder?: string;
    required?: boolean;
    min?: string | number;
    max?: string | number;
    rows?: number;
    options?: string[] | Option[];
    error?: string;
    disabled?: boolean;
}

export default function FormInput({
    label, icon, type = "text", name, value, onChange,
    placeholder, required = false, min,max, options, rows, error, disabled
}: FormInputProps) {

    const id = useId();

    const normalizedOptions: Option[] = useMemo(() => {
        if (!options) return [];
        if (typeof options[0] === 'string') {
            return (options as string[]).map(opt => ({ label: opt, value: opt }));
        }
        return options as Option[];
    }, [options]);

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
                <select
                    id={id}
                    name={name}
                    value={value}
                    onChange={onChange}
                    disabled={disabled}
                    className={`${commonClasses} appearance-none cursor-pointer`}
                    required={required}
                >
                    <option value="" disabled>
                        {placeholder || `Select ${label.toLowerCase()}`}
                    </option>
                    {normalizedOptions.map((opt) => (
                        <option key={String(opt.value)} value={String(opt.value)}>
                            {opt.label}
                        </option>
                    ))}
                </select>

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
                    max={max}
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