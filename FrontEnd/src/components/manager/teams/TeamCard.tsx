import { useState, useRef, useEffect } from "react";

export interface TeamCardProps {
    id: number;
    name: string;
    sport: string;
    members: string;
    created: string;
    status: "Active" | "Inactive";
    color: string;
    onEdit: (id: number) => void;
    onDelete: (id: number) => void;
    onManageMembers: (id: number) => void;
}

type MenuAction = 'manage' | 'edit' | 'delete';

export default function TeamCard({
    id,
    name,
    sport,
    members,
    created,
    status,
    color,
    onEdit,
    onDelete,
    onManageMembers
}: TeamCardProps) {
    const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsMenuOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleMenuAction = (action: MenuAction): void => {
        setIsMenuOpen(false);
        switch (action) {
            case 'manage':
                onManageMembers(id);
                break;
            case 'edit':
                onEdit(id);
                break;
            case 'delete':
                onDelete(id);
                break;
            default:
                break;
        }
    };

    return (
        <div className="bg-neutral-800/50 rounded-xl border border-neutral-700/50 overflow-hidden transition-all duration-300 hover:border-neutral-600/50">
            {/* Header with color accent */}
            <div className={`${color} h-2 w-full`}></div>

            {/* Card Content */}
            <div className="p-5">
                {/* Header with team name and menu */}
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <h3 className="text-lg font-semibold mb-1">{name}</h3>
                        <span className="text-sm text-neutral-400 bg-neutral-700/50 px-2 py-1 rounded">
                            {sport}
                        </span>
                    </div>

                    {/* Three dots menu */}
                    <div className="relative" ref={menuRef}>
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="p-2 hover:bg-neutral-700/50 rounded-lg transition-colors duration-200"
                            aria-label="Team options"
                        >
                            <svg className="w-5 h-5 text-neutral-400" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z" />
                            </svg>
                        </button>

                        {/* Dropdown menu */}
                        {isMenuOpen && (
                            <div className="absolute right-0 mt-2 w-48 bg-neutral-800 border border-neutral-700 rounded-lg shadow-lg z-10">
                                <button
                                    onClick={() => handleMenuAction('manage')}
                                    className="w-full text-left px-3 py-2 hover:bg-neutral-700/50 transition-colors duration-200 flex items-center"
                                >
                                    <svg className="w-4 h-4 mr-3 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                                    </svg>
                                    Members
                                </button>
                                <button
                                    onClick={() => handleMenuAction('edit')}
                                    className="w-full text-left px-3 py-2 hover:bg-neutral-700/50 transition-colors duration-200 flex items-center"
                                >
                                    <svg className="w-4 h-4 mr-3 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                    </svg>
                                    Edit Team
                                </button>
                                <button
                                    onClick={() => handleMenuAction('delete')}
                                    className="w-full text-left px-3 py-2 hover:bg-red-500/20 text-red-400 transition-colors duration-200 flex items-center"
                                >
                                    <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                    Delete Team
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Team Details */}
                <div className="space-y-3">
                    <div className="flex items-center text-sm text-neutral-300">
                        <svg className="w-4 h-4 mr-2 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                        </svg>
                        {members}
                    </div>

                    <div className="flex items-center text-sm text-neutral-300">
                        <svg className="w-4 h-4 mr-2 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        Created: {created}
                    </div>
                </div>

                {/* Status Badge */}
                <div className="mt-4 flex justify-between items-center">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${status === 'Active'
                        ? 'bg-green-500/20 text-green-400'
                        : 'bg-neutral-500/20 text-neutral-400'
                        }`}>
                        {status}
                    </span>
                </div>
            </div>
        </div>
    );
}