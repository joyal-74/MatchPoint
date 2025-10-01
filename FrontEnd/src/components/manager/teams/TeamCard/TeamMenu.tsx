import { useState, useRef, useEffect } from "react";
import type { EditTeamPayload, Members } from "../../../../features/manager/managerTypes";
import { menuItems } from "./TeamMenuItems";

export type MenuAction = 'manage' | 'edit' | 'delete';

export interface TeamMenuProps {
    onAction: (action: MenuAction) => void;
    teamId: string;
    onEdit: (payload: EditTeamPayload) => void;
    onDelete: (teamId: string) => void;
    name: string;
    sport: string;
    members : Members[];
    status: boolean;
    managerId: string;
    logo?: string;
    className?: string;
}

export default function TeamMenu({ onAction, teamId, onEdit, onDelete, name, sport, status, members, logo, managerId, className = "" }: TeamMenuProps) {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleMenuAction = (action: MenuAction): void => {
        setIsOpen(false);
        switch (action) {
            case 'edit':
                onEdit({
                    teamId,
                    updatedData: { name, sport, status, logo, managerId, members }
                });
                break;
            case 'delete':
                onDelete(teamId);
                break;
            default:
                onAction(action);
                break;
        }
    };

    return (
        <div className={`relative flex-shrink-0 ${className}`} ref={menuRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-2 hover:bg-neutral-700/50 rounded-lg transition-colors duration-200"
                aria-label="Team options"
            >
                <svg className="w-5 h-5 text-neutral-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z" />
                </svg>
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-neutral-800 border border-neutral-700 rounded-lg shadow-lg z-10">
                    {menuItems.map((item) => (
                        <button
                            key={item.action}
                            onClick={() => handleMenuAction(item.action)}
                            className={`w-full text-left text-sm px-3 py-2 transition-colors duration-200 flex items-center ${item.className}`}
                        >
                            {item.icon}
                            {item.label}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}