import ManagementHeader from "../teams/TeamsHeader";

interface TournamentsHeaderProps {
    onCreateClick: () => void;
}

export default function TournamentsHeader({ onCreateClick }: TournamentsHeaderProps) {
    return (
        <ManagementHeader
            buttontitle="Create Tournament +"
            title="Manage & Explore Tournaments"
            onCreateClick={onCreateClick}
        />
    );
}