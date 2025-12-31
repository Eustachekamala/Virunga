import { useState, useEffect } from 'react';
import { getDailySummary } from '../services/stockMovements';
import { generateDailyEntryReport, generateDailyExitReport } from '../services/pdfGenerator';
import { showSuccess } from '../components/ui/Toast';
import { format } from 'date-fns';
import { Calendar, FileDown, ArrowDownCircle, ArrowUpCircle, TrendingUp, Loader2, User, FileText, CheckCircle2 } from 'lucide-react';
import type { DailySummary, StockMovement } from '../types/movements';

const DailyViews = () => {
    const [activeTab, setActiveTab] = useState<'entries' | 'exits'>('entries');
    const [selectedDate, setSelectedDate] = useState(() => {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    });
    const [summary, setSummary] = useState<DailySummary | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let isMounted = true;

        const loadSummary = async () => {
            setLoading(true);
            try {
                const data = getDailySummary(new Date(selectedDate));
                if (isMounted) setSummary(data);
            } finally {
                if (isMounted) setLoading(false);
            }
        };

        loadSummary();

        return () => {
            isMounted = false;
        };
    }, [selectedDate]);


    const handleExport = () => {
        if (!summary) return;
        if (activeTab === 'entries') {
            generateDailyEntryReport(summary);
            showSuccess('Daily entry report downloaded');
        } else {
            generateDailyExitReport(summary);
            showSuccess('Daily exit report downloaded');
        }
    };

    const movements = activeTab === 'entries' ? summary?.entries || [] : summary?.exits || [];
    const netChange =
            (summary?.totalEntriesQuantity || 0) -
            (summary?.totalExitsQuantity || 0);


    return (
        <div className="space-y-8 animate-in fade-in duration-500 pb-20">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h2 className="text-3xl font-bold text-cocoa tracking-tight flex items-center gap-3">
                        Daily Summary
                    </h2>
                    <p className="text-cocoa/60 font-medium text-sm mt-1">
                        Overview of entries and exits for {format(new Date(selectedDate), 'MMMM do, yyyy')}
                    </p>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
                    <div className="relative w-full sm:w-auto">
                        <input
                            type="date"
                            value={selectedDate}
                            onChange={(e) => setSelectedDate(e.target.value)}
                            className="w-full px-4 py-3 bg-white/80 border border-cocoa/10 rounded-xl text-cocoa focus:ring-2 focus:ring-cocoa/20 outline-none transition-all font-medium cursor-pointer hover:bg-white"
                        />
                        <Calendar className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-cocoa/40 pointer-events-none" />
                    </div>

                    <button
                        onClick={handleExport}
                        disabled={!summary || movements.length === 0}
                        className="w-full sm:w-auto px-6 py-3 bg-cocoa text-gold hover:bg-cocoa/90 rounded-xl font-bold transition-all shadow-lg shadow-cocoa/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 active:scale-95"
                    >
                        <FileDown className="w-5 h-5" />
                        <span>Export PDF</span>
                    </button>
                </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="glass-panel p-6 rounded-2xl border-l-[6px] border-l-green-500 relative overflow-hidden group">
                    <div className="absolute -right-6 -top-6 w-24 h-24 bg-green-500/10 rounded-full blur-xl group-hover:scale-150 transition-transform duration-500"></div>
                    <div className="flex justify-between items-start relative z-10">
                        <div>
                            <p className="text-xs font-bold text-green-600 uppercase tracking-widest mb-1">Total Entries</p>
                            <h3 className="text-4xl font-extrabold text-cocoa">{summary?.entries.length || 0}</h3>
                            <p className="text-sm text-green-700 font-bold mt-2 bg-green-100/50 inline-block px-2 py-1 rounded-md">+{summary?.totalEntriesQuantity || 0} units</p>
                        </div>
                        <div className="bg-green-100 p-3 rounded-xl">
                            <ArrowDownCircle className="w-6 h-6 text-green-600" />
                        </div>
                    </div>
                </div>

                <div className="glass-panel p-6 rounded-2xl border-l-[6px] border-l-orange-500 relative overflow-hidden group">
                    <div className="absolute -right-6 -top-6 w-24 h-24 bg-orange-500/10 rounded-full blur-xl group-hover:scale-150 transition-transform duration-500"></div>
                    <div className="flex justify-between items-start relative z-10">
                        <div>
                            <p className="text-xs font-bold text-orange-600 uppercase tracking-widest mb-1">Total Exits</p>
                            <h3 className="text-4xl font-extrabold text-cocoa">{summary?.exits.length || 0}</h3>
                            <p className="text-sm text-orange-700 font-bold mt-2 bg-orange-100/50 inline-block px-2 py-1 rounded-md">-{summary?.totalExitsQuantity || 0} units</p>
                        </div>
                        <div className="bg-orange-100 p-3 rounded-xl">
                            <ArrowUpCircle className="w-6 h-6 text-orange-600" />
                        </div>
                    </div>
                </div>

                <div className={`glass-panel p-6 rounded-2xl border-l-[6px] relative overflow-hidden group ${netChange >= 0
                    ? 'border-l-blue-500'
                    : 'border-l-red-500'
                    }`}>
                    <div className={`absolute -right-6 -top-6 w-24 h-24 rounded-full blur-xl group-hover:scale-150 transition-transform duration-500 ${netChange >= 0 ? 'bg-blue-500/10' : 'bg-red-500/10'}`}></div>

                    <div className="flex justify-between items-start relative z-10">
                        <div>
                            <p className={`text-xs font-bold uppercase tracking-widest mb-1 ${netChange >= 0 ? 'text-blue-600' : 'text-red-600'}`}>Net Change</p>
                            <h3 className={`text-4xl font-extrabold ${netChange >= 0 ? 'text-blue-600' : 'text-red-600'}`}>
                                {netChange >= 0 ? '+' : ''}{netChange}
                            </h3>
                            <p className={`text-sm font-bold mt-2 inline-block px-2 py-1 rounded-md ${netChange >= 0 ? 'bg-blue-100/50 text-blue-700' : 'bg-red-100/50 text-red-700'}`}>units today</p>
                        </div>
                        <div className={`p-3 rounded-xl ${netChange >= 0 ? 'bg-blue-100' : 'bg-red-100'}`}>
                            <TrendingUp className={`w-6 h-6 ${netChange >= 0 ? 'text-blue-600' : 'text-red-600'}`} />
                        </div>
                    </div>
                </div>
            </div>

            {/* Tabs & Content */}
            <div className="glass-panel rounded-3xl overflow-hidden border border-cocoa/5 shadow-xl min-h-[400px]">
                <div className="border-b border-cocoa/5 flex bg-cocoa/[0.02]">
                    <button
                        onClick={() => setActiveTab('entries')}
                        className={`flex-1 px-6 py-5 font-bold text-sm uppercase tracking-wider transition-all flex items-center justify-center gap-2 relative ${activeTab === 'entries'
                            ? 'text-green-700 bg-white/50'
                            : 'text-cocoa/40 hover:bg-cocoa/5 hover:text-cocoa/60'
                            }`}
                    >
                        <ArrowDownCircle className={`w-4 h-4 ${activeTab === 'entries' ? 'text-green-600' : ''}`} />
                        Entries
                        <span className={`px-2 py-0.5 rounded-full text-xs ${activeTab === 'entries' ? 'bg-green-100 text-green-700' : 'bg-cocoa/10 text-cocoa/50'}`}>
                            {summary?.entries.length || 0}
                        </span>
                        {activeTab === 'entries' && <div className="absolute bottom-0 left-0 right-0 h-1 bg-green-500 rounded-t-full mx-6" />}
                    </button>
                    <button
                        onClick={() => setActiveTab('exits')}
                        className={`flex-1 px-6 py-5 font-bold text-sm uppercase tracking-wider transition-all flex items-center justify-center gap-2 relative ${activeTab === 'exits'
                            ? 'text-orange-700 bg-white/50'
                            : 'text-cocoa/40 hover:bg-cocoa/5 hover:text-cocoa/60'
                            }`}
                    >
                        <ArrowUpCircle className={`w-4 h-4 ${activeTab === 'exits' ? 'text-orange-600' : ''}`} />
                        Exits
                        <span className={`px-2 py-0.5 rounded-full text-xs ${activeTab === 'exits' ? 'bg-orange-100 text-orange-700' : 'bg-cocoa/10 text-cocoa/50'}`}>
                            {summary?.exits.length || 0}
                        </span>
                        {activeTab === 'exits' && <div className="absolute bottom-0 left-0 right-0 h-1 bg-orange-500 rounded-t-full mx-6" />}
                    </button>
                </div>

                <div className="p-6 md:p-8">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-20">
                            <Loader2 className="w-10 h-10 text-cocoa/20 animate-spin mb-4" />
                            <p className="text-cocoa/40 font-medium">Loading daily data...</p>
                        </div>
                    ) : movements.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-20 text-center">
                            <div className={`w-20 h-20 rounded-full flex items-center justify-center mb-6 ${activeTab === 'entries' ? 'bg-green-50' : 'bg-orange-50'}`}>
                                {activeTab === 'entries' ? <ArrowDownCircle className="w-10 h-10 text-green-200" /> : <ArrowUpCircle className="w-10 h-10 text-orange-200" />}
                            </div>
                            <h3 className="text-xl font-bold text-cocoa mb-2">No {activeTab} recorded</h3>
                            <p className="text-cocoa/50 max-w-sm mx-auto">
                                There were no stock {activeTab} recorded for this date. Select another date or add new movements.
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            <div className="flex justify-between items-center mb-6 pb-4 border-b border-cocoa/5">
                                <h3 className="font-bold text-cocoa text-lg">Movement Details</h3>
                                <div className="flex items-center gap-2 text-sm font-medium text-cocoa/60 bg-cocoa/5 px-3 py-1.5 rounded-lg">
                                    <CheckCircle2 className="w-4 h-4" />
                                    {movements.length} records found
                                </div>
                            </div>

                            <div className="grid grid-cols-1 gap-4">
                                {movements.map((movement) => (
                                    <MovementCard key={movement.id} movement={movement} type={activeTab} />
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

const MovementCard = ({ movement, type }: { movement: StockMovement; type: 'entries' | 'exits' }) => {
    const isEntry = type === 'entries';

    return (
        <div className={`group p-5 rounded-2xl border transition-all duration-300 hover:shadow-lg ${isEntry
            ? 'bg-green-50/30 border-green-100 hover:border-green-200 hover:bg-green-50/60'
            : 'bg-orange-50/30 border-orange-100 hover:border-orange-200 hover:bg-orange-50/60'
            }`}>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="flex-1 w-full">
                    <div className="flex items-center justify-between md:justify-start gap-3 mb-2">
                        <h4 className="font-bold text-cocoa text-lg">{movement.productName}</h4>
                        <span className={`px-2.5 py-1 rounded-lg text-xs font-bold tracking-wide ${isEntry
                            ? 'bg-green-200/50 text-green-800'
                            : 'bg-orange-200/50 text-orange-800'
                            }`}>
                            {movement.quantity} units
                        </span>
                    </div>

                    <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-cocoa/70 mt-3">
                        <div className="flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5 opacity-50" />
                            <span className="font-medium">{format(new Date(movement.date), 'HH:mm')}</span>
                        </div>

                        {isEntry ? (
                            <>
                                {movement.supplier && (
                                    <div className="flex items-center gap-1.5">
                                        <User className="w-3.5 h-3.5 opacity-50" />
                                        <span>Supplier: <span className="font-semibold text-cocoa">{movement.supplier}</span></span>
                                    </div>
                                )}
                                {movement.reference && (
                                    <div className="flex items-center gap-1.5">
                                        <FileText className="w-3.5 h-3.5 opacity-50" />
                                        <span>Ref: <span className="font-semibold text-cocoa">{movement.reference}</span></span>
                                    </div>
                                )}
                            </>
                        ) : (
                            <>
                                {movement.receiver && (
                                    <div className="flex items-center gap-1.5">
                                        <User className="w-3.5 h-3.5 opacity-50" />
                                        <span>Receiver: <span className="font-semibold text-cocoa">{movement.receiver}</span></span>
                                    </div>
                                )}
                                {movement.user && (
                                    <div className="flex items-center gap-1.5">
                                        <User className="w-3.5 h-3.5 opacity-50" />
                                        <span>Dept: <span className="font-semibold text-cocoa">{movement.user}</span></span>
                                    </div>
                                )}
                            </>
                        )}
                    </div>

                    {(movement.reason || movement.purpose || movement.notes) && (
                        <div className="mt-4 pt-3 border-t border-cocoa/5 flex gap-2">
                            <div className={`w-1 rounded-full ${isEntry ? 'bg-green-300' : 'bg-orange-300'}`}></div>
                            <p className="text-sm text-cocoa/60 italic">
                                {movement.reason || movement.purpose} {movement.notes && `— ${movement.notes}`}
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DailyViews;
