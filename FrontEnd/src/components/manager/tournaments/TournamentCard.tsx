import { Calendar, DollarSign, MapPin, Users } from "lucide-react";
import { completedColorScheme, getColorScheme } from "../teams/TeamCard/teamColors";
import { ActionButtons } from "./TournamentCard/ActionButtons";
import { CardActionButton } from "./TournamentCard/CardActionButton";
import { InfoRow } from "./TournamentCard/InfoRow";
import { StatusBadge } from "./TournamentCard/StatusBadge";
import PrizePoolBadge from "./TournamentCard/PricePoolBadge";


interface TournamentCardProps {
    title: string;
    date: string;
    venue: string;
    teams: string;
    fee: string;
    status: "upcoming" | "ongoing" | "completed";
    type: "manage" | "explore";
    index: number;
}

export default function TournamentCard({ title, date, venue, teams, fee, status, type, index, }: TournamentCardProps) {
    const colorScheme = status === "completed" ? completedColorScheme : getColorScheme(index);

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
                    <h3 className="font-bold text-lg text-white pr-2 line-clamp-2 leading-tight">{title}</h3>
                    {type === "manage" && <ActionButtons status={status} colorScheme={colorScheme} />}
                </div>

                {/* Info */}
                <div className="space-y-3 mb-4">
                    <InfoRow icon={<Calendar size={14} />} label={date} completed={status === "completed"} />
                    <InfoRow icon={<MapPin size={14} />} label={venue} completed={status === "completed"} />
                    <InfoRow icon={<Users size={14} />} label={teams} completed={status === "completed"} />
                    <InfoRow icon={<DollarSign size={14} />} label={`${fee} Entry Fee`} completed={status === "completed"} />

                </div>

                <PrizePoolBadge colorScheme={colorScheme} amount="₹50,000" />

                <div className="flex items-center justify-between mt-4">
                    <StatusBadge status={status} colorScheme={colorScheme} />
                    <CardActionButton status={status} type={type} colorScheme={colorScheme} />
                </div>
            </div>
        </div>
    );
}