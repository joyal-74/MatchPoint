import { Check } from "lucide-react";

const StepIndicator = ({ current, total }: { current: number; total: number }) => (
    <div className="flex lg:flex-col gap-3 md:gap-8 flex-1 justify-end lg:justify-start">
        {Array.from({ length: total }, (_, i) => i + 1).map((s) => (
            <div key={s} className={`flex items-center gap-3 transition-all ${current === s ? 'scale-105' : 'opacity-40'}`}>
                <div className={`w-8 h-8 md:w-10 md:h-10 rounded-full border flex items-center justify-center text-xs font-bold transition-all
                    ${current === s ? 'bg-primary border-primary text-primary-foreground shadow-lg shadow-primary/30' : current > s ? 'bg-primary/20 border-primary/20 text-primary' : 'bg-background border-border text-muted-foreground'}`}>
                    {current > s ? <Check className="w-4 h-4" /> : s}
                </div>
                <div className="hidden lg:flex flex-col">
                    <p className={`text-[10px] uppercase tracking-widest font-black ${current === s ? 'text-primary' : 'text-muted-foreground'}`}>Step 0{s}</p>
                    <p className="text-sm font-bold text-foreground">{s === 1 ? 'Identity' : s === 2 ? 'Stats' : 'Security'}</p>
                </div>
            </div>
        ))}
    </div>
);

export default StepIndicator;