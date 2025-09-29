interface ProfileActionsProps {
    onSave: () => void;
    onCancel: () => void;
}

const ProfileActions: React.FC<ProfileActionsProps> = ({ onSave, onCancel }) => (
    <div className="flex gap-4 max-w-5xl mx-auto">
        <button
            onClick={onSave}
            className="px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium transition-colors"
        >
            Save Changes
        </button>
        <button
            onClick={onCancel}
            className="px-3 py-2 rounded-lg font-medium transition-colors"
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