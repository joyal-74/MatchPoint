interface ProfileActionsProps {
    onSave: () => void;
    onCancel: () => void;
}

const ProfileActions: React.FC<ProfileActionsProps> = ({ onSave, onCancel }) => (
    <div className="flex gap-2 items-end justify-start pl-8 mt-5">
        <button
            onClick={onSave}
            className="px-3 py-2 text-sm  bg-gradient-to-br from-purple-950 to-purple-900 text-white rounded-lg font-medium transition-colors"
        >
            Save Changes
        </button>
        <button
            onClick={onCancel}
            className="px-3 py-2 text-sm rounded-lg font-medium transition-colors"
            style={{
                backgroundColor: "var(--color-surface-secondary)",
                color: "var(--color-text-primary)",
            }}
        >
            Cancel
        </button>
    </div>
);

export default ProfileActions;