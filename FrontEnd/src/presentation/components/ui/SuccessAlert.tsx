const SuccessAlert: React.FC<{ message: string; onDismiss?: () => void }> = ({
    message,
    onDismiss
}) => (
    <div className="flex items-center p-4 mb-4 text-green-800 border border-green-300 rounded-lg bg-green-50">
        <svg className="flex-shrink-0 w-4 h-4 mr-2" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
        </svg>
        <span className="sr-only">Success</span>
        <div className="text-sm font-medium">{message}</div>
        {onDismiss && (
            <button
                type="button"
                className="ml-auto -mx-1.5 -my-1.5 bg-green-50 text-green-500 rounded-lg focus:ring-2 focus:ring-green-400 p-1.5 hover:bg-green-200 inline-flex items-center justify-center h-8 w-8"
                onClick={onDismiss}
            >
                <span className="sr-only">Close</span>
                <svg className="w-3 h-3" aria-hidden="true" fill="none" viewBox="0 0 14 14">
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
                </svg>
            </button>
        )}
    </div>
);

export default SuccessAlert;