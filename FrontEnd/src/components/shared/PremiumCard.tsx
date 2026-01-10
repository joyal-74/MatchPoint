import React from "react";
import { Sparkles, ArrowRight } from "lucide-react";

const PremiumCard: React.FC = () => (
    <div className="relative overflow-hidden rounded-xl border border-yellow-500/20 bg-gradient-to-br from-yellow-500/10 via-orange-500/5 to-background p-6 group cursor-pointer hover:border-yellow-500/40 transition-all">
        
        {/* Glow effect */}
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-24 h-24 bg-yellow-500/20 blur-2xl rounded-full group-hover:bg-yellow-500/30 transition-all"></div>

        <div className="flex items-start justify-between relative z-10">
            <div className="space-y-2">
                <div className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-yellow-500 fill-yellow-500/20" />
                    <h3 className="text-foreground font-semibold">Go Premium</h3>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                    Unlock exclusive analytics, unlimited teams, and priority support.
                </p>
                <div className="pt-2">
                    <button className="text-xs font-bold text-yellow-600 dark:text-yellow-400 flex items-center gap-1 group-hover:gap-2 transition-all">
                        Upgrade Now <ArrowRight size={12} />
                    </button>
                </div>
            </div>
        </div>
    </div>
);

export default PremiumCard;