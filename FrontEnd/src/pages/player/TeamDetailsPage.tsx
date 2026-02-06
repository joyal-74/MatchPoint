import { useEffect } from 'react';
import { Users, Globe, MapPin } from 'lucide-react';
import { useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from '../../hooks/hooks';
import { getMyTeamDetails } from '../../features/player/playerThunks';
import { clearSelectedTeam, setSelectedTeam } from '../../features/player/Teams/TeamSlice';
import PlayerLayout from '../layout/PlayerLayout';
import LoadingOverlay from '../../components/shared/LoadingOverlay';
import TeamMemberCard from './TeamMemberCard';

const ViewTeam = () => {
    const { teamId } = useParams();
    const dispatch = useAppDispatch();
    const allTeams = useAppSelector((state) => state.playerTeams.allTeams);
    const team = useAppSelector((state) => state.playerTeams.selectedTeam);
    const loading = useAppSelector((state) => state.player.loading);

    useEffect(() => {
        if (!teamId) return;
        const existingTeam = allTeams.find((t) => t._id === teamId);
        if (existingTeam) {
            dispatch(setSelectedTeam(existingTeam))
        } else {
            dispatch(getMyTeamDetails(teamId));
        }
        return () => { dispatch(clearSelectedTeam()); };
}, [teamId, allTeams, dispatch]);

return (
    <PlayerLayout>
        <LoadingOverlay show={loading} />

        {team && (
            <div className="mx-auto px-6 animate-in fade-in duration-500">

                {/* 1. Ultra-Lean Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-border pb-8 mb-8">
                    <div className="flex items-center gap-6">
                        <div className="h-20 w-20 rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/20 shrink-0">
                            <img src={team.logo || '/default.png'} className="h-16 w-16 object-cover rounded-xl" alt="" />
                        </div>
                        <div>
                            <h1 className="text-4xl font-black tracking-tight">{team.name}</h1>
                            <div className="flex items-center gap-4 mt-1 text-muted-foreground font-medium text-sm">
                                <span className="flex items-center gap-1.5"><Globe size={14} /> {team.sport}</span>
                                <span className="flex items-center gap-1.5"><MapPin size={14} /> {team.city}, {team.state}</span>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <span className="px-4 py-1.5 rounded-full bg-emerald-500/10 text-emerald-600 text-[10px] font-black uppercase tracking-widest border border-emerald-500/20">
                            {team.phase}
                        </span>
                    </div>
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-[1fr_300px] gap-10">
                    {/* 2. The Roster - Multi-Column Grid */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-3 px-1">
                            <Users size={20} className="text-primary" />
                            <h2 className="text-xl font-bold tracking-tight">Active Squad</h2>
                            <span className="text-xs font-bold bg-muted px-2 py-0.5 rounded text-muted-foreground">
                                {team.membersCount}/ {team.maxPlayers} Players
                            </span>
                        </div>

                        {/* This grid handles 15+ members beautifully */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                            {team.members?.filter(m => m.approvalStatus === 'approved').map((member) => (
                                <TeamMemberCard key={member.playerId} member={member} />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        )}
    </PlayerLayout>
);
};

export default ViewTeam;