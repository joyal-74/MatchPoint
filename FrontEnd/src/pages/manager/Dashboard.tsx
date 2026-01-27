import Navbar from "../../components/manager/Navbar";
import image from '../../assets/images/cricket-3.png';
import { Users, Calendar, BarChart3, ArrowRight, MapPin, Trophy } from 'lucide-react';
import Footer from "../../components/viewer/Footer";
import { useAppDispatch, useAppSelector } from "../../hooks/hooks";
import { useEffect } from "react";
import { getExploreTournaments } from "../../features/manager/Tournaments/tournamentThunks";
import { useNavigate } from "react-router-dom";

export default function ManagerDashboard() {
    const activeTournaments = useAppSelector(state => state.managerTournaments.exploreTournaments);
    const managerId = useAppSelector(state => state.auth.user?._id);
    const dispatch = useAppDispatch();
    const navigate = useNavigate()

    useEffect(() => {
        if (activeTournaments.length === 0 && managerId) {
            dispatch(getExploreTournaments({ managerId, page: 1, limit: 3, filter: '', search: '' }))
        }
    }, [activeTournaments.length, managerId, dispatch]);

    // Helper to format dates
    const formatDate = (dateString: string) => {
        if (!dateString) return 'TBA';
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    // Helper for Status Colors using Semantic Theme Variables
    const getStatusColor = (status: string) => {
        switch (status?.toLowerCase()) {
            case 'ongoing':
                return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
            case 'upcoming':
                return 'bg-primary/10 text-primary';
            case 'completed':
                return 'bg-muted text-muted-foreground';
            case 'canceled':
                return 'bg-destructive/10 text-destructive';
            default:
                return 'bg-secondary text-secondary-foreground';
        }
    };

    const features = [
        {
            icon: Users,
            title: 'Team Management',
            description: 'Manage your cricket teams, track player performance, handle registrations, and organize squad rotations efficiently.',
        },
        {
            icon: Calendar,
            title: 'Schedule & Fixtures',
            description: 'Create match schedules, manage tournament fixtures, send notifications, and handle venue bookings seamlessly.',
        },
        {
            icon: BarChart3,
            title: 'Analytics & Reports',
            description: 'Access detailed statistics, generate performance reports, track team progress, and make data-driven decisions.',
        }
    ];

    const managerStats = [
        { number: '12', label: 'Active Tournaments' },
        { number: '156', label: 'Registered Teams' },
        { number: '1,847', label: 'Total Players' },
        { number: '234', label: 'Matches Scheduled' }
    ];

    return (
        <>
            <Navbar />
            {/* Main Background using Theme Background */}
            <div className="min-h-screen bg-background text-foreground transition-colors duration-300">

                <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden px-6 pt-16 lg:px-16">
                    {/* Background Gradients using Primary/Secondary vars */}
                    <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-secondary/20" />

                    {/* Content Container */}
                    <div className="relative z-10 w-full p-3 mx-auto">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                            {/* Left Content */}
                            <div className="space-y-8">
                                <div className="space-y-6">
                                    <h1 className="text-4xl lg:text-6xl font-bold leading-tight tracking-tight">
                                        <span className="text-foreground">
                                            Manage Your
                                        </span>
                                        <br />
                                        {/* Gradient Text using Primary Color */}
                                        <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                                            Sports Empire
                                        </span>
                                    </h1>

                                    <div className="space-y-4">
                                        <p className="text-xl font-semibold text-foreground/80 leading-relaxed">
                                            Streamline tournament operations, manage teams, and make data-driven decisions
                                        </p>

                                        <p className="text-lg text-muted-foreground leading-relaxed">
                                            Complete tournament management solution for organizing sports competitions,
                                            tracking performance, and ensuring smooth operations.
                                        </p>
                                    </div>
                                </div>

                                {/* Quick Actions */}
                                <div className="flex flex-col sm:flex-row gap-4">
                                    <button
                                        onClick={() => navigate('/manager/tournaments')}
                                        className="bg-primary text-primary-foreground hover:bg-primary/90 px-8 py-3 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center space-x-2 shadow-lg shadow-primary/20">
                                        <Calendar className="w-5 h-5" />
                                        <span>Create Tournament</span>
                                    </button>
                                    
                                </div>

                                {/* Stats */}
                                <div className="grid grid-cols-2 md:grid-cols-4 pt-8 border-t border-border">
                                    {managerStats.map((stat, index) => (
                                        <div key={index} className="text-center p-4">
                                            <div className="text-2xl font-bold text-primary">
                                                {stat.number}
                                            </div>
                                            <div className="text-xs text-muted-foreground uppercase tracking-wide">
                                                {stat.label}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Right Content - Dashboard Preview */}
                            <div className="relative flex justify-end">
                                {/* Decorative elements using Primary color */}
                                <div className="w-75 h-75 lg:w-80 lg:h-96 bg-primary/10 rounded-2xl transform right-10 rotate-12 bottom-4 top-4 absolute" />

                                <img
                                    src={image}
                                    alt="Sports character"
                                    className="relative z-10 max-h-[420px] object-contain drop-shadow-2xl"
                                />

                                <div className="absolute -z-10 top-8 -right-8 w-72 h-72 bg-primary/20 rounded-full blur-3xl"></div>
                            </div>
                        </div>
                    </div>

                    {/* Background Blobs */}
                    <div className="absolute top-10 left-10 w-20 h-20 bg-primary/10 rounded-full blur-xl"></div>
                    <div className="absolute bottom-20 right-20 w-32 h-32 bg-secondary/50 rounded-full blur-2xl"></div>
                </section>

                {/* Features Section */}
                <section className="py-16 bg-card text-card-foreground border-y border-border">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl lg:text-4xl font-bold mb-4 pb-1">
                                Powerful Management Tools
                            </h2>
                            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                                Everything you need to organize and manage professional cricket tournaments efficiently.
                            </p>
                        </div>

                        <div className="grid md:grid-cols-3 gap-6">
                            {features.map((feature, index) => (
                                <div
                                    key={index}
                                    className="bg-background p-6 rounded-xl border border-border hover:border-primary/50 hover:shadow-lg transition-all duration-200 group"
                                >
                                    <div className={`w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-primary group-hover:text-primary-foreground transition-colors`}>
                                        <feature.icon className="w-6 h-6 text-primary group-hover:text-primary-foreground" />
                                    </div>
                                    <h3 className="text-lg font-bold mb-3 text-foreground">
                                        {feature.title}
                                    </h3>
                                    <p className="text-muted-foreground text-sm leading-relaxed">
                                        {feature.description}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Active Tournaments Section */}
                <section className="py-16 bg-muted/30">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex items-center justify-between mb-8">
                            <div>
                                <h2 className="text-3xl font-bold text-foreground mb-2">
                                    Explore Tournaments
                                </h2>
                                <p className="text-muted-foreground">
                                    Monitor and manage ongoing competitions
                                </p>
                            </div>
                            <button className="text-primary font-semibold flex items-center space-x-2 hover:space-x-3 transition-all duration-200 hover:text-primary/80">
                                <span>View All</span>
                                <ArrowRight className="w-4 h-4" />
                            </button>
                        </div>

                        {activeTournaments && activeTournaments.length > 0 ? (
                            <div className="grid md:grid-cols-3 gap-6">
                                {activeTournaments.map((tournament) => {
                                    const progressPercentage = tournament.maxTeams > 0
                                        ? Math.round((tournament.currTeams / tournament.maxTeams) * 100)
                                        : 0;

                                    return (
                                        <div
                                            key={tournament._id}
                                            className="bg-card text-card-foreground rounded-xl border border-border overflow-hidden hover:shadow-lg transition-all duration-200 flex flex-col hover:border-primary/50"
                                        >
                                            <div className="p-6 flex-1 flex flex-col">
                                                <div className="flex items-center justify-between mb-4">
                                                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${getStatusColor(tournament.status)}`}>
                                                        {tournament.status}
                                                    </span>
                                                    <span className="bg-secondary text-secondary-foreground px-2 py-1 rounded text-xs font-medium uppercase border border-border">
                                                        {tournament.format}
                                                    </span>
                                                </div>

                                                <h3 className="font-bold text-lg mb-2 text-foreground line-clamp-1" title={tournament.title}>
                                                    {tournament.title}
                                                </h3>

                                                <div className="text-sm text-muted-foreground mb-4 flex items-center gap-1 line-clamp-1">
                                                    <MapPin className="w-3 h-3" />
                                                    {tournament.location ? tournament.location.split(',')[0] : 'Location TBA'}
                                                </div>

                                                <div className="space-y-4 mb-4 mt-auto">
                                                    {/* Teams Progress */}
                                                    <div>
                                                        <div className="flex items-center justify-between text-sm mb-1">
                                                            <span className="text-muted-foreground">Teams Registered</span>
                                                            <span className="font-semibold text-foreground">
                                                                {tournament.currTeams} <span className="text-muted-foreground font-normal">/ {tournament.maxTeams}</span>
                                                            </span>
                                                        </div>
                                                        <div className="w-full bg-secondary rounded-full h-2">
                                                            <div
                                                                className="bg-primary h-2 rounded-full transition-all duration-300"
                                                                style={{ width: `${progressPercentage}%` }}
                                                            ></div>
                                                        </div>
                                                    </div>

                                                    {/* Prize Pool Row */}
                                                    <div className="flex items-center justify-between text-sm bg-muted/50 p-2 rounded-lg border border-border/50">
                                                        <div className="flex items-center gap-2 text-muted-foreground">
                                                            <Trophy className="w-4 h-4 text-primary" />
                                                            <span>Prize Pool</span>
                                                        </div>
                                                        <span className="font-bold text-foreground">₹{tournament.prizePool}</span>
                                                    </div>
                                                </div>

                                                <div className="pt-4 border-t border-border">
                                                    <div className="flex items-center justify-between text-sm text-muted-foreground mb-3">
                                                        <div className="flex items-center space-x-2">
                                                            <Calendar className="w-4 h-4" />
                                                            <span>
                                                                {formatDate(tournament.startDate)} - {formatDate(tournament.endDate)}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <button
                                                    onClick={()=> navigate(`/manager/tournaments/${tournament._id}/explore`)}
                                                     className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-2 rounded-lg font-semibold transition-colors duration-200">
                                                        View Details
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <div className="text-center py-12 bg-card rounded-xl border border-dashed border-border">
                                <p className="text-muted-foreground">No active tournaments found.</p>
                                <button className="mt-4 text-primary hover:underline font-medium text-sm">Create your first tournament</button>
                            </div>
                        )}
                    </div>
                </section>

            </div>

            <Footer />
        </>
    );
}