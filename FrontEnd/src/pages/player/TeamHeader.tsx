import type { Team } from "../../features/player/playerTypes";

const TeamHeader = ({ team }: { team: Team }) => (
    <div className="flex flex-col md:flex-row items-center md:items-end gap-8 pb-4 border-b border-border">
        <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-tr from-primary to-primary/20 rounded-[32px] blur opacity-25 group-hover:opacity-50 transition duration-500" />
            <img 
                src={team.logo || '/default-team.png'} 
                className="w-28 h-28 rounded-[28px] object-cover border-4 border-background bg-card relative z-10 shadow-xl" 
                alt="" 
            />
        </div>

        <div className="flex-1 text-center md:text-left space-y-3">
            <div className="flex flex-wrap justify-center md:justify-start gap-2">
                <span className="px-3 py-1 bg-primary text-primary-foreground text-[10px] font-black uppercase tracking-widest rounded-full">
                    {team.phase}
                </span>
                <span className="px-3 py-1 bg-muted text-muted-foreground text-[10px] font-black uppercase tracking-widest rounded-full border border-border">
                    Founded 2024
                </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black tracking-tight text-foreground uppercase italic italic-none">
                {team.name}
            </h1>
        </div>

        <div className="hidden md:flex gap-4">
            <button className="h-12 px-8 rounded-2xl bg-foreground text-background font-bold text-sm hover:scale-[1.02] transition-transform active:scale-[0.98]">
                Manage Team
            </button>
        </div>
    </div>
);

export default TeamHeader;