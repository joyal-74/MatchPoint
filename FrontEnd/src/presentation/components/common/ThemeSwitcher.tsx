import React from "react";
import { useTheme } from "../../../app/providers/ThemeProvider";
import { MdDarkMode, MdLightMode } from "react-icons/md";

const ThemeSwitcher: React.FC = () => {
    const { theme, toggleTheme } = useTheme();

    return (
        <button
            onClick={toggleTheme}
            className="flex items-center justify-center p-2 rounded-full bg-[--color-secondary] text-[--text-primary] hover:bg-[--color-thertiary] transition"
        >
            {theme === "dark" ? (<MdLightMode size={24} />) : (<MdDarkMode size={24} />)}
        </button>
    );
};

export default ThemeSwitcher;