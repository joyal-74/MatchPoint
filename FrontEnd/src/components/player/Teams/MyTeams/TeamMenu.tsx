import { useState, useRef, useEffect } from "react";
import { MoreVertical, LogOut } from "lucide-react";

export type MenuAction = 'leave';

export interface TeamMenuProps {
    teamId: string;
    onLeaveRequest: (teamId: string) => void;
    className?: string;
}

export default function TeamMenu({
    teamId,
    onLeaveRequest,
    className = ""
}: TeamMenuProps) {
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    // Close menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleAction = () => {
        setIsOpen(false);
        onLeaveRequest(teamId);
    };

    return (
        <div className={`relative ${className}`} ref={menuRef}>
            
            {/* Trigger Button */}
            <button
                onClick={(e) => {
                    e.stopPropagation();
                    setIsOpen(!isOpen);
                }}
                className={`
                    p-1.5 rounded-lg transition-colors duration-200
                    text-muted-foreground hover:text-foreground hover:bg-muted
                    focus:outline-none focus:ring-2 focus:ring-primary/20
                    ${isOpen ? 'bg-muted text-foreground' : ''}
                `}
                aria-label="Team options"
            >
                <MoreVertical size={18} />
            </button>

            {/* Dropdown Menu */}
            {isOpen && (
                <div className="absolute right-0 top-full mt-2 w-40 z-50 origin-top-right">
                    <div className="bg-popover border border-border rounded-xl shadow-lg p-1.5 animate-in fade-in zoom-in-95 duration-200">
                        
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                handleAction();
                            }}
                            className="
                                w-full flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg
                                text-destructive hover:bg-destructive/10 hover:text-destructive
                                transition-colors group
                            "
                        >
                            <LogOut size={16} className="group-hover:-translate-x-0.5 transition-transform" />
                            Leave Team
                        </button>
                        
                    </div>
                </div>
            )}
        </div>
    );
}