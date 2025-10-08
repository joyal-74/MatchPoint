import { useNavigate } from "react-router-dom";
import type { Status, Tournament } from "../../../../features/manager/managerTypes";
import { setSelectedTournament } from "../../../../features/manager/Tournaments/tournamentSlice";
import { useAppDispatch } from "../../../../hooks/hooks";
import type { ColorScheme } from "../../teams/TeamCard/teamColors";

interface CardActionButtonProps {
    status: Status
    type: "manage" | "explore";
    colorScheme: ColorScheme;
    tournament: Tournament;
}

const CardActionButton = ({ status, type, colorScheme, tournament }: CardActionButtonProps) => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const handleViewDetails = () => {
        dispatch(setSelectedTournament(tournament));
        navigate(`/manager/tournaments/${tournament._id}/${type}`);
    };

    const isExplore = type === "explore";
    const isDisabled = isExplore && status === "ended";

    return (
        <button
            disabled={isDisabled}
            className={` px-4 py-1.5 text-sm font-medium rounded-lg transition-all duration-200 border ${isDisabled
                ? "bg-neutral-600/30 text-neutral-400 border-neutral-600/30 cursor-not-allowed"
                : `${colorScheme.buttonBg} ${colorScheme.text} ${colorScheme.buttonBorder} ${colorScheme.buttonHoverBg}
                     ${colorScheme.buttonHoverBorder} hover:scale-105`} `}
            onClick={handleViewDetails}
        >
            {isExplore ? (isDisabled ? "View Details" : "Register") : "View Details"}
        </button>
    );
}

export default CardActionButton;