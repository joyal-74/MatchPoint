import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import ManagerLayout from "../../../pages/layout/ManagerLayout";
import { TransactionList } from "./TransactionList";
import { useAppSelector } from "../../../hooks/hooks";

export default function FinancialHistory() {
    const navigate = useNavigate();
    const { transactions, loading } = useAppSelector((state) => state.financials);

    return (
        <ManagerLayout>
            <div className="bg-background ">
                {/* Fixed Sub-Header */}
                <div className="bg-card sticky top-0 z-30">
                    <div className="mx-auto px-4 h-16 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <button 
                                onClick={() => navigate(-1)}
                                className="p-2 hover:bg-muted rounded-full transition-colors"
                            >
                                <ArrowLeft size={20} />
                            </button>
                            <h1 className="font-bold text-lg">Transaction History</h1>
                        </div>
                    </div>
                </div>

                <div className="mx-auto px-4 py-8">
                    <div className="bg-card overflow-hidden shadow-sm">
                        <TransactionList transactions={transactions} />
                        
                        {/* Infinite Scroll Trigger Area */}
                        <div className="py-10 flex justify-center">
                            {loading ? (
                                <div className="flex items-center gap-2 text-muted-foreground animate-pulse">
                                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce" />
                                    <span className="text-xs font-bold tracking-widest uppercase">Loading more...</span>
                                </div>
                            ) : (
                                <p className="text-xs text-muted-foreground font-medium italic">
                                    You've reached the end of your history.
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </ManagerLayout>
    );
}