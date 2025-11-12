import type { MenuAction } from "./TeamMenu";

export const menuItems = [
    {
        action: "leave" as MenuAction,
        label: "Leave",
        icon: (colorScheme?: { text: string }) => (
            <svg
                className={`w-4 h-4 mr-3 ${colorScheme ? colorScheme.text : "text-green-400"}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 20h5v-2a4 4 0 00-3-3.87M9 20H4v-2a4 4 0 013-3.87M12 12a4 4 0 100-8 4 4 0 000 8z"
                />
            </svg>
        ),
        className: "hover:bg-neutral-700/50",
    }
];
