import { useState } from "react";
import type { Match } from "../../../../../../../features/manager/managerTypes";
import MatchCard from "../shared/MatchCard";
import MatchDetailsModal from "../shared/MatchDetailsModal";

export default function KnockoutFixtures({ matches }: { matches: Match[] }) {
    const rounds = Math.max(...matches.map(m => m.round));

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
            <div className="flex gap-4 overflow-x-auto pb-4">
                {[...Array(rounds)].map((_, i) => {
                    const roundMatches = matches.filter(m => m.round === i + 1);
                    return (
                        <div key={i} className="min-w-[240px]">
                            <h4 className="text-sm font-semibold text-neutral-400 mb-2">Round {i + 1}</h4>
                            <div className="space-y-3">
                                {roundMatches.map((match, idx) => (
                                    <div key={idx} onClick={() => openModal(match)}>
                                        <MatchCard match={match} />
                                    </div>
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Modal */}
            <MatchDetailsModal match={selectedMatch} isOpen={isModalOpen} onClose={closeModal} />
        </>
    );
}
