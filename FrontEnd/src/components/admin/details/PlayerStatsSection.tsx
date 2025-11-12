interface PlayerStatsSectionProps {
    battingStyle: string;
    bowlingStyle: string;
    position: string;
}

const PlayerStatsSection = ({ battingStyle, bowlingStyle, position }: PlayerStatsSectionProps) => {
    return (
        <div>
            <div className="flex items-center gap-2 mb-4">
                <div className="w-1.5 h-6 bg-emerald-500 rounded-full"></div>
                <h2 className="text-2xl font-bold text-emerald-400">Tournament Statistics</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                <StatCard label="Batting Style" value={battingStyle} color="emerald" subtitle="Batting style for the player" />
                <StatCard label="Bowling Style" value={bowlingStyle} color="blue" subtitle="Bowling style for the player" />
                <StatCard label="Playing Position" value={position} color="purple" subtitle="Favorite playing position" />
            </div>
        </div>
    );
};

const StatCard = ({ label, value, color, subtitle, }: { label: string; value: string; color: string; subtitle?: string; }) => (
    <div className={`bg-gradient-to-br from-${color}-500/10 to-${color}-600/5 rounded-lg p-4`}>
        <h3 className="text-xs uppercase text-neutral-400 font-semibold mb-1">
            {label}
        </h3>
        <p className={`text-2xl font-bold text-${color}-400`}>{value}</p>
        {subtitle && <p className="text-xs text-neutral-400 mt-1">{subtitle}</p>}
    </div>
);

export default PlayerStatsSection;