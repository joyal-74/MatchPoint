import { useState, useRef, useEffect } from "react";
import type { EditTeamPayload } from "../../../../features/manager/managerTypes";
import { menuItems } from "./TeamMenuItems";
import type { ColorScheme } from "./teamColors";
import type { TeamStatus } from "../Types";
import { useNavigate } from "react-router-dom";

export type MenuAction = 'manage' | 'edit' | 'delete';

export interface TeamMenuProps {
    teamId: string;
    onEdit: (payload: EditTeamPayload) => void;
    onDelete: (teamId: string) => void;
    name: string;
    sport: string;
    state: string;
    city: string;
    membersCount: number;
    status: TeamStatus;
    managerId: string;
    logo?: string;
    colorScheme?: ColorScheme;
    className?: string;
}

export default function TeamMenu({
    teamId,
    onEdit,
    onDelete,
    name,
    sport,
    state,
    city,
    status,
    membersCount,
    logo,
    managerId,
    colorScheme,
    className = ""
}: TeamMenuProps) {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const menuRef = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();

    const handleManageMember = () => {
        navigate(`/manager/team/${teamId}/manage`)
    }

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
                    updatedData: { name, sport, status, logo, state, city, managerId, membersCount }
                });
                break;
            case 'delete':
                onDelete(teamId);
                break;
            case 'manage':
                handleManageMember();
                break;
            default:
                break;
        }
    };

    return (
        <div className={`relative flex-shrink-0 ${className}`} ref={menuRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`
                    p-1 rounded-lg transition-all duration-200
                    ${colorScheme
                        ? `${colorScheme.buttonBg} ${colorScheme.buttonHoverBg}`
                        : 'hover:bg-neutral-700/50'
                    }
                `}
                aria-label="Team options"
            >
                <svg
                    className={`w-5 h-5 ${colorScheme ? colorScheme.text : 'text-neutral-400'}`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                >
                    <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z" />
                </svg>
            </button>

            {isOpen && (
                <div className={`
                    absolute right-0 w-28 rounded-lg shadow-xl z-50 
                    border backdrop-blur-md overflow-hidden
                    ${colorScheme ? `bg-neutral-900/95 ${colorScheme.border}` : 'bg-neutral-800/95 border-neutral-700'}
                `}>
                    {menuItems.map((item) => (
                        <button
                            key={item.action}
                            onClick={() => handleMenuAction(item.action)}
                            className={`
                                w-full text-left text-[13px] px-2 py-2 
                                transition-all duration-200 flex items-center gap-0
                                ${colorScheme
                                    ? `hover:bg-white/10 ${item.action === 'delete' ? 'text-red-400 hover:text-red-300 hover:bg-red-500/10' : `${colorScheme.text} ${colorScheme.hoverText}`}`
                                    : item.className
                                }
                            `}
                        >
                            {item.icon(colorScheme)}{item.label}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}