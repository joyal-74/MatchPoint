import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../../../../hooks/hooks";
import { toast } from 'react-hot-toast';
import LoadingOverlay from "../../../../../shared/LoadingOverlay";
import { Trophy, Calendar, MapPin, Sparkles, Clock } from "lucide-react";
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
                .catch(() => setFixtures(null));
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
            return toast.error("At least 2 teams are required to generate fixtures.");
        }
        setShowConfirmModal(true);
    };

    const handleGenerateFixtures = async (confirmedSettings: typeof matchSettings) => {
        if (!selectedTournament || !id) return;

        let matches;
        try {
            switch (selectedTournament.format) {
                case "knockout":
                    matches = generateKnockoutFixtures(registeredTeams, selectedTournament.umpireId, confirmedSettings.location, confirmedSettings.startDate, confirmedSettings.matchesPerDay);
                    break;
                case "league":
                    matches = generateLeagueFixtures(registeredTeams, selectedTournament.umpireId, confirmedSettings.location, confirmedSettings.startDate, confirmedSettings.matchesPerDay);
                    break;
                case "friendly":
                    matches = generateFriendlyFixture(registeredTeams, selectedTournament.umpireId, confirmedSettings.location, confirmedSettings.startDate);
                    break;
                default:
                    return toast.error("Unknown tournament format");
            }

            const createdMatches = await dispatch(createTournamentMatches({
                tournamentId: selectedTournament._id,
                matchesData: matches,
            })).unwrap();

            const fixtureMatches = createdMatches.map((m) => ({
                matchId: m._id,
                round: m.round,
            }));

            await dispatch(createTournamentFixtures({
                tournamentId: selectedTournament._id,
                matchIds: fixtureMatches,
                format: selectedTournament.format,
            })).unwrap();

            toast.success("Fixtures generated successfully!");
            setShowConfirmModal(false);

            const freshFixtures = await dispatch(getTournamentFixtures(id)).unwrap();
            setFixtures(freshFixtures);

        } catch (error) {
            console.error(error);
            toast.error("Failed to generate fixtures.");
        }
    };

    if (loading) return <LoadingOverlay show />;

    // --- EMPTY STATE DESIGN ---
    if (!fixtures?.matches?.length) {
        return (
            <div className="w-full flex flex-col items-center justify-center p-8 md:p-12 animate-in fade-in duration-500 bg-muted/10 border border-dashed border-border rounded-xl">

                {/* Icon Circle */}
                <div className="bg-background p-4 rounded-full shadow-sm mb-4 ring-1 ring-border/50">
                    <Trophy className="w-8 h-8 text-muted-foreground" strokeWidth={1.5} />
                </div>

                {/* Text Content */}
                <div className="text-center space-y-2 max-w-md">
                    <h3 className="text-lg font-semibold text-foreground">
                        {type === 'manage' ? "No Matches Scheduled" : "Schedule Pending"}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                        {type === 'manage'
                            ? "Generate the official match schedule to launch the tournament."
                            : "The organizer hasn't published the match schedule yet."
                        }
                    </p>
                </div>

                {/* Action Area */}
                <div className="mt-6">
                    {type === 'manage' ? (
                        <div className="flex flex-col items-center gap-3">
                            <button
                                onClick={handleOpenModal}
                                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium shadow hover:bg-primary/90 transition-all"
                            >
                                <Sparkles size={16} />
                                <span>Generate {selectedTournament?.format ? selectedTournament.format.charAt(0).toUpperCase() + selectedTournament.format.slice(1) : ''} Fixtures</span>
                            </button>

                            <ConfirmFixtureModal
                                isOpen={showConfirmModal}
                                onClose={() => setShowConfirmModal(false)}
                                onConfirm={handleGenerateFixtures}
                                settings={matchSettings}
                                setSettings={setMatchSettings}
                            />
                        </div>
                    ) : (
                        <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-background border border-border text-xs text-muted-foreground">
                            <Clock size={14} />
                            <span>Check back later</span>
                        </div>
                    )}
                </div>
            </div>
        );
    }

    // --- POPULATED STATE DESIGN ---
    return (
        <div className="space-y-6">
            {/* Fixture Control Bar */}
            <div className="border-b border-border pb-4 mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
                        <Trophy className="text-primary" size={20} /> Tournament Fixtures
                    </h2>
                    <p className="text-sm text-muted-foreground flex items-center gap-4 mt-1">
                        <span className="flex items-center gap-1.5">
                            <Calendar size={14} />
                            {fixtures.matches.length} Matches
                        </span>
                        <span className="flex items-center gap-1.5">
                            <MapPin size={14} />
                            {matchSettings.location || 'Main Venue'}
                        </span>
                    </p>
                </div>
            </div>

            {/* Render Specific View based on Format */}
            <div className="animate-in slide-in-from-bottom-4 duration-500 min-h-[500px]">
                {fixtures.format === "knockout" && <KnockoutFixtures matches={fixtures.matches} />}
                {fixtures.format === "league" && <LeagueFixtures matches={fixtures.matches} />}
                {fixtures.format === "friendly" && <FriendlyFixture matches={fixtures.matches} />}
                {!["knockout", "league", "friendly"].includes(fixtures.format) && (
                    <div className="text-center p-8 text-muted-foreground bg-muted/20 rounded-xl border border-dashed border-border">
                        Invalid fixture format loaded.
                    </div>
                )}
            </div>
        </div>
    );
}