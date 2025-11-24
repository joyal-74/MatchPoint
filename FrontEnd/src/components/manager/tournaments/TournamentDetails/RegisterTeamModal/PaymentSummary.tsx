export default function PaymentSummary({ entryFee }: { entryFee: number }) {
    return (
        <div className="bg-neutral-800/50 rounded-xl p-4 border border-neutral-700/50">
            <div className="flex justify-between items-center mb-2">
                <span className="text-neutral-400">Entry Fee:</span>
                <span className="text-2xl font-bold text-green-400">₹{entryFee}</span>
            </div>
        </div>
    );
}
