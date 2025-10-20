import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../../../../hooks/hooks";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { shuffleTeams } from "../../../../../utils/helpers/TeamSuffler";
import LoadingOverlay from "../../../../shared/LoadingOverlay";
import { AlertTriangle, PlusCircle } from "lucide-react";
import { createTournamentFixtures, getTournamentFixtures } from "../../../../../features/manager/Tournaments/tournamentThunks";
import type { RegisteredTeam } from "./TabContent";
import type { Match } from "../../../../../features/manager/managerTypes";

interface FixturesTabProps {
    type: "manage" | "explore";
}


// Custom Bracket Components
const KnockoutBracket = ({ matches, getTeamName }: { matches: Match[], getTeamName: (id?: string) => string }) => {
    const rounds = [...new Set(matches.map(m => m.round || 1))].sort((a, b) => a - b);

    return (
        <div className="bracket-tree flex gap-8 overflow-x-auto py-4 px-2">
            {rounds.map(round => {
                const roundMatches = matches.filter(match => (match.round || 1) === round);

                return (
                    <div key={round} className="bracket-round flex flex-col gap-6 min-w-64">
                        <h3 className="round-title text-center font-bold text-white mb-4 text-lg">
                            Round {round}
                        </h3>
                        <div className="matches-container flex flex-col gap-6">
                            {roundMatches.map((match, index) => (
                                <BracketMatch
                                    key={`match-${match.matchNumber}-${index}`}
                                    match={match}
                                    getTeamName={getTeamName}
                                    isLastRound={round === Math.max(...rounds)}
                                />
                            ))}
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

const BracketMatch = ({
    match,
    getTeamName,
    isLastRound
}: {
    match: Match;
    getTeamName: (id?: string) => string;
    isLastRound: boolean;
}) => {
    return (
        <div className="match-wrapper relative">
            <div className={`match-card bg-neutral-800 border rounded-lg p-4 min-w-60 ${match.status === 'completed' ? 'border-green-500/50' :
                    match.status === 'ongoing' ? 'border-yellow-500/50' :
                        'border-neutral-600'
                }`}>
                <div className="match-header flex justify-between items-center mb-3">
                    <span className="text-sm text-neutral-400">Match {match.matchNumber}</span>
                    <span className={`text-xs px-2 py-1 rounded-full ${match.status === 'completed' ? 'bg-green-500/20 text-green-300' :
                            match.status === 'ongoing' ? 'bg-yellow-500/20 text-yellow-300' :
                                'bg-blue-500/20 text-blue-300'
                        }`}>
                        {match.status}
                    </span>
                </div>

                <div className="teams-container space-y-2">
                    <TeamSlot
                        team={match.teamA}
                        getTeamName={getTeamName}
                        isWinner={match.winner === match.teamA}
                    />
                    <TeamSlot
                        team={match.teamB}
                        getTeamName={getTeamName}
                        isWinner={match.winner === match.teamB}
                    />
                </div>

                {match.date && (
                    <div className="match-date text-xs text-neutral-400 text-center mt-3">
                        {new Date(match.date).toLocaleDateString()}
                    </div>
                )}
            </div>

            {/* Connector lines */}
            {!isLastRound && (
                <>
                    <div className="connector-line-horizontal absolute top-1/2 -right-4 w-4 h-0.5 bg-neutral-600"></div>
                    <div className="connector-line-vertical absolute top-1/2 -right-4 w-0.5 h-16 bg-neutral-600"></div>
                </>
            )}
        </div>
    );
};

const TeamSlot = ({
    team,
    score,
    getTeamName,
    isWinner
}: {
    team?: string | null;
    score?: number;
    getTeamName: (id?: string) => string;
    isWinner?: boolean;
}) => {
    if (!team) {
        return (
            <div className="team-slot bg-neutral-700/50 text-neutral-500 italic px-3 py-2 rounded text-sm">
                Bye
            </div>
        );
    }

    return (
        <div className={`team-slot flex justify-between items-center px-3 py-2 rounded text-sm transition-all ${isWinner
                ? 'bg-green-500/20 border border-green-500/30 text-green-300'
                : 'bg-neutral-700/50 text-white'
            }`}>
            <span className="team-name font-medium">{getTeamName(team)}</span>
            {score !== undefined && (
                <span className={`score font-bold ${isWinner ? 'text-green-300' : 'text-neutral-300'
                    }`}>
                    {score}
                </span>
            )}
        </div>
    );
};

const LeagueFixtures = ({ matches, getTeamName }: { matches: Match[], getTeamName: (id?: string) => string }) => {
    return (
        <div className="league-fixtures grid gap-3">
            {matches.map((match, index) => (
                <div
                    key={index}
                    className={`league-match bg-neutral-800 border rounded-lg p-4 hover:bg-neutral-700/50 transition-colors ${match.status === 'completed' ? 'border-green-500/30' :
                            match.status === 'ongoing' ? 'border-yellow-500/30' :
                                'border-neutral-600'
                        }`}
                >
                    <div className="flex justify-between items-center">
                        <div className="flex-1">
                            <div className="flex items-center justify-between">
                                <span className="text-white font-medium">{getTeamName(match.teamA)}</span>
                                {match.result?.teamAScore !== undefined && (
                                    <span className={`text-lg font-bold mx-4 ${match.winner === match.teamA ? 'text-green-400' : 'text-white'
                                        }`}>
                                        {match.result.teamAScore}
                                    </span>
                                )}
                            </div>
                            <div className="flex items-center justify-between mt-2">
                                <span className="text-white font-medium">{getTeamName(match.teamB || 'bye')}</span>
                                {match.result?.teamBScore !== undefined && (
                                    <span className={`text-lg font-bold mx-4 ${match.winner === match.teamB ? 'text-green-400' : 'text-white'
                                        }`}>
                                        {match.result.teamBScore}
                                    </span>
                                )}
                            </div>
                        </div>

                        <div className="flex flex-col items-end gap-2 ml-4">
                            <span className={`text-xs px-2 py-1 rounded-full ${match.status === 'completed' ? 'bg-green-500/20 text-green-300' :
                                    match.status === 'ongoing' ? 'bg-yellow-500/20 text-yellow-300' :
                                        'bg-blue-500/20 text-blue-300'
                                }`}>
                                {match.status}
                            </span>
                            <span className="text-xs text-neutral-400">
                                Match {match.matchNumber}
                            </span>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default function FixturesTab({ type }: FixturesTabProps) {
    const dispatch = useAppDispatch();
    const { id } = useParams<{ id: string }>();
    const { selectedTournament, registeredTeams, fixtures, fixturesLoading } =
        useAppSelector(state => state.managerTournaments);

    useEffect(() => {
        if (id) dispatch(getTournamentFixtures(id));
    }, [dispatch, id]);

    if (!selectedTournament) return null;

    if (fixturesLoading) return <LoadingOverlay show />;

    const canCreateFixtures = type === "manage";

    function getTeamName(teamId?: string | null): string {
        if (!teamId) return "Bye";
        const team = registeredTeams.find(t => t._id === teamId);
        return team ? team.name : "Unknown";
    }

    function generateFixtures() {
        if (!selectedTournament) return;
        const format = selectedTournament.format;
        const teams = registeredTeams;
        let fixturesData: Match[] = [];

        switch (format) {
            case "knockout":
                fixturesData = generateKnockoutFixtures(teams);
                break;
            case "league":
                fixturesData = generateLeagueFixtures(teams);
                break;
            case "friendly":
                fixturesData = generateFriendlyFixture(teams);
                break;
            default:
                return toast.error("Unknown tournament format");
        }

        if (fixturesData.length === 0) {
            return toast.warn("Not enough teams to create fixtures");
        }

        dispatch(createTournamentFixtures({ tournamentId: selectedTournament._id, matches: fixturesData }))
            .unwrap()
            .then(() => toast.success("Fixtures created successfully!"))
            .catch(() => toast.error("Failed to create fixtures"));
    }

    // --- Fixture generation logic (keep your existing functions) ---
    function generateKnockoutFixtures(teams: RegisteredTeam[]) {
        const shuffled = shuffleTeams(teams);
        const matches: Match[] = [];
        for (let i = 0; i < shuffled.length; i += 2) {
            if (shuffled[i + 1]) {
                matches.push({
                    matchNumber: matches.length + 1,
                    teamA: shuffled[i]._id,
                    teamB: shuffled[i + 1]._id,
                    round: 1,
                    status: "upcoming",
                    winner : ''
                });
            } else {
                matches.push({
                    matchNumber: matches.length + 1,
                    teamA: shuffled[i]._id,
                    teamB: null,
                    round: 1,
                    status: "bye",
                    winner : ''
                });
            }
        }
        return matches;
    }

    function generateLeagueFixtures(teams: RegisteredTeam[]) {
        const matches: Match[] = [];
        let matchNumber = 1;
        for (let i = 0; i < teams.length; i++) {
            for (let j = i + 1; j < teams.length; j++) {
                matches.push({
                    matchNumber: matchNumber++,
                    teamA: teams[i]._id,
                    teamB: teams[j]._id,
                    status: "upcoming",
                    winner : ''
                });
            }
        }
        return shuffleTeams(matches);
    }

    function generateFriendlyFixture(teams: RegisteredTeam[]) {
        const shuffled = shuffleTeams(teams);
        if (shuffled.length < 2) return [];
        return [
            {
                matchNumber: 1,
                teamA: shuffled[0]._id,
                teamB: shuffled[1]._id,
                status: "upcoming",
            },
        ] as Match[];
    }

    // --- Show Create Fixtures button ---
    if (!fixtures?.matches || fixtures.matches.length === 0) {
        if (type === "manage") {
            return (
                <div className="flex flex-col items-center justify-center mt-10 text-center">
                    {canCreateFixtures ? (
                        <>
                            <PlusCircle size={50} className="text-green-500 mb-3" />
                            <h3 className="text-xl font-semibold mb-2">Ready to Generate Fixtures</h3>
                            <p className="text-neutral-400 mb-5">
                                Click below to automatically generate matches for all registered teams.
                            </p>
                            <button
                                onClick={generateFixtures}
                                className="px-6 py-2.5 rounded-lg bg-green-600 hover:bg-green-700 transition text-white font-medium"
                            >
                                Create Fixtures
                            </button>
                        </>
                    ) : (
                        <div className="flex flex-col items-center text-center">
                            <AlertTriangle size={48} className="text-yellow-400 mb-3" />
                            <h3 className="text-lg font-semibold mb-1">More Teams Required</h3>
                            <p className="text-neutral-400">
                                Minimum {selectedTournament.minTeams} teams required to create fixtures.
                            </p>
                        </div>
                    )}
                </div>
            );
        } else if (type === "explore") {
            return (
                <div className="flex flex-col items-center justify-center mt-10 text-center">
                    <AlertTriangle size={48} className="text-yellow-400 mb-3" />
                    <h3 className="text-lg font-semibold mb-1">Fixtures Not Available</h3>
                    <p className="text-neutral-400">
                        Fixtures will be available once the tournament manager generates them.
                    </p>
                </div>
            );
        }
    }


    return (
        <div className="mt-4">
            {selectedTournament.format === 'knockout' ? (
                <KnockoutBracket
                    matches={fixtures?.matches ?? []}
                    getTeamName={getTeamName}
                />
            ) : (
                <LeagueFixtures
                    matches={fixtures?.matches ?? []}
                    getTeamName={getTeamName}
                />
            )}
        </div>
    );
}