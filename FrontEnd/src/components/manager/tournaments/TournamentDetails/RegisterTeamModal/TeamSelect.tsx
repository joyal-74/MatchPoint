import { Users } from "lucide-react";
import type { Team } from "../../../teams/Types";

interface TeamSelectProps {
    teams: Team[];
    selectedTeam: string;
    onSelect: (id: string) => void;
}
export default function TeamSelect({ teams, selectedTeam, onSelect }: TeamSelectProps) {
    return (
        <div className="space-y-2">
            <label className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                <Users size={14} /> Team Selection
            </label>
            <select
                className="w-full p-3 rounded-xl bg-muted/50 border border-border text-foreground text-sm focus:ring-2 focus:ring-ring outline-none transition-all appearance-none cursor-pointer"
                value={selectedTeam}
                onChange={(e) => onSelect(e.target.value)}
            >
                <option value="" className="bg-card">Select a team...</option>
                {teams.map((team) => (
                    <option key={team._id} value={team._id} className="bg-card">{team.name}</option>
                ))}
            </select>
        </div>
    );
}