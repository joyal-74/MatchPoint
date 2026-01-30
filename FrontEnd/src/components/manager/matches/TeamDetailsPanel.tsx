import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Play, Save, Settings, Users } from "lucide-react";
import toast from "react-hot-toast";
import { useAppDispatch } from "../../../hooks/hooks";
import { saveMatchData, startMatch } from "../../../features/manager/Matches/matchThunks";
import type { TeamId, TossDecision } from "./matchTypes";
import { PlayerCard } from "./PlayerCard";
import { ActionButton } from "./ActionButton";
import type { Player, Team } from "../../../domain/match/types";


interface TeamDetailsPanelProps {
    matchId: string;
    team: Team;
    team1: Team;
    team2: Team;
    activeTeamId: TeamId;
    handleTeamSwitch: (id: TeamId) => void;
    tossWinnerId: TeamId | null;
    tossDecision: TossDecision;
}

export const TeamDetailsPanel: React.FC<TeamDetailsPanelProps> = React.memo(
    ({ matchId, team, team1, team2, activeTeamId, handleTeamSwitch, tossWinnerId, tossDecision }) => {

        const [isSaved, setIsSaved] = useState(() => !!(tossWinnerId && tossDecision));
        const [isStarting, setIsStarting] = useState(false);
        const dispatch = useAppDispatch();
        const navigate = useNavigate();
        const teams = [team1, team2];
        const playingXI = team.members.filter((p: Player) => p.status === "playing");
        const substitutions = team.members.filter((p: Player) => p.status !== "playing");

        const handleSaveData = async () => {
            if (!tossWinnerId || !tossDecision) {
                toast.error("Please update toss details.");
                return;
            }
            const result = await dispatch(saveMatchData({ matchId, tossWinnerId, tossDecision }));
            if (saveMatchData.fulfilled.match(result)) {
                toast.success("Match data saved successfully");
            } else {
                toast.error("Failed to save match");
            }
            setIsSaved(true);
        };

        const handleStartMatch = async () => {
            if (!isSaved) {
                return toast.error("Please save toss data first.");
            }

            setIsStarting(true);

            try {
                // 1. Dispatch the Thunk to update DB
                await dispatch(startMatch(matchId)).unwrap();

                toast.success("Match Started Successfully!");

                // 2. Navigate ONLY after success
                navigate(`/manager/match/${matchId}/control`);

            } catch (error) {
                console.error(error);
                toast.error("Failed to start match. Try again.");
            } finally {
                setIsStarting(false);
            }
        };

        return (
            <div className="bg-card border border-border rounded-xl shadow-sm flex flex-col h-full overflow-hidden">

                {/* Panel Header & Team Switcher */}
                <div className="p-6 border-b border-border flex flex-col md:flex-row justify-between items-center gap-4 bg-background/50">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                            <Users size={20} />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-foreground leading-none">{team.name}</h2>
                            <p className="text-sm text-muted-foreground mt-1">Squad Management</p>
                        </div>
                    </div>

                    {/* Segmented Control */}
                    <div className="flex p-1 bg-muted rounded-lg w-full md:w-auto">
                        {teams.map((t) => (
                            <button
                                key={t._id}
                                onClick={() => handleTeamSwitch(t._id as TeamId)}
                                className={`flex-1 md:flex-none px-6 py-2 text-sm font-medium rounded-md transition-all duration-200
                                    ${activeTeamId === t._id
                                        ? "bg-background text-foreground shadow-sm ring-1 ring-border"
                                        : "text-muted-foreground hover:text-foreground"
                                    }`}
                            >
                                {t.name}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Scrollable Content */}
                <div className="flex-1 p-6 overflow-y-auto bg-muted/5 custom-scrollbar">
                    <div className="space-y-8">
                        <div>
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-md font-semibold text-foreground flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-green-500"></span> Playing XI
                                </h3>
                                <span className="text-xs font-mono bg-muted px-2 py-1 rounded text-muted-foreground">{playingXI.length} Players</span>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                                {playingXI.map((p) => <PlayerCard key={p._id} player={p} />)}
                            </div>
                        </div>

                        {substitutions.length > 0 && (
                            <div>
                                <h3 className="text-md font-semibold text-foreground mb-4 flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-yellow-500"></span> Bench
                                </h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                                    {substitutions.map((p) => <PlayerCard key={p._id} player={p} />)}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Footer Actions */}
                <div className="p-4 border-t border-border bg-background flex flex-wrap gap-3 justify-end items-center">
                    <ActionButton variant="secondary" icon={<Save size={18} />} label="Save Data" onClick={handleSaveData} />
                    <ActionButton variant="outline" icon={<Settings size={18} />} label={"Stream settings"} onClick={() => navigate(`/manager/match/${matchId}/stream`)}  />
                    <ActionButton variant="primary" icon={<Play size={18} />} label={isStarting ? "Starting..." : "Start Match"} onClick={handleStartMatch} disabled={!isSaved}  />
                </div>
            </div>
        );
    }
);