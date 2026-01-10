import { useEffect } from 'react';
import { ArrowLeft, RefreshCw, AlertCircle } from 'lucide-react';
import { useNavigate, useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from '../../hooks/hooks';
import { getMyTeamDetails } from '../../features/player/playerThunks';
import { clearSelectedTeam, setSelectedTeam } from '../../features/player/Teams/TeamSlice';
import PlayerLayout from '../layout/PlayerLayout';
import LoadingOverlay from '../../components/shared/LoadingOverlay';
import TeamHeader from './TeamHeader'; 
import TeamStats from './TeamStats';
import TeamMemberCard from './TeamMemberCard';

const ViewTeam = () => {
    const { teamId } = useParams();
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    
    // Selectors
    const allTeams = useAppSelector((state) => state.playerTeams.allTeams);
    const team = useAppSelector((state) => state.playerTeams.selectedTeam);
    const loading = useAppSelector((state) => state.player.loading);

    // Initial Load Logic
    useEffect(() => {
        if (!teamId) return;
        
        const existingTeam = allTeams.find((t) => t._id === teamId);
        
        if (existingTeam) {
            dispatch(setSelectedTeam(existingTeam));
        } else {
            dispatch(getMyTeamDetails(teamId));
        }
        
        // Cleanup on unmount
        return () => {
            dispatch(clearSelectedTeam());
        };
    }, [teamId, allTeams, dispatch]);

    // Error / Not Found State
    if (!loading && !team) {
        return (
            <PlayerLayout>
                <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
                    <div className="p-4 bg-destructive/10 rounded-full text-destructive mb-2">
                        <AlertCircle size={48} />
                    </div>
                    <h3 className="text-xl font-bold text-foreground">Team not found</h3>
                    <button
                        onClick={() => teamId && dispatch(getMyTeamDetails(teamId))}
                        className="flex items-center gap-2 px-6 py-2.5 bg-primary text-primary-foreground rounded-xl font-medium hover:bg-primary/90 transition-all"
                    >
                        <RefreshCw size={18} /> Retry
                    </button>
                </div>
            </PlayerLayout>
        );
    }

    return (
        <PlayerLayout>
            <LoadingOverlay show={loading} />
            
            {team && (
                <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    
                    {/* Navigation */}
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors group"
                    >
                        <div className="p-1 rounded-full group-hover:bg-muted transition-colors">
                            <ArrowLeft size={18} />
                        </div>
                        Back to My Teams
                    </button>

                    {/* Main Layout Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                        
                        {/* Left Column: Team Profile & Stats */}
                        <div className="lg:col-span-1 space-y-6">
                            <TeamHeader team={team} />
                            <TeamStats team={team} />
                        </div>

                        {/* Right Column: Roster */}
                        <div className="lg:col-span-2 space-y-6">
                            <div className="flex items-center justify-between">
                                <h2 className="text-xl font-bold text-foreground">Team Roster</h2>
                                <span className="text-sm font-medium text-muted-foreground bg-muted px-3 py-1 rounded-full">
                                    {team.membersCount} / {team.maxPlayers} Members
                                </span>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {team.members
                                    .filter(m => m.approvalStatus === 'approved')
                                    .map((member) => (
                                        <TeamMemberCard key={member.playerId} member={member} />
                                    ))
                                }
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </PlayerLayout>
    );
};

export default ViewTeam;