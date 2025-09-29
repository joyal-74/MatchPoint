import { useState } from "react";
import TeamCard from "../../components/manager/teams/TeamCard";
import CreateTeamModal from "../../components/manager/teams/CreateTeamModal";
import ManagerLayout from "../layout/ManagerLayout";

export interface Team {
    id: number;
    name: string;
    sport: string;
    members: string;
    created: string;
    status: "Active" | "Inactive";
    color: string;
}

export interface CreateTeamData {
    name: string;
    sport: string;
}

export default function TeamsListPage() {
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [teams, setTeams] = useState<Team[]>([
        {
            id: 1,
            name: "Thunder Strikers",
            sport: "Cricket",
            members: "12/15 Players",
            created: "15 January 2024",
            status: "Active",
            color: "bg-green-700"
        },
        {
            id: 2,
            name: "Dragon Warriors",
            sport: "Football",
            members: "18/20 Players",
            created: "22 February 2024",
            status: "Active",
            color: "bg-red-700"
        },
        {
            id: 3,
            name: "Night Hawks",
            sport: "Basketball",
            members: "10/12 Players",
            created: "10 March 2024",
            status: "Inactive",
            color: "bg-purple-700"
        }
    ]);

    const handleDeleteTeam = (teamId: number): void => {
        setTeams(teams.filter(team => team.id !== teamId));
    };

    const handleEditTeam = (teamId: number): void => {
        // Handle edit team logic here
        console.log("Edit team:", teamId);
    };

    const handleManageMembers = (teamId: number): void => {
        // Handle manage members logic here
        console.log("Manage members for team:", teamId);
    };

    const handleCreateTeam = (newTeamData: CreateTeamData): void => {
        const newTeam: Team = {
            ...newTeamData,
            id: Math.max(0, ...teams.map(team => team.id)) + 1,
            members: "0/15 Players",
            created: new Date().toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            }),
            status: "Active",
            color: `bg-${['blue', 'green', 'red', 'purple', 'indigo'][Math.floor(Math.random() * 5)]}-700`
        };
        setTeams([...teams, newTeam]);
    };

    return (
        <>
            <ManagerLayout>
                <div className="text-white mt-8">
                    {/* Header Section */}
                    <div className="flex justify-between items-center mb-8 p-6 rounded-2xl bg-gradient-to-r from-neutral-800/50 to-neutral-900/30 border border-neutral-700/50">
                        <div>
                            <h1 className="text-2xl font-bold mb-2">Create & Manage Teams</h1>
                            <p className="text-neutral-400">Organize your teams & join tournaments</p>
                        </div>
                        <button
                            className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 px-6 py-3 rounded-lg font-medium transition-all duration-300 transform hover:scale-105 shadow-lg"
                            onClick={() => setIsModalOpen(true)}
                        >
                            Create Team +
                        </button>
                    </div>

                    {/* My Teams Section */}
                    <section className="mb-12">
                        <div className="flex justify-between items-center mb-6">
                            <div>
                                <h2 className="text-xl font-semibold mb-2">My Teams</h2>
                                <p className="text-neutral-400">{teams.length} teams created</p>
                            </div>
                            <button className="text-green-400 hover:text-green-300 px-4 py-2 rounded-lg font-medium text-sm transition-all duration-300 border border-green-400/20 hover:border-green-400/40 bg-green-400/5 hover:bg-green-400/10">
                                View All →
                            </button>
                        </div>

                        {teams.length === 0 ? (
                            <div className="text-center py-12">
                                <div className="text-neutral-500 text-lg mb-4">
                                    No teams created yet
                                </div>
                                <button
                                    className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 px-6 py-3 rounded-lg font-medium transition-all duration-300"
                                    onClick={() => setIsModalOpen(true)}
                                >
                                    Create Your First Team
                                </button>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {teams.map((team) => (
                                    <TeamCard
                                        key={team.id}
                                        id={team.id}
                                        name={team.name}
                                        sport={team.sport}
                                        members={team.members}
                                        created={team.created}
                                        status={team.status}
                                        color={team.color}
                                        onEdit={handleEditTeam}
                                        onDelete={handleDeleteTeam}
                                        onManageMembers={handleManageMembers}
                                    />
                                ))}
                            </div>
                        )}
                    </section>

                    <CreateTeamModal
                        isOpen={isModalOpen}
                        onClose={() => setIsModalOpen(false)}
                        onCreateTeam={handleCreateTeam}
                    />
                </div>
            </ManagerLayout>
        </>
    );
}