import TournamentCard from "./TournamentCard";
import type { Tournament } from "../../../features/manager/managerTypes";
import EmptyState from "./TournamentDetails/shared/EmptyState";
import { useNavigate } from "react-router-dom";
import { Plus } from "lucide-react";

interface MyTournamentsSectionProps {
    tournaments: Tournament[];
    hasMore: boolean;
    onShowAll: () => void;
    onEdit: (tournament: Tournament) => void;
    onCancel: (id: string) => void;
    onCreate: () => void;
}

export default function MyTournamentsSection({ 
    tournaments, 
    hasMore, 
    onShowAll, 
    onEdit, 
    onCancel, 
    onCreate 
}: MyTournamentsSectionProps) {
    const navigate = useNavigate();
    
    return (
        <section className="mb-12">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-xl font-bold text-foreground mb-1 flex items-center gap-2">
                        <span className="w-1.5 h-6 bg-primary rounded-full inline-block"></span>
                        My Active Tournaments
                    </h2>
                    <p className="text-muted-foreground text-sm">Tournaments you're currently managing</p>
                </div>
                
                {tournaments.length > 0 && (
                    hasMore ? (
                        <button
                            className="text-primary hover:text-primary/80 px-4 py-2 rounded-lg font-medium text-sm transition-all duration-300 border border-primary/20 hover:border-primary/40 bg-primary/5 hover:bg-primary/10"
                            onClick={onShowAll} 
                        >  
                            View All →
                        </button>
                    ) : (
                        <button
                            className="text-muted-foreground px-4 py-2 rounded-lg font-medium text-sm border border-border bg-muted/20 cursor-default"
                            disabled
                        >
                            All Tournaments Shown
                        </button>
                    )
                )}
            </div>

            {tournaments.length > 0 ? (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
                        {/* Quick Create Card - Optional UX improvement */}
                        <div 
                            onClick={onCreate}
                            className="group flex flex-col items-center justify-center h-full min-h-[300px] border-2 border-dashed border-border rounded-2xl hover:border-primary/50 hover:bg-primary/5 cursor-pointer transition-all duration-300"
                        >
                            <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-4 group-hover:scale-110 transition-transform">
                                <Plus size={24} />
                            </div>
                            <h3 className="font-semibold text-foreground">Create New</h3>
                            <p className="text-sm text-muted-foreground mt-1">Host a new tournament</p>
                        </div>

                        {tournaments.map((tournament, index) => (
                            <TournamentCard
                                key={tournament._id}
                                tournament={tournament}
                                type="manage"
                                index={index}
                                onAction={() => navigate(`/manager/tournaments/${tournament._id}/manage`)}
                                onEdit={() => onEdit(tournament)}
                                onCancel={onCancel}
                            />
                        ))}
                    </div>

                    {hasMore && (
                        <div className="flex justify-center mt-10">
                            <button
                                onClick={onShowAll}
                                className="px-8 py-3 bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl transition-all font-medium shadow-lg shadow-primary/20 transform hover:-translate-y-0.5"
                            >
                                Show All {tournaments.length} Tournaments
                            </button>
                        </div>
                    )}
                </>
            ) : (
                <div className="py-12">
                    <EmptyState
                        title="No tournaments found"
                        message="You haven't created any tournaments yet."
                        subtitle="Get started by hosting your first event."
                        buttonText="Create Your First Tournament"
                        onAction={onCreate}
                        titleSize="text-xl"
                        messageSize="text-base"
                        subtitleSize="text-sm"
                        // Custom icon for empty state if supported
                        icon={<div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4"><Plus className="text-muted-foreground" size={32}/></div>}
                    />
                </div>
            )}
        </section>
    );
}