import { useState, type FormEvent } from "react";
import { X, Users, Trophy, Info, User } from "lucide-react";

export interface CreateTeamModalProps {
    isOpen: boolean;
    onClose: () => void;
    onCreateTeam: (teamData: CreateTeamData) => void;
}

export interface CreateTeamData {
    name: string;
    sport: string;
    info: string;
    maxPlayers: string;
}

export default function CreateTeamModal({
    isOpen,
    onClose,
    onCreateTeam,
}: CreateTeamModalProps) {
    const [teamName, setTeamName] = useState<string>("");
    const [sport, setSport] = useState<string>("Cricket");
    const [info, setInfo] = useState<string>("");
    const [maxPlayers, setMaxPlayers] = useState<string>("");

    const handleSubmit = (e: FormEvent<HTMLFormElement>): void => {
        e.preventDefault();
        if (teamName.trim()) {
            onCreateTeam({
                name: teamName,
                sport: sport,
                info: info,
                maxPlayers: maxPlayers,
            });
            setTeamName("");
            setSport("Cricket");
            setInfo("");
            setMaxPlayers("");
            onClose();
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative w-full max-w-xl max-h-[90vh] overflow-y-auto scrollbar-hide">
                <div className="bg-gradient-to-br from-neutral-900/90 to-neutral-800/80 backdrop-blur-xl rounded-2xl border border-neutral-700/50 shadow-2xl">
                    {/* Header */}
                    <div className="p-6 border-b border-neutral-700/50">
                        <div className="flex items-center justify-between">
                            <div>
                                <h2 className="text-2xl font-bold bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent">
                                    Create New Team
                                </h2>
                                <p className="text-neutral-400 mt-1">
                                    Fill in the details to create a new team
                                </p>
                            </div>
                            <button
                                onClick={onClose}
                                className="p-2 rounded-lg bg-neutral-700/50 hover:bg-neutral-600/50 transition-colors duration-200"
                            >
                                <X size={20} className="text-neutral-400" />
                            </button>
                        </div>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="p-6 space-y-6">
                        <div className="space-y-6">
                            {/* Team Name */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-neutral-300 flex items-center gap-2">
                                    <Trophy size={15} className="text-green-400" />
                                    Team Name
                                </label>
                                <input
                                    type="text"
                                    value={teamName}
                                    onChange={(e) => setTeamName(e.target.value)}
                                    placeholder="Enter team name"
                                    className="w-full px-4 py-2.5 bg-neutral-800/50 border border-neutral-700/50 rounded-lg text-white placeholder-neutral-400 
                                    focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-transparent backdrop-blur-sm transition-all duration-200"
                                    required
                                />
                            </div>

                            {/* Sport */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-neutral-300 flex items-center gap-2">
                                    <Users size={15} className="text-blue-400" />
                                    Select Sport
                                </label>
                                <select
                                    value={sport}
                                    onChange={(e) => setSport(e.target.value)}
                                    className="w-full px-4 py-2.5 bg-neutral-800/50 border border-neutral-700/50 rounded-lg text-white
                                    focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-transparent backdrop-blur-sm transition-all duration-200"
                                >
                                    <option value="Cricket">Cricket</option>
                                    <option value="Football">Football</option>
                                    <option value="Basketball">Basketball</option>
                                    <option value="Volleyball">Volleyball</option>
                                    <option value="Hockey">Hockey</option>
                                </select>
                            </div>

                            {/* Max Participants */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-neutral-300 flex items-center gap-2">
                                    <User size={15} className="text-purple-400" />
                                    Max Participants
                                </label>
                                <input
                                    type="number"
                                    value={maxPlayers}
                                    onChange={(e) => setMaxPlayers(e.target.value)}
                                    placeholder="Enter maximum number"
                                    className="w-full px-4 py-2.5 bg-neutral-800/50 border border-neutral-700/50 rounded-lg text-white placeholder-neutral-400 
                                    focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-transparent backdrop-blur-sm transition-all duration-200"
                                    min="2"
                                    required
                                />
                            </div>

                            {/* Additional Info */}
                            <div className="space-y-2 md:col-span-2">
                                <label className="text-sm font-medium text-neutral-300 flex items-center gap-2">
                                    <Info size={15} className="text-yellow-400" />
                                    Additional Information
                                </label>
                                <textarea
                                    value={info}
                                    onChange={(e) => setInfo(e.target.value)}
                                    placeholder="Enter additional details"
                                    rows={3}
                                    className="w-full px-4 py-2.5 bg-neutral-800/50 border border-neutral-700/50 rounded-lg text-white placeholder-neutral-400 
                                    focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-transparent backdrop-blur-sm transition-all duration-200 resize-none"
                                />
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex justify-end gap-2 pt-4">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-5 py-2.5 bg-neutral-700/50 hover:bg-neutral-600/50 text-white rounded-lg font-medium transition-all duration-200 border border-neutral-600/50 hover:border-neutral-500/50"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="px-5 py-2.5 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-lg font-medium transition-all duration-200 transform hover:scale-105 shadow-lg"
                            >
                                Create Team
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
