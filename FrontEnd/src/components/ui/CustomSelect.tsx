import React from "react";
import Select, { type StylesConfig, type Props as SelectProps } from "react-select";

// 1. Export this so other components can use it
export interface Option {
    value: string | number; // Allow numbers too for safety
    label: string;
}

// 2. Update interface: options should be Option[], not string[]
interface CustomSelectProps extends Omit<SelectProps<Option, false>, "options"> {
    options: Option[]; 
}

const customStyles: StylesConfig<Option, false> = {
    control: (base, state) => ({
        ...base,
        backgroundColor: "hsl(var(--background))",
        borderColor: state.isFocused ? "hsl(var(--primary))" : "hsl(var(--input))",
        borderWidth: "1px",
        borderRadius: "var(--radius)",
        padding: "2px",
        fontSize: "0.875rem",
        lineHeight: "1.25rem",
        boxShadow: state.isFocused ? "0 0 0 1px hsl(var(--primary))" : "none",
        transition: "all 0.2s",
        "&:hover": {
            borderColor: state.isFocused ? "hsl(var(--primary))" : "hsl(var(--ring))",
        }
    }),
    menu: (base) => ({
        ...base,
        backgroundColor: "hsl(var(--popover))",
        border: "1px solid hsl(var(--border))",
        borderRadius: "var(--radius)",
        boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
        zIndex: 50,
    }),
    option: (base, { isFocused, isSelected }) => ({
        ...base,
        cursor: "pointer",
        backgroundColor: isSelected
            ? "hsl(var(--primary))"
            : isFocused
                ? "hsl(var(--accent))"
                : "transparent",
        color: isSelected
            ? "hsl(var(--primary-foreground))"
            : "hsl(var(--foreground))",
        fontSize: "0.875rem",
        "&:active": {
            backgroundColor: isSelected ? "hsl(var(--primary))" : "hsl(var(--accent))",
        }
    }),
    singleValue: (base) => ({
        ...base,
        color: "hsl(var(--foreground))",
    }),
    placeholder: (base) => ({
        ...base,
        color: "hsl(var(--muted-foreground))",
    }),
    input: (base) => ({
        ...base,
        color: "hsl(var(--foreground))",
    }),
    dropdownIndicator: (base, state) => ({
        ...base,
        color: "hsl(var(--muted-foreground))",
        transition: "transform 0.2s",
        transform: state.selectProps.menuIsOpen ? "rotate(180deg)" : "none",
        "&:hover": { color: "hsl(var(--foreground))" }
    }),
    indicatorSeparator: (base) => ({
        ...base,
        backgroundColor: "hsl(var(--border))",
    }),
    menuList: (base) => ({
        ...base,
        padding: "4px",
    }),
    noOptionsMessage: (base) => ({
        ...base,
        color: "hsl(var(--muted-foreground))",
    })
};

const CustomSelect: React.FC<CustomSelectProps> = ({ options, ...props }) => {
    // 3. REMOVED the mapping logic. 
    // We now pass the options directly because they are already in the correct format.
    
    return (
        <Select<Option, false>
            options={options} // Pass directly
            styles={customStyles}
            className="react-select-container"
            classNamePrefix="react-select"
            isSearchable={true}
            {...props}
        />
    );
};

export default CustomSelect;