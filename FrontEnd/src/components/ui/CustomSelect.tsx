import React from "react";
import Select, { type StylesConfig, type Props as SelectProps } from "react-select";

export interface Option {
    value: string;
    label: string;
}

interface CustomSelectProps extends Omit<SelectProps<Option, false>, "options"> {
    options: string[];
}

const customStyles: StylesConfig<Option, false> = {
    control: (base, state) => ({
        ...base,
        // Use background color from theme
        backgroundColor: "hsl(var(--background))",
        // Border color logic
        borderColor: state.isFocused 
            ? "hsl(var(--primary))" 
            : "hsl(var(--input))",
        borderWidth: "1px",
        borderRadius: "var(--radius)", // Use theme radius
        padding: "2px",
        fontSize: "0.875rem",
        lineHeight: "1.25rem",
        boxShadow: state.isFocused 
            ? "0 0 0 1px hsl(var(--primary))" 
            : "none",
        transition: "all 0.2s",
        "&:hover": {
            borderColor: state.isFocused 
                ? "hsl(var(--primary))" 
                : "hsl(var(--ring))", // Slightly darker/lighter border on hover
        }
    }),
    menu: (base) => ({
        ...base,
        backgroundColor: "hsl(var(--popover))", // Popover background
        border: "1px solid hsl(var(--border))",
        borderRadius: "var(--radius)",
        boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)", // Tailwind shadow-md
        zIndex: 50,
    }),
    option: (base, { isFocused, isSelected }) => ({
        ...base,
        cursor: "pointer",
        backgroundColor: isSelected
            ? "hsl(var(--primary))" // Selected Item = Primary Color
            : isFocused
                ? "hsl(var(--accent))" // Hovered Item = Accent Color
                : "transparent",
        color: isSelected
            ? "hsl(var(--primary-foreground))" // Text on Primary
            : "hsl(var(--foreground))",       // Standard Text
        fontSize: "0.875rem",
        "&:active": {
            backgroundColor: isSelected 
                ? "hsl(var(--primary))" 
                : "hsl(var(--accent))",
        }
    }),
    singleValue: (base) => ({
        ...base,
        color: "hsl(var(--foreground))", // Selected text in the input
    }),
    placeholder: (base) => ({
        ...base,
        color: "hsl(var(--muted-foreground))", // Placeholder text
    }),
    input: (base) => ({
        ...base,
        color: "hsl(var(--foreground))", // Typing text
    }),
    dropdownIndicator: (base, state) => ({
        ...base,
        color: "hsl(var(--muted-foreground))",
        transition: "transform 0.2s",
        transform: state.selectProps.menuIsOpen ? "rotate(180deg)" : "none",
        "&:hover": {
            color: "hsl(var(--foreground))",
        }
    }),
    indicatorSeparator: (base) => ({
        ...base,
        backgroundColor: "hsl(var(--border))",
    }),
    menuList: (base) => ({
        ...base,
        padding: "4px",
        borderRadius: "var(--radius)",
    }),
    noOptionsMessage: (base) => ({
        ...base,
        color: "hsl(var(--muted-foreground))",
    })
};

const CustomSelect: React.FC<CustomSelectProps> = ({ options, ...props }) => {
    // Map string array to Option objects
    const mappedOptions = options.map((opt) => ({
        value: opt.toLowerCase(),
        label: opt,
    }));

    return (
        <Select<Option, false> 
            options={mappedOptions} 
            styles={customStyles}
            className="react-select-container"
            classNamePrefix="react-select"
            isSearchable={true} // Usually good to have
            {...props} 
        />
    );
};

export default CustomSelect;