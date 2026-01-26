import { motion } from 'framer-motion';

export const FullStatsOverlay = ({ data = { teamA: 'WAR', teamB: 'TIT', scoreA: '154/4', scoreB: 'Yet to bat', rr: '9.42' } }) => (
    <motion.div
        initial={{ x: 100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        className="w-64 bg-card/90 backdrop-blur-2xl border border-border p-6 rounded-[2rem] shadow-2xl flex flex-col gap-4"
    >
        <h4 className="text-[10px] font-black uppercase text-primary tracking-widest border-b border-border pb-2">Match Summary</h4>
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <span className="text-xs font-bold">{data.teamA}</span>
                <span className="text-xs font-mono font-black text-primary">{data.scoreA}</span>
            </div>
            <div className="flex justify-between items-center opacity-50">
                <span className="text-xs font-bold">{data.teamB}</span>
                <span className="text-xs font-mono">{data.scoreB}</span>
            </div>
        </div>
        <div className="mt-4 pt-4 border-t border-border flex justify-between items-center">
            <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-tighter">Current RR</span>
            <span className="text-sm font-black italic">{data.rr}</span>
        </div>
    </motion.div>
);