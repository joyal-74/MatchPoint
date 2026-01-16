import { Hash } from "lucide-react";

export const EmptyState = ({ onAction }: { onAction: () => void }) => (
    <div className="flex-1 flex flex-col items-center justify-center text-center bg-card/50">
        <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-6 ring-1 ring-border">
            <Hash className="w-10 h-10 text-muted-foreground" />
        </div>
        <h3 className="text-xl font-semibold text-foreground mb-2">Select a Team</h3>
        <p className="text-muted-foreground max-w-sm leading-relaxed mb-8">
            Choose a team from the sidebar to start collaborating with your squad.
        </p>
        <button onClick={onAction} className="px-6 py-2.5 bg-primary text-primary-foreground hover:opacity-90 rounded-lg font-medium transition-all shadow-md">
            Browse Teams
        </button>
    </div>
);