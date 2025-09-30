import TertiaryButton from "../../ui/TertiaryButton"; 

interface TeamsHeaderProps {
    onCreateClick: () => void;
    title?: string;
    subtitle?: string;
}

export default function TeamsHeader({
    onCreateClick,
    title = "Create & Manage Teams",
    subtitle = "Organize your teams & join tournaments",
}: TeamsHeaderProps) {
    return (
        <div className="flex justify-between items-center mb-6 p-4 rounded-xl bg-gradient-to-r from-neutral-800/50 to-neutral-900/30 border border-neutral-700/50">
            <div>
                <h1 className="text-xl font-semibold mb-1">{title}</h1>
                <p className="text-neutral-400 text-sm">{subtitle}</p>
            </div>
            <TertiaryButton onClick={onCreateClick} className="px-4 py-2 text-sm">
                Create Team +
            </TertiaryButton>
        </div>
    );
}
