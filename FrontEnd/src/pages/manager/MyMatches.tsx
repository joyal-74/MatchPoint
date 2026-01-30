import { useState, useEffect, useMemo } from 'react';
import { Calendar, MapPin, Search, Trophy, Clock } from 'lucide-react';
import { fetchMatchesByManager } from '../../features/manager/Matches/matchThunks';
import type { Match } from '../../domain/match/types';
import { useAppDispatch, useAppSelector } from '../../hooks/hooks';
import ManagerLayout from '../layout/ManagerLayout';


const FixtureCard = ({ match }: { match: Match }) => (
    <div className="relative min-w-[300px] flex-shrink-0 overflow-hidden rounded-xl border border-border bg-card transition-all hover:border-primary/50 hover:shadow-md group">
        <div className="flex items-center justify-between border-b border-border bg-muted/30 px-4 py-3 group-hover:bg-primary/5 transition-colors">
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground truncate max-w-[150px]">
                {match.tournamentName || 'Tournament'}
            </span>
            <div className="flex items-center gap-1.5 text-xs font-medium text-foreground">
                <Calendar size={12} className="text-primary" />
                {new Date(match.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}
            </div>
        </div>

        <div className="flex items-center justify-between p-5">
            <div className="flex flex-col items-center gap-2 w-20">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-secondary overflow-hidden border border-border">
                    {match.teamA.logo ? <img src={match.teamA.logo} alt="" className="w-full h-full object-cover" /> : '🏏'}
                </div>
                <span className="font-bold text-xs truncate w-full text-center">{match.teamA.name}</span>
            </div>

            <div className="flex flex-col items-center gap-1">
                <div className="rounded bg-primary/10 px-3 py-1 text-[10px] font-black text-primary uppercase">
                    {match.status}
                </div>
                <span className="text-[10px] text-muted-foreground font-bold mt-1">VS</span>
            </div>

            <div className="flex flex-col items-center gap-2 w-20">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-secondary overflow-hidden border border-border">
                    {match.teamB.logo ? <img src={match.teamB.logo} alt="" className="w-full h-full object-cover" /> : '🏏'}
                </div>
                <span className="font-bold text-xs truncate w-full text-center">{match.teamB.name}</span>
            </div>
        </div>

        <div className="flex items-center justify-between border-t border-border px-4 py-3 text-[10px] text-muted-foreground bg-muted/5">
            <div className="flex items-center gap-1.5 truncate mr-2">
                <MapPin size={12} />
                <span className="truncate">{match.venue}</span>
            </div>
            <div className="flex items-center gap-1.5 shrink-0">
                <Clock size={12} />
                <span>Round {match.round}</span>
            </div>
        </div>
    </div>
);

const MatchResultRow = ({ match, managerId }: { match: Match; managerId?: string }) => {
    // Determine which side is "us" (the manager's team)
    const isTeamA = match.teamA._id === managerId; // Or logic based on manager's owned team ID
    const myTeam = isTeamA ? match.teamA : match.teamB;
    const opponent = isTeamA ? match.teamB : match.teamA;

    const isWin = match.winner === myTeam._id;
    const isLoss = match.winner === opponent._id;
    const resultColor = isWin ? 'text-green-600' : isLoss ? 'text-destructive' : 'text-orange-500';

    return (
        <div className="group grid grid-cols-1 md:grid-cols-12 items-center gap-4 border-b border-border py-4 last:border-0 hover:bg-muted/30 px-4 transition-colors cursor-pointer">
            <div className="md:col-span-3 flex flex-col">
                <span className="text-sm font-bold text-foreground">
                    {new Date(match.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </span>
                <span className="text-xs text-muted-foreground truncate">{match.venue}</span>
            </div>

            <div className="md:col-span-6 flex items-center justify-between md:justify-center md:gap-12">
                <div className="flex flex-col items-center md:items-end min-w-[80px]">
                    <span className="text-sm font-black text-foreground uppercase">{myTeam.name.substring(0, 3)}</span>
                    <span className="text-[10px] font-bold text-primary">Scorecard TBD</span>
                </div>
                <div className="text-[10px] font-black text-muted-foreground/30">VS</div>
                <div className="flex flex-col items-center md:items-start min-w-[80px]">
                    <span className="text-sm font-black text-foreground uppercase">{opponent.name.substring(0, 3)}</span>
                    <span className="text-[10px] font-bold text-muted-foreground">Scorecard TBD</span>
                </div>
            </div>

            <div className="md:col-span-3 flex flex-col items-end gap-1">
                <div className="flex items-center gap-2">
                    <span className={`text-[10px] font-black uppercase tracking-widest ${resultColor}`}>
                        {isWin ? 'Victory' : isLoss ? 'Defeat' : 'Draw/Pending'}
                    </span>
                    <div className={`h-2 w-2 rounded-full ${isWin ? 'bg-green-500' : isLoss ? 'bg-destructive' : 'bg-orange-500'}`} />
                </div>
                <span className="text-[10px] text-muted-foreground bg-secondary/50 px-2 py-0.5 rounded-full uppercase font-bold">
                    {match.tournamentName}
                </span>
            </div>
        </div>
    );
};

const MyMatchesPage = () => {
    const dispatch = useAppDispatch()
    const [search, setSearch] = useState('');

    const { matches, loading } = useAppSelector((state) => state.manager);
    const { user } = useAppSelector((state) => state.auth);

    useEffect(() => {
        if (user?._id) dispatch(fetchMatchesByManager(user._id));
    }, [dispatch, user?._id]);

    const filteredMatches = useMemo(() => {
        return matches.filter(m =>
            m.teamA.name.toLowerCase().includes(search.toLowerCase()) ||
            m.teamB.name.toLowerCase().includes(search.toLowerCase()) ||
            m.tournamentName.toLowerCase().includes(search.toLowerCase())
        );
    }, [matches, search]);

    const upcoming = filteredMatches.filter(m => m.status === 'upcoming');
    const past = filteredMatches.filter(m => m.status === 'completed');

    if (loading && matches.length === 0) {
        return <div className="h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" /></div>;
    }

    return (
        <>
            <ManagerLayout>

                <div className="bg-background">
                    <main className="mx-auto px-4">
                        {/* Header */}
                        <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
                            <div>
                                <h1 className="text-4xl font-black">My Matches</h1>
                                <p className="text-muted-foreground text-sm font-medium">Professional management for {user?.firstName}'s fixtures.</p>
                            </div>
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                                <input
                                    className="bg-muted/50 border-none rounded-xl pl-10 pr-4 py-2.5 text-sm w-full md:w-64 focus:ring-2 ring-primary/20 transition-all"
                                    placeholder="Search fixtures..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                />
                            </div>
                        </div>

                        {/* Upcoming */}
                        <section className="mb-16">
                            <h2 className="text-xs font-black uppercase tracking-[0.3em] text-primary mb-6 flex items-center gap-2">
                                <Clock size={14} /> Upcoming Battles
                            </h2>
                            <div className="flex gap-6 overflow-x-auto pb-6 scrollbar-hide">
                                {upcoming.length > 0 ? (
                                    upcoming.map(m => <FixtureCard key={m._id} match={m} />)
                                ) : (
                                    <div className="w-full h-32 border-2 border-dashed border-border rounded-2xl flex items-center justify-center text-muted-foreground text-sm font-bold uppercase italic">No Pending Matches</div>
                                )}
                            </div>
                        </section>

                        {/* History */}
                        <section>
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-xs font-black uppercase tracking-[0.3em] text-primary flex items-center gap-2">
                                    <Trophy size={14} /> Combat History
                                </h2>
                                <button className="text-[10px] font-black uppercase bg-secondary px-3 py-1.5 rounded-lg hover:bg-secondary/80 transition-colors">
                                    Export Reports
                                </button>
                            </div>
                            <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
                                {past.length > 0 ? (
                                    past.map(m => <MatchResultRow key={m._id} match={m} managerId={user?._id} />)
                                ) : (
                                    <div className="p-20 text-center text-muted-foreground text-sm font-bold uppercase italic">No historical records found</div>
                                )}
                            </div>
                        </section>
                    </main>
                </div>
            </ManagerLayout>
        </>
    );
};

export default MyMatchesPage;