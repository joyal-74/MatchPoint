import type { FormInputProps } from "./types";
import CustomSelect from "../../../ui/CustomSelect";
import { normalizeValue } from "../../../../utils/NormalizeDate";

export default function FormInput({
    label, icon, type, name, value, onChange,
    placeholder, required = false, min, options, rows
}: FormInputProps) {
  
    const commonClasses =
        "w-full px-4 py-2.5 bg-background border border-input " +
        "rounded-lg text-foreground placeholder:text-muted-foreground/50 focus:outline-none " +
        "focus:ring-2 text-sm focus:ring-primary/50 focus:border-primary " +
        "transition-all duration-200 file:border-0 file:bg-transparent file:text-sm file:font-medium " +
        "dark:[&::-webkit-calendar-picker-indicator]:invert"; 

    return (
        <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                {icon && <span className="text-primary">{icon}</span>}
                {label}
            </label>

            {type === "select" && options ? (
                <CustomSelect
                    options={options}
                    name={name}
                    value={value ? { value: value.toString().toLowerCase(), label: value.toString() } : null}
                    onChange={(selectedOption) => {
                        const syntheticEvent = {
                            target: {
                                name: name,
                                value: selectedOption?.value || ""
                            }
                        } as React.ChangeEvent<HTMLSelectElement>;

                        onChange(syntheticEvent);
                    }}
                    placeholder={placeholder || `Select ${label.toLowerCase()}`}
                />
            ) : type === "textarea" ? (
                <textarea
                    name={name}
                    value={normalizeValue(value)}
                    onChange={onChange}
                    placeholder={placeholder}
                    rows={rows}
                    className={commonClasses + " resize-none"}
                    required={required}
                />
            ) : (
                <input
                    type={type}
                    name={name}
                    value={normalizeValue(value, type)}
                    onChange={onChange}
                    placeholder={placeholder}
                    className={commonClasses}
                    required={required}
                    min={min}
                />
            )}
        </div>
    );
}