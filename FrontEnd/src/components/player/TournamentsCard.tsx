import { Calendar, MapPin, Users, ChevronRight} from 'lucide-react';
import type { Tournament } from '../../features/manager/managerTypes';
import { useNavigate } from 'react-router-dom';

interface TournamentsCardProps {
    tournaments: Tournament[];
}

const TournamentsCard = ({ tournaments }: TournamentsCardProps) => {
    const navigate = useNavigate();

    console.log(tournaments)

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tournaments.map((tournament, index) => (
                <div
                    key={tournament._id || index}
                    className="bg-card border border-border rounded-[var(--radius)] overflow-hidden hover:border-primary/50 transition-all duration-300 group flex flex-col shadow-sm hover:shadow-xl hover:-translate-y-1"
                >
                    {/* Visual Header: Prize & Format */}
                    <div className="relative p-6 pb-0 flex justify-between items-start">
                        <div className="space-y-1">
                            <span className="text-[10px] font-black uppercase tracking-widest text-primary bg-primary/10 px-2 py-0.5 rounded">
                                {tournament.format}
                            </span>
                            <h3 className="font-black text-2xl uppercase italic tracking-tighter leading-tight mt-2 group-hover:text-primary transition-colors line-clamp-1">
                                {tournament.title}
                            </h3>
                        </div>
                        <div className="text-right">
                            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Prize Pool</p>
                            <p className="text-xl font-black text-foreground tabular-nums">
                                {tournament.prizePool}
                            </p>
                        </div>
                    </div>

                    {/* Info Section: High Density */}
                    <div className="p-6 space-y-4 flex-1">
                        <div className="grid grid-cols-2 gap-4 py-4 border-y border-border/50">
                            <div className="space-y-1">
                                <div className="flex items-center gap-1.5 text-muted-foreground">
                                    <Calendar size={12} className="text-primary" />
                                    <span className="text-[10px] font-bold uppercase tracking-wider">Start Date</span>
                                </div>
                                <p className="text-sm font-bold">{new Date(tournament.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                            </div>
                            <div className="space-y-1">
                                <div className="flex items-center gap-1.5 text-muted-foreground">
                                    <Users size={12} className="text-primary" />
                                    <span className="text-[10px] font-bold uppercase tracking-wider">Registration</span>
                                </div>
                                <p className="text-sm font-bold">{tournament.currTeams || 0} / {tournament.maxTeams}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-2 text-muted-foreground text-xs font-medium italic">
                            <MapPin size={14} className="text-primary shrink-0" />
                            <span className="truncate">{tournament.location}</span>
                        </div>
                    </div>

                    {/* Action Area: Command Style */}
                    <div className="px-6 pb-6">
                        <button
                            onClick={() => navigate(`/player/tournaments/${tournament._id}`)}
                            className="w-full py-4 bg-secondary text-secondary-foreground group-hover:bg-primary group-hover:text-primary-foreground font-black uppercase tracking-[0.2em] text-[10px] rounded-[var(--radius)] transition-all flex items-center justify-center gap-2"
                        >
                            Register Now <ChevronRight size={14} />
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
}

export default TournamentsCard;