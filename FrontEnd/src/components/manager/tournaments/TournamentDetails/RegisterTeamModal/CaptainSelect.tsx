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
        <div className="space-y-2 animate-in fade-in slide-in-from-top-2">
            <label className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                <Crown size={14} className="text-warning" /> Assign Captain
            </label>
            <select
                className="w-full p-3 rounded-xl bg-muted/50 border border-border text-foreground text-sm focus:ring-2 focus:ring-ring outline-none transition-all cursor-pointer"
                value={selectedCaptain}
                onChange={(e) => onSelect(e.target.value)}
            >
                <option value="" className="bg-card">Choose the leader...</option>
                {team.members.map((player) => (
                    <option key={player.userId} value={player.userId} className="bg-card">
                        {`${player.firstName} ${player.lastName}`}
                    </option>
                ))}
            </select>
        </div>
    );
}