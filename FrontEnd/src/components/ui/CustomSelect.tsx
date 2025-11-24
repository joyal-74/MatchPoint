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
        backgroundColor: "rgb(38 38 38 / 0.5)",
        borderColor: "rgb(64 64 64 / 0.5)",
        borderWidth: "1px",
        borderRadius: "0.5rem",
        padding: "0.1rem 0.5rem",
        color: "white",
        fontSize: "0.875rem",
        lineHeight: "1.25rem",
        boxShadow: state.isFocused 
            ? "0 0 0 2px rgb(34 197 94 / 0.5)" 
            : "none",
        border: state.isFocused 
            ? "1px solid transparent" 
            : "1px solid rgb(64 64 64 / 0.5)",
        backdropFilter: "blur(8px)",
        transition: "all 0.2s",
        "&:hover": {
            borderColor: state.isFocused ? "transparent" : "rgb(64 64 64 / 0.7)",
        }
    }),
    menu: (base) => ({
        ...base,
        backgroundColor: "rgb(38 38 38 / 0.95)",
        border: "1px solid rgb(64 64 64 / 0.5)",
        borderRadius: "0.5rem",
        backdropFilter: "blur(8px)",
        zIndex: 50,
    }),
    option: (base, { isFocused, isSelected }) => ({
        ...base,
        backgroundColor: isSelected
            ? "#16a34a"
            : isFocused
                ? "rgb(55 65 81)"
                : "transparent",
        color: "white",
        fontSize: "0.875rem",
        "&:active": {
            backgroundColor: "#15803d",
        }
    }),
    singleValue: (base) => ({
        ...base,
        color: "white",
    }),
    placeholder: (base) => ({
        ...base,
        color: "rgb(156 163 175)",
    }),
    input: (base) => ({
        ...base,
        color: "white",
    }),
    dropdownIndicator: (base, state) => ({
        ...base,
        color: "rgb(156 163 175)",
        transition: "transform 0.2s",
        transform: state.selectProps.menuIsOpen ? "rotate(180deg)" : "none",
        "&:hover": {
            color: "white",
        }
    }),
    indicatorSeparator: (base) => ({
        ...base,
        backgroundColor: "rgb(64 64 64 / 0.5)",
    }),
    menuList: (base) => ({
        ...base,
        borderRadius: "0.5rem",
    }),
};

const CustomSelect: React.FC<CustomSelectProps> = ({ options, ...props }) => {
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
            {...props} 
        />
    );
};

export default CustomSelect;