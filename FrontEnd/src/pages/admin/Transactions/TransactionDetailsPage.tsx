import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
    ChevronRight, ArrowUpRight, ArrowDownLeft, Printer, 
    Download, ExternalLink, Copy, AlertCircle, CheckCircle, Clock 
} from 'lucide-react';

// Layout & Components
import AdminLayout from '../../layout/AdminLayout';


// Redux
import { useAppDispatch, useAppSelector } from '../../../hooks/hooks';
import { fetchTransactionDetails } from '../../../features/admin/transaction/transactionThunks';
import type { Wallet } from '../../../features/admin/transaction/transactionTypes'; 
import LoadingOverlay from '../../../components/shared/LoadingOverlay';
import { DetailItem } from '../../../components/admin/shared/DetailItem';

const TransactionDetailsPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    const { selectedTransaction, loading } = useAppSelector((state) => state.adminTransactions);

    useEffect(() => {
        if (id) {
            dispatch(fetchTransactionDetails(id));
        }
    }, [dispatch, id]);

    // --- Helpers ---
    const getStatusColor = (status: string) => {
        switch (status) {
            case 'SUCCESS': return 'text-green-600 bg-green-50 border-green-200';
            case 'PENDING': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
            case 'FAILED': return 'text-red-600 bg-red-50 border-red-200';
            default: return 'text-gray-600 bg-gray-50 border-gray-200';
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'SUCCESS': return <CheckCircle className="w-5 h-5" />;
            case 'PENDING': return <Clock className="w-5 h-5" />;
            case 'FAILED': return <AlertCircle className="w-5 h-5" />;
            default: return null;
        }
    };

    const getOwnerDisplay = (wallet?: Wallet | null) => {
        if (!wallet || !wallet.ownerId) return { name: "External / System", sub: "N/A" };
        
        const name = wallet.ownerId.name || wallet.ownerId.title || 
                    (wallet.ownerId.firstName ? `${wallet.ownerId.firstName} ${wallet.ownerId.lastName}` : "Unknown");
        
        const sub = wallet.ownerId.email || wallet.ownerType;
        return { name, sub };
    };

    // --- Loading / Error States ---
    if (loading && !selectedTransaction) return <LoadingOverlay show={true} />;
    
    if (!selectedTransaction) {
        return (
            <AdminLayout>
                <div className="flex flex-col items-center justify-center h-[60vh] text-muted-foreground">
                    <AlertCircle className="w-12 h-12 mb-4 opacity-50" />
                    <h2 className="text-lg font-medium text-foreground">Transaction not found</h2>
                    <button onClick={() => navigate(-1)} className="mt-4 text-primary hover:underline">Go Back</button>
                </div>
            </AdminLayout>
        );
    }

    const fromOwner = getOwnerDisplay(selectedTransaction.fromWalletId);
    const toOwner = getOwnerDisplay(selectedTransaction.toWalletId);
    const isProfit = ['COMMISSION', 'SUBSCRIPTION'].includes(selectedTransaction.type);

    return (
        <AdminLayout>
            <div className="bg-background min-h-screen pb-12">
                
                {/* Header */}
                <div className="bg-card border-b border-border sticky top-0 z-10 px-6 py-4 flex items-center justify-between shadow-sm">
                    <div className="flex items-center gap-4">
                        <button onClick={() => navigate(-1)} className="p-2 hover:bg-accent rounded-full transition-colors">
                            <ChevronRight className="w-5 h-5 rotate-180 text-muted-foreground" />
                        </button>
                        <div>
                            <h1 className="text-lg font-semibold text-foreground">Transaction Details</h1>
                            <p className="text-xs text-muted-foreground font-mono">{selectedTransaction._id}</p>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <button className="p-2 border border-border rounded-lg hover:bg-accent text-muted-foreground transition-colors" title="Print Receipt">
                            <Printer className="w-4 h-4" />
                        </button>
                        <button className="p-2 border border-border rounded-lg hover:bg-accent text-muted-foreground transition-colors" title="Download JSON">
                            <Download className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                <div className="max-w-4xl mx-auto px-6 py-8">
                    
                    {/* Main Receipt Card */}
                    <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
                        
                        {/* Status Banner */}
                        <div className={`px-8 py-6 border-b border-border flex items-center justify-between ${isProfit ? 'bg-emerald-50/50' : 'bg-card'}`}>
                            <div className="flex items-center gap-4">
                                <div className={`p-3 rounded-full ${getStatusColor(selectedTransaction.status)}`}>
                                    {getStatusIcon(selectedTransaction.status)}
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Total Amount</p>
                                    <h2 className={`text-3xl font-bold ${isProfit ? 'text-emerald-600' : 'text-foreground'}`}>
                                        ₹{selectedTransaction.amount.toLocaleString()}
                                    </h2>
                                </div>
                            </div>
                            <div className={`px-4 py-1.5 rounded-full text-sm font-bold border ${getStatusColor(selectedTransaction.status)}`}>
                                {selectedTransaction.status}
                            </div>
                        </div>

                        {/* Transaction Flow Diagram */}
                        <div className="p-8 grid grid-cols-1 md:grid-cols-3 gap-8 items-center border-b border-border bg-muted/20">
                            {/* Sender */}
                            <div className="text-center md:text-left">
                                <p className="text-xs text-muted-foreground uppercase mb-1">From</p>
                                <p className="font-semibold text-foreground text-lg">{fromOwner.name}</p>
                                <p className="text-sm text-muted-foreground truncate">{fromOwner.sub}</p>
                                {selectedTransaction.fromWalletId && (
                                    <span className="inline-block mt-2 text-[10px] bg-gray-100 text-gray-500 px-2 py-0.5 rounded border border-gray-200">
                                        Wallet: ...{selectedTransaction.fromWalletId._id.slice(-6)}
                                    </span>
                                )}
                            </div>

                            {/* Arrow */}
                            <div className="flex flex-col items-center justify-center text-muted-foreground opacity-50">
                                <div className="border-t-2 border-dashed border-current w-full relative top-3"></div>
                                {isProfit ? <ArrowDownLeft className="w-6 h-6 z-10 bg-muted p-1 rounded-full" /> : <ArrowUpRight className="w-6 h-6 z-10 bg-muted p-1 rounded-full" />}
                            </div>

                            {/* Receiver */}
                            <div className="text-center md:text-right">
                                <p className="text-xs text-muted-foreground uppercase mb-1">To</p>
                                <p className="font-semibold text-foreground text-lg">{toOwner.name}</p>
                                <p className="text-sm text-muted-foreground truncate">{toOwner.sub}</p>
                                {selectedTransaction.toWalletId && (
                                    <span className="inline-block mt-2 text-[10px] bg-gray-100 text-gray-500 px-2 py-0.5 rounded border border-gray-200">
                                        Wallet: ...{selectedTransaction.toWalletId._id.slice(-6)}
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Meta Details Grid */}
                        <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-12">
                            <DetailItem label="Transaction Type" value={selectedTransaction.type.replace('_', ' ')} />
                            <DetailItem label="Payment Provider" value={selectedTransaction.paymentProvider} />
                            
                            <div className="group relative">
                                <p className="text-sm text-muted-foreground mb-1">Reference ID</p>
                                <div className="flex items-center gap-2">
                                    <span className="font-mono text-foreground font-medium">{selectedTransaction.paymentRefId || "N/A"}</span>
                                    {selectedTransaction.paymentRefId && (
                                        <Copy className="w-3 h-3 text-muted-foreground cursor-pointer hover:text-primary transition-colors" />
                                    )}
                                </div>
                            </div>

                            <DetailItem label="Date & Time" value={new Date(selectedTransaction.createdAt).toLocaleString()} />
                            
                            {selectedTransaction.metadata?.tournamentId && (
                                <div className="col-span-full mt-4 p-4 bg-blue-50/50 border border-blue-100 rounded-lg flex items-center justify-between group cursor-pointer hover:bg-blue-50 transition-colors">
                                    <div>
                                        <p className="text-xs text-blue-600 font-semibold uppercase mb-1">Linked Tournament</p>
                                        <p className="font-medium text-blue-900">{selectedTransaction.metadata.tournamentId.title}</p>
                                    </div>
                                    <ExternalLink className="w-4 h-4 text-blue-400 group-hover:text-blue-600" />
                                </div>
                            )}

                            {selectedTransaction.metadata?.description && (
                                <div className="col-span-full">
                                    <p className="text-sm text-muted-foreground mb-1">Description</p>
                                    <p className="text-foreground bg-muted p-3 rounded-md text-sm">
                                        {selectedTransaction.metadata.description}
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>

                </div>
            </div>
        </AdminLayout>
    );
};

export default TransactionDetailsPage;