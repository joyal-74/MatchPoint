import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../../../../hooks/hooks";
import { toast } from "react-toastify";
import LoadingOverlay from "../../../../../shared/LoadingOverlay";
import EmptyState from "../../shared/EmptyState";
import { Swords } from "lucide-react";

import { generateKnockoutFixtures, generateLeagueFixtures, generateFriendlyFixture } from "./utils/fixtureGenerators";
import { createTournamentFixtures, createTournamentMatches, getTournamentFixtures } from "../../../../../../features/manager/Tournaments/tournamentThunks";
import KnockoutFixtures from "./viewes/KnockoutFixtures";
import LeagueFixtures from "./viewes/LeagueFixtures";
import FriendlyFixture from "./viewes/FriendlyFixture";

export default function FixturesTab() {
    const { id } = useParams();
    const dispatch = useAppDispatch();
    const { selectedTournament, loading } = useAppSelector(state => state.managerTournaments);
    const { registeredTeams } = useAppSelector(state => state.managerTournaments);
    const [fixtures, setFixtures] = useState<any>(null);

    useEffect(() => {
        if (id && selectedTournament) {
            dispatch(getTournamentFixtures(id))
                .unwrap()
                .then(setFixtures)
                .catch(() => toast.error("Failed to load fixtures"));
        }
    }, [id, selectedTournament, dispatch]);

    const handleGenerateFixtures = async () => {
        if (!selectedTournament || registeredTeams.length < 2) {
            return toast.warn("At least 2 teams are required to generate fixtures.");
        }

        let matches;
        switch (selectedTournament.format) {
            case "knockout":
                matches = generateKnockoutFixtures(registeredTeams);
                break;
            case "league":
                matches = generateLeagueFixtures(registeredTeams);
                break;
            case "friendly":
                matches = generateFriendlyFixture(registeredTeams);
                break;
            default:
                return toast.error("Unknown tournament format");
        }

        console.log(matches, "matches")

        const createdMatches = await dispatch(
            createTournamentMatches({ tournamentId: selectedTournament._id, matchesData: matches })
        ).unwrap();

        console.log(createdMatches, "createdMatches")

        const fixtureMatches = createdMatches.map(m => ({
            matchId: m._id,
            round: m.round,
        }));

        await dispatch(
            createTournamentFixtures({
                tournamentId: selectedTournament._id,
                matchIds: fixtureMatches,
                format: selectedTournament.format,
            })
        );

        toast.success("Fixtures generated successfully!");
        setFixtures({ matches, format: selectedTournament.format });
    };

    if (loading) return <LoadingOverlay show />;

    if (!fixtures?.matches?.length)
        return (
            <div className="flex flex-col items-center justify-center py-20">
                <EmptyState
                    icon={<Swords size={48} className="mx-auto mb-4 text-green-400" />}
                    title="No Fixtures Yet"
                    subtitle="Generate fixtures to start the tournament"
                    message=""
                />
                <button
                    onClick={handleGenerateFixtures}
                    className="mt-6 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg text-sm"
                >
                    Generate Fixtures
                </button>
            </div>
        );

    switch (fixtures.format) {
        case "knockout":
            return <KnockoutFixtures matches={fixtures.matches} teams={registeredTeams} />;
        case "league":
            return <LeagueFixtures matches={fixtures.matches} teams={registeredTeams} />;
        case "friendly":
            return <FriendlyFixture matches={fixtures.matches} teams={registeredTeams} />;
        default:
            return <EmptyState icon={<Swords size={48} />} title="Invalid format" />;
    }
}
