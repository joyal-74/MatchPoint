import ManagerLayout from '../../../pages/layout/ManagerLayout'

interface ProfileErrorProps {
    error: string,
    onAction: () => void;
}

const ProfileError = ({error, onAction} : ProfileErrorProps) => {
    return (
        <>
            if (error) {
                <ManagerLayout>
                    <div className="min-h-40 bg-[var(--color-background)] w-6xl rounded-xl flex items-center justify-center">
                        <div className="text-center text-red-500">
                            <p>Error loading profile: {error}</p>
                            <button
                                onClick={onAction}
                                className="mt-4 px-4 py-2 bg-[var(--color-primary)] text-white rounded hover:bg-[var(--color-primary-dark)]"
                            >
                                Retry
                            </button>
                        </div>
                    </div>
                </ManagerLayout>
            }
        </>
    )
}

export default ProfileError