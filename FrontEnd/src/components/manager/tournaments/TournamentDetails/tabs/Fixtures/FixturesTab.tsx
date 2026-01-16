import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../../../../hooks/hooks";
import { toast } from 'react-hot-toast';
import LoadingOverlay from "../../../../../shared/LoadingOverlay";
import { 
    Swords, Trophy, Calendar, MapPin, Sparkles, 
    Settings2, Plus, Clock, AlertCircle 
} from "lucide-react";
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
            <div className="relative w-full min-h-[600px] flex flex-col items-center justify-center p-6 animate-in fade-in duration-700">
                
                {/* 1. Cinematic Background Elements */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none select-none">
                    {/* Giant blurred icon in background */}
                    <Swords 
                        strokeWidth={0.5} 
                        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] text-foreground/5 dark:text-foreground/5 rotate-12" 
                    />
                    {/* Gradient blob for depth */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[100px]" />
                </div>

                {/* 2. Main Content Wrapper */}
                <div className="relative z-10 flex flex-col items-center max-w-2xl w-full text-center space-y-8">
                    
                    {/* Header Text */}
                    <div className="space-y-4">
                        <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-background/50 backdrop-blur-sm border border-border shadow-sm mb-2">
                            <Trophy size={32} className="text-primary" />
                        </div>
                        <h2 className="text-3xl md:text-4xl font-black tracking-tight text-foreground">
                            {type === 'manage' ? "Ready to Kick Off?" : "Schedule Pending"}
                        </h2>
                        <p className="text-muted-foreground text-lg max-w-lg mx-auto leading-relaxed">
                            {type === 'manage' 
                                ? "The teams are registered and the stage is set. Generate the official match schedule to launch the tournament."
                                : "The tournament organizer hasn't published the official match schedule yet. Please check back soon."
                            }
                        </p>
                    </div>



                    {/* Action Area */}
                    {type === 'manage' ? (
                        <div className="flex flex-col items-center gap-4 w-full pt-4">
                            <button
                                onClick={handleOpenModal}
                                className="group relative w-full sm:w-auto px-8 py-4 rounded-xl bg-primary text-primary-foreground font-bold text-base shadow-xl shadow-primary/20 hover:shadow-primary/30 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 flex items-center justify-center gap-3"
                            >
                                <Sparkles size={20} className="group-hover:animate-pulse" />
                                <span>Generate {selectedTournament?.format ? selectedTournament.format.charAt(0).toUpperCase() + selectedTournament.format.slice(1) : ''} Fixtures</span>
                            </button>
                            
                            <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground bg-background/50 px-4 py-2 rounded-full border border-border/50">
                                <Settings2 size={12} />
                                <span>You can customize dates & rules in the next step</span>
                            </div>

                            <ConfirmFixtureModal
                                isOpen={showConfirmModal}
                                onClose={() => setShowConfirmModal(false)}
                                onConfirm={handleGenerateFixtures}
                                settings={matchSettings}
                                setSettings={setMatchSettings}
                            />
                        </div>
                    ) : (
                        <div className="flex items-center gap-2 px-5 py-3 rounded-full bg-muted/30 border border-border/50 text-sm text-muted-foreground">
                            <Clock size={16} />
                            <span>Waiting for updates...</span>
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
                        <Trophy className="text-primary" size={20} />
                        {selectedTournament?.format === 'knockout' ? 'Tournament Bracket' : 'League Schedule'}
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
                

                {type === 'manage' && (
                     <div className="flex gap-2">
                        <button className="px-4 py-2 text-xs font-medium bg-background hover:bg-muted text-muted-foreground hover:text-foreground rounded-lg transition-colors border border-border flex items-center gap-2">
                            <AlertCircle size={14} /> Reset
                        </button>
                        <button className="px-4 py-2 text-xs font-bold bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-colors border border-primary/20 flex items-center gap-2">
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
                     <div className="text-center p-8 text-muted-foreground bg-muted/20 rounded-xl border border-dashed border-border">
                        Invalid fixture format loaded.
                    </div>
                )}
            </div>
        </div>
    );
}