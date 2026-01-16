import { Trophy, Play, MessageCircle, ArrowRight, Activity } from 'lucide-react';
import Navbar from '../../components/player/Navbar';
import Footer from '../../components/viewer/Footer';
import image from '../../assets/images/cricket-4.png';
import TournamentsCard from '../../components/player/TournamentsCard';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { fetchLiveMatches, fetchTournaments } from '../../features/player/Tournnaments/tournamentThunks';
import { useAppDispatch, useAppSelector } from '../../hooks/hooks';
import LoadingOverlay from '../../components/shared/LoadingOverlay';

export const PlayerDashboard: React.FC = () => {

    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    useEffect(() => {
        dispatch(fetchTournaments({ limit: 3 }))
        dispatch(fetchLiveMatches({ limit: 3, status: 'ongoing' }))
    }, [dispatch])

    const { allTournaments: tournaments, matches: liveMatches, loading } = useAppSelector((state) => state.playerTournaments);

    console.log(liveMatches, " kjksjkfjksfdsfs")

    const features = [
        {
            icon: Trophy,
            title: 'Join Tournaments',
            description: 'Participate in T20, ODI, and Test matches. Filter by skill level and prize pool.',
            color: 'text-yellow-500',
            bg: 'bg-yellow-500/10'
        },
        {
            icon: Play,
            title: 'Watch Live',
            description: 'Stream HD matches with ball-by-ball commentary and live scores.',
            color: 'text-red-500',
            bg: 'bg-red-500/10'
        },
        {
            icon: MessageCircle,
            title: 'Team Chat',
            description: 'Discuss strategies, share highlights, and celebrate victories with your squad.',
            color: 'text-blue-500',
            bg: 'bg-blue-500/10'
        }
    ];

    const playerStats = [
        { number: '23', label: 'Tournaments' },
        { number: '147', label: 'Matches' },
        { number: '2,450', label: 'Runs' },
        { number: '18', label: 'Wickets' }
    ];

    return (
        <>
            <LoadingOverlay show={loading} />

            <div className="min-h-screen bg-background text-foreground flex flex-col">
                <Navbar />

                {/* --- Hero Section --- */}
                <section className="relative pb-16 lg:pt-32 lg:pb-24 overflow-hidden">
                    <div className="absolute inset-0 -z-10">
                        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl" />
                        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-3xl" />
                    </div>

                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="grid lg:grid-cols-2 gap-12 items-center">
                            <div className="space-y-8 text-center lg:text-left">
                                <h1 className="text-4xl lg:text-6xl font-bold tracking-tight leading-tight">
                                    Ready for Your <br />
                                    <span className="text-primary">Sports Challenge?</span>
                                </h1>
                                <p className="text-lg text-muted-foreground max-w-2xl mx-auto lg:mx-0">
                                    Discover upcoming tournaments, join live matches, and track your stats. The ultimate platform for cricket enthusiasts.
                                </p>

                                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                                    <button className="px-8 py-3 bg-primary text-primary-foreground font-semibold rounded-xl hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2"
                                        onClick={() => navigate('/player/tournaments')}
                                    >
                                        <Trophy size={20} /> Browse Tournaments
                                    </button>
                                    <button className="px-8 py-3 bg-secondary text-secondary-foreground font-semibold rounded-xl hover:bg-secondary/80 transition-all flex items-center justify-center gap-2"
                                        onClick={() => navigate('/player/live')}
                                    >
                                        <Play size={20} /> Watch Live
                                    </button>
                                </div>

                                {/* Quick Stats Row */}
                                <div className="grid grid-cols-4 gap-4 pt-8 border-t border-border">
                                    {playerStats.map((stat, idx) => (
                                        <div key={idx} className="text-center lg:text-left">
                                            <div className="text-2xl font-bold text-primary">{stat.number}</div>
                                            <div className="text-xs text-muted-foreground uppercase tracking-wider">{stat.label}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Hero Image */}
                            <div className="relative hidden lg:block">
                                <div className="absolute inset-0 bg-primary/20 rounded-full blur-3xl transform scale-75 translate-y-12" />
                                <img
                                    src={image}
                                    alt="Cricket Player"
                                    className="relative z-10 w-full max-w-md mx-auto drop-shadow-2xl hover:scale-105 transition-transform duration-500"
                                />
                            </div>
                        </div>
                    </div>
                </section>

                {/* --- Features Grid --- */}
                <section className="py-16 bg-muted/30">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl font-bold mb-4">Everything You Need</h2>
                            <p className="text-muted-foreground">Your complete companion for competitive cricket.</p>
                        </div>

                        <div className="grid md:grid-cols-3 gap-8">
                            {features.map((feature, idx) => (
                                <div key={idx} className="bg-card border border-border p-6 rounded-2xl shadow-sm hover:shadow-md transition-all group">
                                    <div className={`w-12 h-12 ${feature.bg} ${feature.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                                        <feature.icon size={24} />
                                    </div>
                                    <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                                    <p className="text-muted-foreground text-sm leading-relaxed">{feature.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* --- Live Matches Section --- */}
                <section className="py-16">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex justify-between items-end mb-8">
                            <div>
                                <h2 className="text-3xl font-bold flex items-center gap-2">
                                    <Activity className="text-red-500" /> Live Matches
                                </h2>
                                <p className="text-muted-foreground mt-1">Happening right now</p>
                            </div>
                            <button className="text-sm font-semibold text-primary hover:text-primary/80 flex items-center gap-1 transition-colors">
                                View All <ArrowRight size={16} />
                            </button>
                        </div>

                        <div className="grid md:grid-cols-2 gap-6">
                            {liveMatches.map((match) => (
                                <div
                                    key={match._id}
                                    className="bg-card border border-border rounded-xl p-5 hover:border-primary/50 transition-colors shadow-sm"
                                >
                                    {/* Top bar */}
                                    <div className="flex justify-between items-start mb-4">
                                        <span className="px-2.5 py-1 bg-red-500/10 text-red-600 dark:text-red-400 text-xs font-bold rounded-md flex items-center gap-1.5 animate-pulse">
                                            <span className="w-1.5 h-1.5 bg-red-500 rounded-full" /> LIVE
                                        </span>
                                    </div>

                                    {/* Teams */}
                                    <div className="space-y-4">
                                        {/* Team A */}
                                        <div className="flex justify-between items-center">
                                            <div className="flex items-center gap-3">
                                                <img
                                                    src={match.teamA.logo}
                                                    alt={match.teamA.name}
                                                    className="w-8 h-8 object-contain"
                                                />
                                                <div>
                                                    <h3 className="font-bold text-lg">{match.teamA.name}</h3>
                                                    <p className="text-muted-foreground text-sm">
                                                        {match.oversA} ov
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="text-2xl font-bold font-mono">
                                                {match.scoreA}
                                            </div>
                                        </div>

                                        <div className="h-px bg-border w-full" />

                                        {/* Team B */}
                                        <div className="flex justify-between items-center">
                                            <div className="flex items-center gap-3">
                                                <img
                                                    src={match.teamB.logo}
                                                    alt={match.teamB.name}
                                                    className="w-8 h-8 object-contain"
                                                />
                                                <div>
                                                    <h3 className="font-bold text-lg">{match.teamB.name}</h3>
                                                    <p className="text-muted-foreground text-sm">
                                                        {match.oversB} ov
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="text-2xl font-bold font-mono">
                                                {match.scoreB}
                                            </div>
                                        </div>
                                    </div>

                                    {/* CTA */}
                                    <button
                                        onClick={() => navigate(`/player/live/${match._id}`)}
                                        className="w-full mt-6 py-2.5 bg-secondary hover:bg-secondary/80 text-secondary-foreground rounded-lg text-sm font-semibold transition-colors flex items-center justify-center gap-2"
                                    >
                                        <Play size={16} /> Watch Live
                                    </button>
                                </div>
                            ))}
                        </div>

                    </div>
                </section>

                {/* --- Tournaments Section --- */}
                <div className="pb-16">
                    <TournamentsCard tournaments={tournaments} />
                </div>

                <Footer />
            </div>

        </>
    );
}

export default PlayerDashboard;