import { Calendar, MapPin, Users } from "lucide-react";
import { completedColorScheme, getColorScheme } from "../teams/TeamCard/teamColors";
import { ActionButtons } from "./TournamentCard/ActionButtons";
import { CardActionButton } from "./TournamentCard/CardActionButton";
import { InfoRow } from "./TournamentCard/InfoRow";
import { StatusBadge } from "./TournamentCard/StatusBadge";
import PrizePoolBadge from "./TournamentCard/PricePoolBadge";
import type { Tournament } from "../../../features/manager/managerTypes";
import { FaRupeeSign } from "react-icons/fa";


interface TournamentCardProps {
    tournament: Tournament;
    type: "manage" | "explore";
    index: number;
    onEdit?: () => void;
}

const TournamentCard: React.FC<TournamentCardProps> = ({ tournament, type, index, onEdit }: TournamentCardProps) => {
    if (!tournament) return null;
    const { name, startDate, location, maxTeams, entryFee, status } = tournament;
    const colorScheme = status === "ended" ? completedColorScheme : getColorScheme(index);

    return (
        <div
            className={` group relative p-6 rounded-2xl border backdrop-blur-sm bg-gradient-to-br ${colorScheme.cardGradient} ${colorScheme.cardBorder}
                transition-all duration-300 hover:scale-[1.02] hover:shadow-xl
            `}
        > {status === "ongoing" && (
            <div
                className={` absolute inset-0 rounded-2xl bg-gradient-to-br ${colorScheme.bg} 
                    opacity-0 group-hover:opacity-100 transition-opacity duration-300
                `}
            />
        )}

            <div className="relative z-10">
                <div className="flex justify-between items-start mb-4">
                    <h3 className="font-bold text-lg text-white pr-2 line-clamp-2 leading-tight">{name}</h3>
                    {type === "manage" && onEdit && (
                        <ActionButtons
                            status={status}
                            colorScheme={colorScheme}
                            openModal={onEdit}
                        />
                    )}
                    </div>

                <div className="space-y-3 mb-4">
                    <InfoRow icon={<Calendar size={14} />} label={new Date(startDate).toLocaleDateString()} completed={status === "ended"} />
                    <InfoRow icon={<MapPin size={14} />} label={location} completed={status === "ended"} />
                    <InfoRow icon={<Users size={14} />} label={`${maxTeams.toString()} Teams`} completed={status === "ended"} />
                    <InfoRow icon={<FaRupeeSign size={14} />} label={`${entryFee} Entry Fee`} completed={status === "ended"} />

                </div>

                <PrizePoolBadge colorScheme={colorScheme} amount="₹50,000" />

                <div className="flex items-center justify-between mt-4">
                    <StatusBadge status={status} colorScheme={colorScheme} />
                    <CardActionButton status={status} type={type} colorScheme={colorScheme} />
                </div>
            </div>
        </div>
    );
};

export default TournamentCard;