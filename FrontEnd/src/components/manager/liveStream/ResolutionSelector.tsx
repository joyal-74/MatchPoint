const RESOLUTIONS = {
    auto: { label: "Auto" },
    "360p": { width: 640, height: 360, bitrate: 500_000 },
    "720p": { width: 1280, height: 720, bitrate: 1_500_000 },
    "1080p": { width: 1920, height: 1080, bitrate: 3_000_000 },
};

export const ResolutionSelector = ({ value, onChange }) => (
    <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="border rounded p-2"
    >
        {Object.entries(RESOLUTIONS).map(([key, v]) => (
            <option key={key} value={key}>{v.label || key}</option>
        ))}
    </select>
);