import { Crown } from "lucide-react";
import type { Team } from "../../../teams/Types";


interface CaptainSelectProps {
    team: Team | undefined;
    selectedCaptain: string;
    onSelect: (id: string) => void;
}

export default function CaptainSelect({ team, selectedCaptain, onSelect }: CaptainSelectProps) {
    if (!team) return null;

    return (
        <div>
            <label className="flex items-center gap-2 text-sm font-medium text-neutral-300 mb-3">
                <Crown size={16} className="text-yellow-500" />
                Select Captain
            </label>
            <select
                className="w-full p-3 rounded-md bg-neutral-800 border border-neutral-700 text-white text-sm focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 transition-colors"
                value={selectedCaptain}
                onChange={(e) => onSelect(e.target.value)}
            >
                <option value="">Choose a player as Captain</option>
                {team.members.map((player) => (
                    <option key={player.userId} value={player.userId}>
                        {`${player.firstName} ${player.lastName}`}
                    </option>
                ))}
            </select>
        </div>
    );
}