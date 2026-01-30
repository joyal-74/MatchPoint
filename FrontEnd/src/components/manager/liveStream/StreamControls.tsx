type StreamControlsProps = {
    onStart: () => void;
    onStop: () => void;
    isLive: boolean;
};

export const StreamControls = ({ onStart, onStop, isLive, }: StreamControlsProps) => (
    <div className="flex gap-2">
        {!isLive ? (
            <button onClick={onStart} className="btn-primary">
                ▶ Start
            </button>
        ) : (
            <button onClick={onStop} className="btn-danger">
                ⏹ Stop
            </button>
        )}
    </div>
);