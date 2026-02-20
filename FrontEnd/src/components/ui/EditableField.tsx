import React from 'react';
import { ChevronDown, AlertCircle } from 'lucide-react';

interface EditableFieldProps {
    label: string;
    value: string | number;
    type?: string;
    placeholder: string;
    options?: string[];
    isEditing: boolean;
    onChange: (value: string) => void;
    textarea?: boolean;
    fullWidth?: boolean;
    error?: string;
}

const EditableField: React.FC<EditableFieldProps> = ({
    label,
    value,
    type = 'text',
    options,
    placeholder,
    isEditing,
    onChange,
    textarea = false,
    fullWidth = false,
    error
}) => {
    
    // Common styles for both Input and Read-only view
    const baseClasses = "w-full rounded-lg text-sm transition-all duration-200";
    
    // Updated Edit Classes: Changes border and ring color based on error presence
    const editClasses = `bg-background border ${
        error ? 'border-destructive' : 'border-input'
    } text-foreground px-3 py-2 focus:outline-none focus:ring-2 ${
        error ? 'focus:ring-destructive/20' : 'focus:ring-primary/50'
    } focus:border-primary placeholder:text-muted-foreground/50`;
    
    // Styles specific to View Mode (Read-only)
    const viewClasses = "bg-muted/30 border border-border/50 text-foreground px-3 py-2.5 cursor-default";

    return (
        <div className={`flex flex-col gap-1.5 ${fullWidth ? 'md:col-span-2' : ''}`}>
            
            {/* Label */}
            <label className={`text-xs font-semibold uppercase tracking-wide ml-1 transition-colors ${
                isEditing && error ? 'text-destructive' : 'text-muted-foreground'
            }`}>
                {label}
            </label>

            {isEditing ? (
                /* --- EDIT MODE --- */
                <div className="flex flex-col gap-1">
                    <div className="relative">
                        {textarea ? (
                            <textarea
                                value={value || ''}
                                onChange={(e) => onChange(e.target.value)}
                                placeholder={placeholder}
                                className={`${baseClasses} ${editClasses} min-h-[95px] resize-y`}
                            />
                        ) : options ? (
                            <div className="relative">
                                <select
                                    value={value || ''}
                                    onChange={(e) => onChange(e.target.value)}
                                    className={`${baseClasses} ${editClasses} appearance-none`}
                                >
                                    <option value="" disabled>{placeholder}</option>
                                    {options.map((opt) => (
                                        <option key={opt} value={opt}>{opt}</option>
                                    ))}
                                </select>
                                <ChevronDown className={`absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none transition-colors ${
                                    error ? 'text-destructive' : 'text-muted-foreground'
                                }`} size={16} />
                            </div>
                        ) : (
                            <input
                                type={type}
                                value={value || ''}
                                onChange={(e) => onChange(e.target.value)}
                                placeholder={placeholder}
                                className={`${baseClasses} ${editClasses}`}
                            />
                        )}
                    </div>

                    {/* --- ERROR MESSAGE DISPLAY --- */}
                    {error && (
                        <div className="flex items-center gap-1.5 ml-1 animate-in fade-in slide-in-from-top-1 duration-200">
                            <AlertCircle size={12} className="text-destructive" />
                            <p className="text-[11px] font-medium text-destructive leading-tight">
                                {error}
                            </p>
                        </div>
                    )}
                </div>
            ) : (
                /* --- VIEW MODE --- */
                <div className={`${baseClasses} ${viewClasses} ${textarea ? 'min-h-[90px]' : 'h-10'} flex items-center`}>
                    {value && String(value).trim() !== '' ? (
                        <span className="truncate">{value}</span>
                    ) : (
                        <span className="text-muted-foreground/50 italic text-xs">
                            Not provided
                        </span>
                    )}
                </div>
            )}
        </div>
    );
};

export default EditableField;