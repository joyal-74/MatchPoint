import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../../../../hooks/hooks";
import { toast } from 'react-hot-toast';
import LoadingOverlay from "../../../../../shared/LoadingOverlay";
import EmptyState from "../../shared/EmptyState";
import { Swords } from "lucide-react";

import {
    generateKnockoutFixtures,
    generateLeagueFixtures,
    generateFriendlyFixture,
} from "./utils/fixtureGenerators";
import {
    createTournamentFixtures,
    createTournamentMatches,
    getTournamentFixtures,
} from "../../../../../../features/manager/Tournaments/tournamentThunks";
import KnockoutFixtures from "./viewes/KnockoutFixtures";
import LeagueFixtures from "./viewes/LeagueFixtures";
import FriendlyFixture from "./viewes/FriendlyFixture";
import ConfirmFixtureModal from "./ConfirmFixtureModal";
import type { Fixture } from "../../../../../../features/manager/managerTypes";

type FixtureTabProp = {
    type: 'explore' | 'manage'
}

export default function FixturesTab({ type }: FixtureTabProp) {
    const { id } = useParams();
    const dispatch = useAppDispatch();
    const { selectedTournament, loading, registeredTeams } = useAppSelector(
        (state) => state.managerTournaments
    );
    const [fixtures, setFixtures] = useState<Fixture | null>(null);
    const [showConfirmModal, setShowConfirmModal] = useState(false);

    const [matchSettings, setMatchSettings] = useState<{
        matchesPerDay: number;
        startDate: string | Date;
        location: string;
    }>({
        matchesPerDay: 2,
        startDate: "",
        location: "",
    });

    // Load existing fixtures
    useEffect(() => {
        if (id && selectedTournament && (!fixtures)) {
            dispatch(getTournamentFixtures(id))
                .unwrap()
                .then(setFixtures)
        }
    }, [id, selectedTournament, dispatch, fixtures]);


    // Initialize default settings
    useEffect(() => {
        if (selectedTournament) {
            setMatchSettings({
                matchesPerDay: 2,
                startDate: selectedTournament.startDate || "",
                location: selectedTournament.location || "",
            });
        }
    }, [selectedTournament]);

    const handleOpenModal = () => {
        if (!selectedTournament || registeredTeams.length < 2) {
            return toast("At least 2 teams are required to generate fixtures.");
        }
        setShowConfirmModal(true);
    };

    // Step 2: Generate fixtures after confirmation
    const handleGenerateFixtures = async (confirmedSettings: typeof matchSettings) => {
        if (!selectedTournament) return;

        let matches;

        switch (selectedTournament.format) {
            case "knockout":
                matches = generateKnockoutFixtures(
                    registeredTeams,
                    confirmedSettings.location,
                    confirmedSettings.startDate,
                    confirmedSettings.matchesPerDay
                );
                break;
            case "league":
                matches = generateLeagueFixtures(
                    registeredTeams,
                    confirmedSettings.location,
                    confirmedSettings.startDate,
                    confirmedSettings.matchesPerDay
                );
                break;
            case "friendly":
                matches = generateFriendlyFixture(
                    registeredTeams,
                    confirmedSettings.location,
                    confirmedSettings.startDate
                );
                break;
            default:
                return toast.error("Unknown tournament format");
        }

        const createdMatches = await dispatch(
            createTournamentMatches({
                tournamentId: selectedTournament._id,
                matchesData: matches,
            })
        ).unwrap();

        const fixtureMatches = createdMatches.map((m) => ({
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
        setFixtures({ matches, format: selectedTournament.format, tournamentId: selectedTournament._id });
        setShowConfirmModal(false);
    };

    // Step 3: Conditional render
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

                {type === 'manage' && (
                    <>
                        <button
                            onClick={handleOpenModal}
                            className="mt-6 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg text-sm"
                        >
                            Generate Fixtures
                        </button>

                        <ConfirmFixtureModal
                            isOpen={showConfirmModal}
                            onClose={() => setShowConfirmModal(false)}
                            onConfirm={handleGenerateFixtures}
                            settings={matchSettings}
                            setSettings={setMatchSettings}
                        />
                    </>
                )}

            </div>
        );

    switch (fixtures.format) {
        case "knockout":
            return <KnockoutFixtures matches={fixtures.matches} />;
        case "league":
            return <LeagueFixtures matches={fixtures.matches} />;
        case "friendly":
            return <FriendlyFixture matches={fixtures.matches} />;
        default:
            return (
                <EmptyState icon={<Swords size={48} />} title="Invalid format" message="" subtitle="" />
            );
    }
}