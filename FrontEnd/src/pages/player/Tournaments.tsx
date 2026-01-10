import { useEffect, useState } from 'react';
import { Calendar, MapPin, Users, Trophy, Clock, Award, Activity, ArrowRight, Filter } from 'lucide-react';
import Navbar from '../../components/player/Navbar';
import { useAppDispatch, useAppSelector } from '../../hooks/hooks';
import type { Tournament } from '../../features/manager/managerTypes';
import { fetchTournaments } from '../../features/player/Tournnaments/tournamentThunks';

type TournamentTab = 'upcoming' | 'ongoing' | 'completed' | 'registered';

const TournamentsPage = () => {
    const [activeTab, setActiveTab] = useState<TournamentTab>('upcoming');
    const dispatch = useAppDispatch();

    const { allTournaments, loading } = useAppSelector((state) => state.playerTournaments);
    const playerId = useAppSelector(state => state.auth.user?._id);

    useEffect(() => {
        if (activeTab === 'registered' && playerId) {
            dispatch(fetchTournaments({ status: activeTab, playerId: playerId }));
        } else {
            dispatch(fetchTournaments({ status: activeTab }));
        }
    }, [activeTab, dispatch, playerId]);

    const tabs = [
        { id: 'upcoming', label: 'Upcoming', icon: Clock },
        { id: 'ongoing', label: 'Live Now', icon: Activity },
        { id: 'completed', label: 'Past Events', icon: Award },
        { id: 'registered', label: 'My Entries', icon: Trophy },
    ];

    return (
        <div className="min-h-screen bg-background text-foreground flex flex-col">
            <Navbar />

            <div className="flex-1 mt-16">
                {/* --- Hero Section --- */}
                <div className="relative bg-muted/20 border-b border-border py-16 px-4 sm:px-6 lg:px-8 overflow-hidden">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[400px] bg-primary/5 rounded-full blur-3xl -z-10" />
                    
                    <div className="max-w-7xl mx-auto text-center space-y-6">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold uppercase tracking-wider border border-primary/20 mb-2">
                            <Trophy size={14} /> Official Tournaments
                        </div>
                        <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-foreground">
                            Compete. Win. <span className="text-primary">Glory.</span>
                        </h1>
                        <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                            Browse the official tournament calendar. From local leagues to national championships, find your stage and showcase your skills.
                        </p>
                    </div>
                </div>

                {/* --- Main Content --- */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                    
                    {/* Filter / Tabs */}
                    <div className="flex flex-col sm:flex-row justify-between items-center gap-6 mb-10">
                        <div className="flex p-1.5 bg-muted/50 border border-border rounded-xl w-full sm:w-auto overflow-x-auto">
                            {tabs.map(({ id, label, icon: Icon }) => (
                                <button
                                    key={id}
                                    onClick={() => setActiveTab(id as TournamentTab)}
                                    className={`
                                        flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 whitespace-nowrap
                                        ${activeTab === id
                                            ? 'bg-background text-foreground shadow-sm ring-1 ring-border/50'
                                            : 'text-muted-foreground hover:text-foreground hover:bg-background/50'
                                        }
                                    `}
                                >
                                    <Icon size={16} className={activeTab === id ? "text-primary" : ""} />
                                    <span>{label}</span>
                                </button>
                            ))}
                        </div>

                        {/* Optional Filter Button (Visual only for now) */}
                        <button className="hidden sm:flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                            <Filter size={16} /> Filter Results
                        </button>
                    </div>

                    {/* Content Grid */}
                    {loading ? (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="h-64 bg-muted/30 rounded-2xl animate-pulse" />
                            ))}
                        </div>
                    ) : (
                        <>
                            {(!allTournaments || allTournaments.length === 0) ? (
                                <div className="flex flex-col items-center justify-center py-24 bg-card border border-dashed border-border rounded-3xl text-center px-4">
                                    <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mb-6">
                                        <Trophy className="w-10 h-10 text-muted-foreground/40" />
                                    </div>
                                    <h3 className="text-2xl font-bold text-foreground mb-2">No Tournaments Found</h3>
                                    <p className="text-muted-foreground max-w-sm mx-auto">
                                        There are currently no {activeTab} tournaments available. Check back later or try a different category.
                                    </p>
                                </div>
                            ) : (
                                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                    {allTournaments.map((tournament: Tournament) => (
                                        <TournamentCard 
                                            key={tournament._id} 
                                            tournament={tournament} 
                                            type={activeTab} 
                                        />
                                    ))}
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

// --- Sub Component: Tournament Card ---

interface TournamentCardProps {
    tournament: Tournament;
    type: TournamentTab;
}

const TournamentCard = ({ tournament, type }: TournamentCardProps) => {
    const startDate = new Date(tournament.startDate);
    const endDate = new Date(tournament.endDate);
    
    // Formatting Dates
    const startDay = startDate.getDate();
    const startMonth = startDate.toLocaleString('default', { month: 'short' });
    const dateRange = `${startDate.toLocaleDateString()} - ${endDate.toLocaleDateString()}`;

    // Styling Logic
    const getStatusStyles = () => {
        switch (type) {
            case 'ongoing': 
                return { 
                    badge: 'bg-red-500 text-white animate-pulse', 
                    gradient: 'from-red-500/20 to-transparent',
                    text: 'Live Now'
                };
            case 'completed': 
                return { 
                    badge: 'bg-muted text-muted-foreground', 
                    gradient: 'from-muted/50 to-transparent',
                    text: 'Completed'
                };
            case 'registered':
                return {
                    badge: 'bg-purple-500 text-white',
                    gradient: 'from-purple-500/20 to-transparent',
                    text: 'Registered'
                };
            default: 
                return { 
                    badge: 'bg-blue-500 text-white', 
                    gradient: 'from-blue-500/20 to-transparent',
                    text: 'Upcoming'
                };
        }
    };

    const styles = getStatusStyles();

    return (
        <div className="group relative bg-card hover:bg-muted/30 border border-border rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-xl hover:border-primary/30 flex flex-col h-full">
            
            {/* Top Gradient Banner */}
            <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${styles.gradient.replace('to-transparent', 'to-primary/20')}`} />
            
            {/* Card Body */}
            <div className="p-6 flex flex-col h-full">
                
                {/* Header: Date Badge & Status */}
                <div className="flex justify-between items-start mb-5">
                    {/* Date Block */}
                    <div className="flex flex-col items-center justify-center bg-background border border-border rounded-xl w-14 h-14 shadow-sm group-hover:border-primary/50 transition-colors">
                        <span className="text-xs font-bold text-muted-foreground uppercase">{startMonth}</span>
                        <span className="text-xl font-bold text-foreground leading-none">{startDay}</span>
                    </div>

                    <div className="flex flex-col items-end gap-2">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${styles.badge}`}>
                            {styles.text}
                        </span>
                        <span className="text-xs font-medium text-muted-foreground bg-muted px-2 py-0.5 rounded border border-border">
                            {tournament.format}
                        </span>
                    </div>
                </div>

                {/* Title */}
                <h3 className="text-xl font-bold text-foreground mb-3 line-clamp-2 group-hover:text-primary transition-colors">
                    {tournament.title}
                </h3>

                {/* Info Grid */}
                <div className="space-y-3 mb-6 flex-1">
                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                        <div className="w-8 h-8 rounded-full bg-muted/50 flex items-center justify-center text-primary">
                            <MapPin size={16} />
                        </div>
                        <span className="truncate">{tournament.location}</span>
                    </div>
                    
                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                        <div className="w-8 h-8 rounded-full bg-muted/50 flex items-center justify-center text-primary">
                            <Users size={16} />
                        </div>
                        <span>{tournament.teams?.length || 0} Teams Joined</span>
                    </div>

                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                        <div className="w-8 h-8 rounded-full bg-muted/50 flex items-center justify-center text-primary">
                            <Calendar size={16} />
                        </div>
                        <span className="truncate">{dateRange}</span>
                    </div>
                </div>

                {/* Action Footer */}
                <div className="mt-auto pt-4 border-t border-border">
                    <button className="w-full group/btn flex items-center justify-between px-4 py-3 bg-primary text-primary-foreground rounded-xl font-semibold hover:bg-primary/90 transition-all shadow-md hover:shadow-lg">
                        <span>{type === 'registered' ? 'Go to Hub' : 'View Details'}</span>
                        <div className="bg-white/20 p-1 rounded-lg group-hover/btn:translate-x-1 transition-transform">
                            <ArrowRight size={16} />
                        </div>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TournamentsPage;