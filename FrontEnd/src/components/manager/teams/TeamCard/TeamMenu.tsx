import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MoreHorizontal } from "lucide-react";
import type { EditTeamPayload } from "../../../../features/manager/managerTypes";
import { menuItems } from "./TeamMenuItems";
import type { ColorScheme } from "./TeamColors";
import type { TeamStatus } from "../Types";

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
    className = ""
}: TeamMenuProps) {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const menuRef = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();

    const handleManageMember = () => {
        navigate(`/manager/team/${teamId}/manage`)
    }

    // Handle click outside to close menu
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
            {/* Trigger Button */}
            <button
                onClick={(e) => {
                    e.stopPropagation();
                    setIsOpen(!isOpen);
                }}
                className={`
                    p-1.5 rounded-lg transition-all duration-200
                    hover:bg-muted text-muted-foreground hover:text-foreground
                    focus:outline-none focus:ring-2 focus:ring-primary/20
                    ${isOpen ? 'bg-muted text-foreground' : ''}
                `}
                aria-label="Team options"
            >
                <MoreHorizontal size={20} />
            </button>

            {/* Dropdown Menu */}
            {isOpen && (
                <div 
                    className="
                        absolute right-0 top-full mt-2 w-48 z-50
                        bg-popover text-popover-foreground
                        rounded-lg border border-border shadow-lg shadow-black/5
                        animate-in fade-in zoom-in-95 duration-150 origin-top-right
                        overflow-hidden p-1
                    "
                    onClick={(e) => e.stopPropagation()}
                >
                    {menuItems.map((item) => (
                        <button
                            key={item.action}
                            onClick={() => handleMenuAction(item.action)}
                            className={`
                                w-full flex items-center text-left text-sm px-3 py-2 rounded-md
                                transition-colors duration-150
                                ${item.action === 'delete' 
                                    ? 'text-destructive hover:bg-destructive/10 hover:text-destructive' 
                                    : 'text-foreground hover:bg-accent hover:text-accent-foreground'
                                }
                            `}
                        >
                            {/* Assumes item.icon returns a ReactNode */}
                            {typeof item.icon === 'function' ? item.icon() : item.icon}
                            <span className="ml-0">{item.label}</span>
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}