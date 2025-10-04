import { Users, Download } from "lucide-react";

interface TeamsTabProps {
    registeredTeams: any[];
}

export default function TeamsTab({ registeredTeams }: TeamsTabProps) {
    return (
        <div className="bg-neutral-800/30 rounded-2xl border border-neutral-700/50 p-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                    <Users className="text-green-400" size={20} />
                    Registered Teams ({registeredTeams.length})
                </h2>
                <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-green-500/20 text-green-300 border border-green-500/30 hover:bg-green-500/30 transition-colors">
                    <Download size={16} />
                    Export List
                </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {registeredTeams.map((team, i) => (
                    <div
                        key={i}
                        className="bg-neutral-700/20 rounded-xl p-4 border border-neutral-600/30"
                    >
                        <div className="flex justify-between items-start mb-2">
                            <h3 className="font-semibold">{team.name}</h3>
                            <span className="text-xs bg-neutral-600/50 px-2 py-1 rounded">
                                #{i + 1}
                            </span>
                        </div>
                        <div className="text-sm text-neutral-400">
                            <div>Captain: {team.captain}</div>
                            <div>Registered: {team.cr}</div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}