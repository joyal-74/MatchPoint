interface ModalBackdropProps {
    onClick: () => void;
}

export default function ModalBackdrop({ onClick }: ModalBackdropProps) {
    return (
        <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
            onClick={onClick}
        />
    );
}