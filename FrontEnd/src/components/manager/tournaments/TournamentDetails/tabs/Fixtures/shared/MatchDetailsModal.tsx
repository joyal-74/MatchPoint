import { X } from "lucide-react";
import type { Match } from "../../../../../../../features/manager/managerTypes";

interface MatchDetailsModalProps {
    match: Match | null;
    isOpen: boolean;
    onClose: () => void;
}

export default function MatchDetailsModal({ match, isOpen, onClose }: MatchDetailsModalProps) {
    if (!isOpen || !match) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="bg-neutral-50 dark:bg-neutral-900 rounded-xl shadow-xl max-w-lg w-full p-6 relative border border-neutral-200 dark:border-neutral-700">
                {/* Close Button */}
                <button
                    className="absolute top-4 right-4 text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300"
                    onClick={onClose}
                >
                    <X size={22} />
                </button>

                {/* Teams with Logos */}
                <div className="flex items-center justify-center gap-4 mb-4">
                    {match.teamLogoA && (
                        <img
                            src={match.teamLogoA}
                            alt={match.teamA}
                            className="w-12 h-12 object-contain rounded-full border border-neutral-200 dark:border-neutral-700"
                        />
                    )}
                    <span className="text-neutral-400 dark:text-neutral-500 font-semibold">vs</span>
                    {match.teamLogoB && (
                        <img
                            src={match.teamLogoB}
                            alt={match.teamB || ""}
                            className="w-12 h-12 object-contain rounded-full border border-neutral-200 dark:border-neutral-700"
                        />
                    )}
                </div>

                {/* Header */}
                <h3 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100 text-center mb-4">
                    {match.teamA} <span className="text-neutral-400 dark:text-neutral-500">vs</span> {match.teamB}
                </h3>

                {/* Match Info */}
                <div className="space-y-2 text-neutral-700 dark:text-neutral-300 text-sm">
                    <p><span className="font-medium">Round:</span> {match.round}</p>
                    <p>
                        <span className="font-medium">Status:</span>
                        <span className={`ml-1 capitalize ${match.status === 'upcoming' ? 'text-blue-500' : match.status === 'completed' ? 'text-green-500' : 'text-red-500'}`}>
                            {match.status}
                        </span>
                    </p>
                    <p><span className="font-medium">Venue:</span> {match.venue}</p>
                    <p>
                        <span className="font-medium">Date:</span>{" "}
                        {match.date ? new Date(match.date).toLocaleDateString() : "TBD"}
                    </p>

                    {match.winner && <p><span className="font-medium">Winner:</span> {match.winner}</p>}
                </div>

            </div>
        </div>
    );
}