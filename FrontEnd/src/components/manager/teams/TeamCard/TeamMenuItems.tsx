import type { MenuAction } from "./TeamMenu";

export const menuItems = [
    {
        action: "manage" as MenuAction,
        label: "Members",
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
    },
    {
        action: "edit" as MenuAction,
        label: "Edit",
        icon: (colorScheme?: { text: string }) => (
            <svg
                className={`w-4 h-4 mr-3 ${colorScheme ? colorScheme.text : "text-blue-400"}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
            </svg>
        ),
        className: "hover:bg-neutral-700/50",
    },
    {
        action: "delete" as MenuAction,
        label: "Delete",
        icon: () => (
            <svg
                className="w-4 h-4 mr-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
            </svg>
        ),
        className: "hover:bg-red-500/20 text-red-400",
    },
];
