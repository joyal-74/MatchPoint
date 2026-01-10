import { useState } from "react";
import type { Match } from "../../../../../../../features/manager/managerTypes";
import MatchCard from "../shared/MatchCard";
import MatchDetailsModal from "../shared/MatchDetailsModal";
import { Trophy } from "lucide-react";

export default function KnockoutFixtures({ matches }: { matches: Match[] }) {
    const rounds = matches.length > 0 ? Math.max(...matches.map(m => m.round)) : 0;

    const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const openModal = (match: Match) => {
        setSelectedMatch(match);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setSelectedMatch(null);
        setIsModalOpen(false);
    };

    return (
        <>
            <div className="flex gap-6 overflow-x-auto pb-6 pt-2 px-1 snap-x scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent">
                {[...Array(rounds)].map((_, i) => {
                    const roundNum = i + 1;
                    const roundMatches = matches.filter(m => m.round === roundNum);
                    const isFinal = roundNum === rounds && rounds > 1;

                    return (
                        <div key={i} className="min-w-[300px] snap-start flex flex-col">
                            {/* Round Header */}
                            <div className="mb-4 flex items-center justify-between px-1 border-b border-border pb-2">
                                <h4 className={`text-sm font-bold uppercase tracking-wider ${isFinal ? 'text-primary' : 'text-muted-foreground'}`}>
                                    {isFinal ? 'Grand Final' : `Round ${roundNum}`}
                                </h4>
                                {isFinal && <Trophy size={14} className="text-primary" />}
                            </div>

                            {/* Matches Column */}
                            <div className={`space-y-4 flex-1 flex flex-col ${isFinal ? 'justify-center' : 'justify-start'}`}>
                                {roundMatches.map((match, idx) => (
                                    <div 
                                        key={idx} 
                                        onClick={() => openModal(match)}
                                        className="cursor-pointer transition-transform duration-200 hover:scale-[1.02]"
                                    >
                                        <MatchCard match={match} />
                                    </div>
                                ))}
                            </div>
                        </div>
                    );
                })}
                
                {matches.length === 0 && (
                    <div className="w-full text-center py-10 text-muted-foreground">
                        No matches generated yet.
                    </div>
                )}
            </div>

            <MatchDetailsModal match={selectedMatch} isOpen={isModalOpen} onClose={closeModal} />
        </>
    );
}