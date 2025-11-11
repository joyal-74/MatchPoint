import { X } from "lucide-react";
import type { RegisteredTeam } from "./TabContent";

interface TeamDetailsModalProps {
    team: RegisteredTeam | null;
    isOpen: boolean;
    onClose: () => void;
}

export default function TeamDetailsModal({ team, isOpen, onClose }: TeamDetailsModalProps) {
    if (!isOpen || !team) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="bg-neutral-50 dark:bg-neutral-900 rounded-xl shadow-xl max-w-md w-full p-6 relative border border-neutral-200 dark:border-neutral-700">
                {/* Close Button */}
                <button
                    className="absolute top-4 right-4 text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300"
                    onClick={onClose}
                >
                    <X size={22} />
                </button>

                {/* Header */}
                <h3 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100 mb-4">
                    {team.name}
                </h3>

                <img className="w-20 h-20" src={team.logo} alt="" />

                <div className="space-y-2 text-neutral-700 dark:text-neutral-300">
                    <p><span className="font-medium">Captain:</span> {team.captain}</p>
                    
                    <p><span className="font-medium">Registered:</span> {new Date(team.createdAt).toLocaleDateString()}</p>
                </div>
            </div>
        </div>
    );
}
