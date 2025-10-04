/* eslint-disable @typescript-eslint/no-explicit-any */
import { Trophy, Calendar, MapPin } from "lucide-react";
import DetailRow from "../shared/DetailRow";
import TournamentStats from "../shared/TournamentStats";
import type { Tournament } from "../../../../../features/manager/managerTypes";

interface InfoTabProps {
    tournamentData: Tournament;
    registeredTeams: any;
}

export default function InfoTab({ tournamentData }: InfoTabProps) {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">

                <div className="bg-neutral-800/30 backdrop-blur-sm rounded-2xl border border-neutral-700/50 p-6">
                    <h2 className="text-xl font-semibold mb-4">Description</h2>
                    <p className="text-neutral-300 leading-relaxed">
                        {tournamentData.description}
                    </p>
                </div>

                {/* Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-neutral-800/30 rounded-2xl border border-neutral-700/50 p-6">
                        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                            <Trophy className="text-amber-400" size={20} />
                            Tournament Information
                        </h2>
                        <div className="space-y-4">
                            <DetailRow label="Format" value={tournamentData.format} />
                            <DetailRow
                                label="Entry Fee"
                                value={tournamentData.entryFee}
                                highlight="text-green-400"
                            />
                            <DetailRow
                                label="Price Pool"
                                value={tournamentData.prizePool}
                                highlight="text-amber-400"
                            />
                        </div>
                    </div>

                    <div className="bg-neutral-800/30 rounded-2xl border border-neutral-700/50 p-6">
                        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                            <Calendar className="text-blue-400" size={20} />
                            Schedule & Venue
                        </h2>
                        <div className="space-y-4">
                            <DetailRow
                                label="Registration Deadline"
                                value={new Date(tournamentData.endDate).toLocaleDateString()}
                            />
                            <DetailRow
                                label="Location"
                                value={tournamentData.location}
                                icon={<MapPin size={18} className="text-purple-400" />}
                            />
                        </div>
                    </div>
                </div>

                {/* Rules */}
                <div className="bg-neutral-800/30 rounded-2xl border border-neutral-700/50 p-6">
                    <h2 className="text-xl font-semibold mb-4">Rules & Regulations</h2>
                    <ul className="space-y-2">
                        {tournamentData.rules.map((rule: string, i: number) => (
                            <li key={i} className="flex items-start gap-3 text-neutral-300">
                                <span className="text-green-400 mt-1">•</span>
                                {rule}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            {/* Stats */}
            <TournamentStats tournamentData={tournamentData} />
        </div>
    );
}