import { Users } from "lucide-react";
import type { Team } from "../../../teams/Types";

interface TeamSelectProps {
    teams: Team[];
    selectedTeam: string;
    onSelect: (id: string) => void;
}

export default function TeamSelect({ teams, selectedTeam, onSelect }: TeamSelectProps) {
    return (
        <div>
            <label className="flex items-center gap-2 text-sm font-medium text-neutral-300 mb-3">
                <Users size={16} />
                Select Your Team
            </label>
            <select
                className="w-full p-3 rounded-md bg-neutral-800 border border-neutral-700 text-white text-sm focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-colors"
                value={selectedTeam}
                onChange={(e) => onSelect(e.target.value)}
            >
                <option value="">Choose your Team</option>
                {teams.map((team) => (
                    <option key={team._id} value={team._id}>
                        {team.name}
                    </option>
                ))}
            </select>
        </div>
    );
}