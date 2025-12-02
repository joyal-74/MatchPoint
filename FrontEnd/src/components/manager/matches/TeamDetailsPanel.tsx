import React from "react";
import { PlayerCard } from "./PlayerCard";
import type { Player, Team, TeamId } from "./matchTypes";
import { Play, Save, Settings } from "lucide-react";
import { ActionButton } from "./ActionButton";

interface TeamDetailsPanelProps {
    team: Team;
    team1: Team;
    team2: Team;
    activeTeamId: TeamId;
    handleTeamSwitch: (id: TeamId) => void;
}

export const TeamDetailsPanel: React.FC<TeamDetailsPanelProps> = React.memo(
    ({ team, team1, team2, activeTeamId, handleTeamSwitch }) => {

        const renderPlayerSection = (title: string, players: Player[]) => (
            <div className="mb-10">
                <h3 className="text-lg font-semibold text-neutral-200 mb-3">
                    {title}
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {players.map((p) => (
                        <PlayerCard key={p.id} player={p} />
                    ))}
                </div>
            </div>
        );

        const teams = [team1, team2];

        const handleSaveData = () => console.log('Saving match data...');
        const handleStartMatch = () => console.log('Starting the match...');
        const handleStreamSettings = () => console.log('Opening stream settings...');

        return (
            <div className="lg:flex-1 p-5 bg-neutral-900/40 backdrop-blur-md rounded-xl border border-neutral-700/30 shadow-lg">

                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-purple-300">
                        {team.name} – Team Details
                    </h2>

                    {/* Switch Tabs — Minimal pill design */}
                    <div className="flex bg-neutral-800/60 rounded-full p-1">
                        {teams.map((t) => (
                            <button
                                key={t.id}
                                onClick={() => handleTeamSwitch(t.id as TeamId)}
                                className={`px-4 py-2 text-sm rounded-full transition-all
                                    ${activeTeamId === t.id
                                        ? "bg-white text-neutral-900 shadow-sm"
                                        : "text-neutral-300 hover:bg-neutral-700"
                                    }`}
                            >
                                {t.name}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Content */}
                <div className="space-y-8">
                    {renderPlayerSection("Playing XI", team.playingXI)}
                    {renderPlayerSection("Substitutions", team.substitutions)}
                </div>

                <div className="mt-8 pt-6 border-t border-gray-700 flex flex-col sm:flex-row gap-4 justify-end">
                    <ActionButton icon={<Save size={20} />} label="Save Data" color="yellow" onClick={handleSaveData} />
                    <ActionButton icon={<Play size={20} />} label="Start Match" color="green" onClick={handleStartMatch} />
                    <ActionButton icon={<Settings size={20} />} label="Stream Settings" color="indigo" onClick={handleStreamSettings} />
                </div>
            </div>
        );
    }
);
