import { AlertCircle } from 'lucide-react';

interface RulesTabProps {
    rules: string[];
}

const RulesTab = ({ rules }: RulesTabProps) => {
    return (
        <div className="space-y-6 animate-in fade-in duration-300">
            <div className="flex items-center gap-3 p-4 bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 rounded-lg border border-yellow-500/20 text-sm">
                <AlertCircle className="w-5 h-5 shrink-0" />
                <span>Violation of these rules may result in immediate disqualification.</span>
            </div>
            <div className="space-y-1">
                {rules.length > 0 ? (
                    rules.map((rule, index) => (
                        <div key={index} className="group flex gap-4 p-4 border-b border-border hover:bg-muted/30 transition-colors">
                            <span className="font-mono text-muted-foreground/50 text-lg">{String(index + 1).padStart(2, '0')}</span>
                            <p className="text-foreground leading-relaxed">{rule}</p>
                        </div>
                    ))
                ) : <div className="text-center py-12 text-muted-foreground">No rules found.</div>}
            </div>
        </div>
    );
};

export default RulesTab;