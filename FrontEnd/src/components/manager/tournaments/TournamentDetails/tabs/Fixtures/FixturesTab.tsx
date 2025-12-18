import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../../../../hooks/hooks";
import { toast } from 'react-hot-toast';
import LoadingOverlay from "../../../../../shared/LoadingOverlay";
import { Swords, Trophy, Calendar, MapPin, Sparkles, Settings2, Plus } from "lucide-react";
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
                .catch(() => setFixtures(null)); // Handle case where no fixtures exist
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
        if (!selectedTournament) return;

        let matches;
        try {
            switch (selectedTournament.format) {
                case "knockout":
                    matches = generateKnockoutFixtures(registeredTeams, confirmedSettings.location, confirmedSettings.startDate, confirmedSettings.matchesPerDay);
                    break;
                case "league":
                    matches = generateLeagueFixtures(registeredTeams, confirmedSettings.location, confirmedSettings.startDate, confirmedSettings.matchesPerDay);
                    break;
                case "friendly":
                    matches = generateFriendlyFixture(registeredTeams, confirmedSettings.location, confirmedSettings.startDate);
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
            }));

            toast.success("Fixtures generated successfully!");
            setFixtures({ matches, format: selectedTournament.format, tournamentId: selectedTournament._id });
            setShowConfirmModal(false);
        } catch (error) {
            console.error(error);
            toast.error("Failed to generate fixtures.");
        }
    };

    if (loading) return <LoadingOverlay show />;

    // ------------------------------------------------
    // STATE: No Fixtures Generated Yet
    // ------------------------------------------------
    if (!fixtures?.matches?.length) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[500px] animate-in fade-in zoom-in-95 duration-500">
                <div className="relative group max-w-lg w-full">
                    {/* Background glow effect */}
                    <div className="absolute -inset-1 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
                    
                    <div className="relative bg-neutral-900 ring-1 ring-white/10 rounded-2xl p-8 text-center space-y-6">
                        <div className="mx-auto w-20 h-20 rounded-full bg-emerald-500/10 flex items-center justify-center mb-6 border border-emerald-500/20">
                            <Swords size={40} className="text-emerald-500" />
                        </div>
                        
                        <div className="space-y-2">
                            <h2 className="text-2xl font-bold text-white">Tournament Fixtures</h2>
                            <p className="text-neutral-400 max-w-sm mx-auto">
                                The bracket is empty. Generate matches based on the {registeredTeams.length} registered teams to officially kick off the tournament.
                            </p>
                        </div>

                        {type === 'manage' ? (
                            <div className="pt-4">
                                <button
                                    onClick={handleOpenModal}
                                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white font-semibold shadow-lg shadow-emerald-900/20 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
                                >
                                    <Sparkles size={18} />
                                    Generate {selectedTournament?.format ? selectedTournament.format.charAt(0).toUpperCase() + selectedTournament.format.slice(1) : ''} Bracket
                                </button>
                                
                                <p className="text-xs text-neutral-500 mt-4 flex items-center justify-center gap-2">
                                    <Settings2 size={12} />
                                    You can customize dates & location before confirming
                                </p>

                                <ConfirmFixtureModal
                                    isOpen={showConfirmModal}
                                    onClose={() => setShowConfirmModal(false)}
                                    onConfirm={handleGenerateFixtures}
                                    settings={matchSettings}
                                    setSettings={setMatchSettings}
                                />
                            </div>
                        ) : (
                            <div className="pt-4 px-4 py-2 bg-neutral-800/50 rounded-lg inline-block border border-white/5">
                                <p className="text-sm text-neutral-400 italic">
                                    Waiting for tournament organizer to publish fixtures.
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Fixture Control Bar */}
            <div className=" border-b border-white/5 pb-4 mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                        <Trophy className="text-amber-500" size={20} />
                        {selectedTournament?.format === 'knockout' ? 'Tournament Bracket' : 'League Schedule'}
                    </h2>
                    <p className="text-sm text-neutral-500 flex items-center gap-4 mt-1">
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
                

                {type === 'manage' && (
                     <div className="flex gap-2">
                        <button className="px-4 py-2 text-xs font-medium bg-neutral-800 text-neutral-300 rounded-lg hover:bg-neutral-700 transition-colors border border-white/5">
                            Reset Fixtures
                        </button>
                        <button className="px-4 py-2 text-xs font-medium bg-emerald-600/10 text-emerald-400 rounded-lg hover:bg-emerald-600/20 transition-colors border border-emerald-500/20 flex items-center gap-2">
                            <Plus size={14} /> Add Match
                        </button>
                    </div>
                )}
            </div>

            {/* Render Specific View based on Format */}
            <div className="animate-in slide-in-from-bottom-4 duration-500 min-h-[500px]">
                {fixtures.format === "knockout" && <KnockoutFixtures matches={fixtures.matches} />}
                {fixtures.format === "league" && <LeagueFixtures matches={fixtures.matches} />}
                {fixtures.format === "friendly" && <FriendlyFixture matches={fixtures.matches} />}
                {!["knockout", "league", "friendly"].includes(fixtures.format) && (
                     <div className="text-center p-8 text-neutral-500">Invalid fixture format loaded.</div>
                )}
            </div>
        </div>
    );
}