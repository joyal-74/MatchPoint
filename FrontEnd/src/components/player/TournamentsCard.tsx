import { ArrowRight, Calendar, MapPin, Users, Trophy } from 'lucide-react';
import type { Tournament } from '../../features/manager/managerTypes';

interface TournamentsCardProps {
    tournaments: Tournament[];
}

const TournamentsCard = ({ tournaments }: TournamentsCardProps) => {
    return (
        <section id="tournaments" className="py-16 bg-muted/30">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                
                {/* Section Header */}
                <div className="flex items-end justify-between mb-8">
                    <div>
                        <h2 className="text-3xl font-bold text-foreground mb-2 flex items-center gap-2">
                            <Trophy className="text-yellow-500" /> Upcoming Tournaments
                        </h2>
                        <p className="text-muted-foreground">
                            Register for premier cricket tournaments happening near you.
                        </p>
                    </div>
                    <button className="text-sm font-semibold text-primary hover:text-primary/80 flex items-center gap-1 transition-colors">
                        View All <ArrowRight size={16} />
                    </button>
                </div>

                {/* Cards Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {tournaments.map((tournament, index) => (
                        <div
                            key={index}
                            className="bg-card text-card-foreground rounded-xl border border-border p-6 hover:shadow-lg hover:border-primary/50 transition-all duration-300 group flex flex-col h-full"
                        >
                            {/* Card Header: Format & Prize */}
                            <div className="flex items-start justify-between mb-4">
                                <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border border-primary/20">
                                    {tournament.format}
                                </span>
                                <div className="text-right">
                                    <div className="text-lg font-bold text-foreground">
                                        {tournament.prizePool}
                                    </div>
                                    <div className="text-xs text-muted-foreground font-medium uppercase tracking-wide">
                                        Prize Pool
                                    </div>
                                </div>
                            </div>

                            {/* Card Content */}
                            <div className="flex-1">
                                <h3 className="font-bold text-xl mb-4 group-hover:text-primary transition-colors line-clamp-2">
                                    {tournament.title}
                                </h3>

                                <div className="space-y-3 mb-6">
                                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                                        <Calendar size={16} className="text-primary/70" />
                                        <span>{new Date(tournament.startDate).toLocaleDateString()}</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                                        <Users size={16} className="text-primary/70" />
                                        <span>{tournament.teams?.length || 0} Teams Registered</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                                        <MapPin size={16} className="text-primary/70" />
                                        <span className="truncate">{tournament.location}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Card Footer: Action */}
                            <button className="w-full py-2.5 bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg text-sm font-semibold transition-all shadow-sm group-hover:shadow-md mt-auto">
                                Register Now
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

export default TournamentsCard;