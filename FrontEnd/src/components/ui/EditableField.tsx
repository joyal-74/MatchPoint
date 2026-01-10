import React from 'react';
import { ChevronDown } from 'lucide-react';

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
    fullWidth = false
}) => {
    
    // Common styles for both Input and Read-only view to ensure alignment
    const baseClasses = "w-full rounded-lg text-sm transition-all duration-200";
    
    // Styles specific to Edit Mode
    const editClasses = "bg-background border border-input text-foreground px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary placeholder:text-muted-foreground/50";
    
    // Styles specific to View Mode (Read-only)
    const viewClasses = "bg-muted/30 border border-border/50 text-foreground px-3 py-2.5 cursor-default";

    return (
        <div className={`flex flex-col gap-1.5 ${fullWidth ? 'md:col-span-2' : ''}`}>
            
            {/* Label - Semantic & Muted */}
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide ml-1">
                {label}
            </label>

            {isEditing ? (
                /* --- EDIT MODE --- */
                <div className="relative">
                    {textarea ? (
                        <textarea
                            value={value || ''}
                            onChange={(e) => onChange(e.target.value)}
                            placeholder={placeholder}
                            className={`${baseClasses} ${editClasses} min-h-[115px] resize-y`}
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
                            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" size={16} />
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
            ) : (
                /* --- VIEW MODE --- */
                <div className={`${baseClasses} ${viewClasses} ${textarea ? 'min-h-[110px]' : 'h-10'} flex`}>
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