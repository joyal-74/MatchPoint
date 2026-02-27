export function PaymentSummary({ entryFee }: { entryFee: number }) {
    return (
        <div className="bg-muted/40 rounded-xl p-4 border border-border/50 mb-4">
            <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Total Registration Fee</span>
                <span className="text-2xl font-black text-success">₹{entryFee}</span>
            </div>
        </div>
    );
}