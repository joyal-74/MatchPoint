export const StreamControls = ({ onStart, onStop, isLive }) => (
    <div className="flex gap-2">
        {!isLive ? (
            <button onClick={onStart} className="btn-primary">▶ Start</button>
        ) : (
            <button onClick={onStop} className="btn-danger">⏹ Stop</button>
        )}
    </div>
);