import { useEffect, useRef, useState } from "react";
import type { Player } from "../../../pages/manager/ManageMembers";
import type { PlayerCardProps } from "../../manager/manageMembers/PlayerCard";

interface PlayerMenuProps {
    player: Player;
    onAction: PlayerCardProps["onAction"];
}

export function PlayerMenu({ player, onAction }: PlayerMenuProps) {
    const [isOpen, setIsOpen] = useState(false);
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

    return (
        <div className="relative" ref={menuRef}>
            <button
                onClick={(e) => {
                    e.stopPropagation();
                    setIsOpen(!isOpen);
                }}
                className="p-2 hover:bg-neutral-700/50 rounded-lg transition-colors"
            >
                <svg className="w-5 h-5 text-neutral-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z" />
                </svg>
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-neutral-800 border border-neutral-700 rounded-lg shadow-lg z-10">
                    <button onClick={(e) => { e.stopPropagation(); onAction("view", player); setIsOpen(false); }} className="w-full px-4 py-3 text-left hover:bg-neutral-700/50 flex items-center text-sm">
                        View Details
                    </button>
                    {player.status !== "active" && <button onClick={(e) => { e.stopPropagation(); onAction("swap", player); setIsOpen(false); }} className="w-full px-4 py-3 text-left hover:bg-neutral-700/50 flex items-center text-sm">Swap to Playing</button>}
                    {player.status !== "substitute" && <button onClick={(e) => { e.stopPropagation(); onAction("makeSubstitute", player); setIsOpen(false); }} className="w-full px-4 py-3 text-left hover:bg-neutral-700/50 flex items-center text-sm">Make Substitute</button>}
                </div>
            )}
        </div>
    );
}
