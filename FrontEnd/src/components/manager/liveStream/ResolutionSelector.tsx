import { RESOLUTIONS, type ResolutionKey } from "../../../constants/resolutions";

type ResolutionSelectorProps = {
    value: ResolutionKey;
    onChange: (value: ResolutionKey) => void;
};

export const ResolutionSelector = ({ value, onChange }: ResolutionSelectorProps) => (
    <select
        value={value}
        onChange={(e) => onChange(e.target.value as ResolutionKey)}
        className="border rounded p-2"
    >
        {Object.entries(RESOLUTIONS).map(([key, v]) => (
            <option key={key} value={key}>
                {"label" in v ? v.label : key}
            </option>
        ))}
    </select>
);