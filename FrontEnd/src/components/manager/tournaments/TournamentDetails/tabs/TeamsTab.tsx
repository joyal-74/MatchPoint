import { useState } from "react";
import { Users } from "lucide-react";
import type { RegisteredTeam } from "./TabContent";
import TeamDetailsModal from "./TeamDetailsModal";

interface TeamsTabProps {
    registeredTeams: RegisteredTeam[];
}

export default function TeamsTab({ registeredTeams }: TeamsTabProps) {
    const [selectedTeam, setSelectedTeam] = useState<RegisteredTeam | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const openModal = (team: RegisteredTeam) => {
        setSelectedTeam(team);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setSelectedTeam(null);
        setIsModalOpen(false);
    };

    return (
        <div className="bg-neutral-800/30 rounded-2xl border border-neutral-700/50 p-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                    <Users className="text-green-400" size={20} />
                    Registered Teams ({registeredTeams.length})
                </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {registeredTeams.map((team, i) => (
                    <div
                        key={i}
                        className="bg-neutral-700/20 rounded-xl p-4 border border-neutral-600/30 cursor-pointer hover:bg-neutral-700/30 transition"
                        onClick={() => openModal(team)}
                    >
                        <div className="flex justify-between items-start mb-2">
                            <h3 className="font-semibold">{team.name}</h3>
                            <span className="text-xs bg-neutral-600/50 px-2 py-1 rounded">
                                #{i + 1}
                            </span>
                        </div>
                        <div className="text-sm text-neutral-400">
                            <div>Captain: {team.captain}</div>
                            <div>Registered: {new Date(team.createdAt).toLocaleDateString()}</div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Modal */}
            <TeamDetailsModal
                team={selectedTeam}
                isOpen={isModalOpen}
                onClose={closeModal}
            />
        </div>
    );
}
