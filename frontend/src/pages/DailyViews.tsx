import { useState, useEffect } from 'react';
import { getDailySummary } from '../services/stockMovements';
import { generateDailyEntryReport, generateDailyExitReport } from '../services/pdfGenerator';
import { showSuccess } from '../components/ui/Toast';
import { format } from 'date-fns';
import { Calendar, FileDown, ArrowDownCircle, ArrowUpCircle, TrendingUp } from 'lucide-react';
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
        fetchDailySummary();
    }, [selectedDate]);

    const fetchDailySummary = () => {
        setLoading(true);
        const data = getDailySummary(new Date(selectedDate));
        setSummary(data);
        setLoading(false);
    };

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
    const totalQuantity = activeTab === 'entries' ? summary?.totalEntriesQuantity || 0 : summary?.totalExitsQuantity || 0;
    const netChange = (summary?.totalEntriesQuantity || 0) - (summary?.totalExitsQuantity || 0);

    return (
        <div>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                <div>
                    <h2 className="md:text-4xl text-2xl font-serif font-bold text-cocoa flex items-center gap-3">
                        <Calendar className="w-8 h-8 md:w-12 md:h-12 text-blue-600" />
                        Daily Summary
                    </h2>
                    <p className="text-cocoa/60 mt-2">View entries and exits for any date</p>
                </div>

                <div className="flex items-center gap-3">
                    <input
                        type="date"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        className="px-4 py-2 bg-white border border-cocoa/10 rounded-lg text-cocoa focus:ring-2 focus:ring-gold/50 outline-none"
                    />
                    <button
                        onClick={handleExport}
                        disabled={!summary}
                        className="px-6 py-3 bg-gradient-to-r from-cocoa to-cocoa/90 text-gold hover:from-cocoa/90 hover:to-cocoa rounded-lg font-medium transition-all shadow-lg hover:shadow-xl disabled:opacity-50 flex items-center gap-2"
                    >
                        <FileDown className="w-5 h-5" />
                        Export PDF
                    </button>
                </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-xl shadow-md border border-green-200">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-sm text-green-700 font-semibold uppercase tracking-wide">Total Entries</p>
                            <h3 className="text-4xl font-bold text-green-600 mt-2">{summary?.entries.length || 0}</h3>
                        </div>
                        <div className="bg-green-200 p-3 rounded-full">
                            <ArrowDownCircle className="w-6 h-6 text-green-700" />
                        </div>
                    </div>
                    <p className="text-sm text-green-600 mt-2 font-medium">{summary?.totalEntriesQuantity || 0} units</p>
                </div>

                <div className="bg-gradient-to-br from-orange-50 to-amber-50 p-6 rounded-xl shadow-md border border-orange-200">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-sm text-orange-700 font-semibold uppercase tracking-wide">Total Exits</p>
                            <h3 className="text-4xl font-bold text-orange-600 mt-2">{summary?.exits.length || 0}</h3>
                        </div>
                        <div className="bg-orange-200 p-3 rounded-full">
                            <ArrowUpCircle className="w-6 h-6 text-orange-700" />
                        </div>
                    </div>
                    <p className="text-sm text-orange-600 mt-2 font-medium">{summary?.totalExitsQuantity || 0} units</p>
                </div>

                <div className={`bg-gradient-to-br p-6 rounded-xl shadow-md border ${netChange >= 0
                    ? 'from-blue-50 to-cyan-50 border-blue-200'
                    : 'from-red-50 to-rose-50 border-red-200'
                    }`}>
                    <div className="flex justify-between items-start">
                        <div>
                            <p className={`text-sm font-semibold uppercase tracking-wide ${netChange >= 0 ? 'text-blue-700' : 'text-red-700'}`}>Net Change</p>
                            <h3 className={`text-4xl font-bold mt-2 ${netChange >= 0 ? 'text-blue-600' : 'text-red-600'}`}>
                                {netChange >= 0 ? '+' : ''}{netChange}
                            </h3>
                        </div>
                        <div className={`p-3 rounded-full ${netChange >= 0 ? 'bg-blue-200' : 'bg-red-200'}`}>
                            <TrendingUp className={`w-6 h-6 ${netChange >= 0 ? 'text-blue-700' : 'text-red-700'}`} />
                        </div>
                    </div>
                    <p className={`text-sm mt-2 font-medium ${netChange >= 0 ? 'text-blue-600' : 'text-red-600'}`}>units</p>
                </div>
            </div>

            {/* Tabs */}
            <div className="bg-white rounded-xl shadow-sm border border-cocoa/5 overflow-hidden">
                <div className="border-b border-cocoa/10 flex">
                    <button
                        onClick={() => setActiveTab('entries')}
                        className={`flex-1 px-6 py-4 font-medium transition-all flex items-center justify-center gap-2 ${activeTab === 'entries'
                            ? 'bg-green-50 text-green-700 border-b-2 border-green-600'
                            : 'text-cocoa/60 hover:bg-cocoa/5'
                            }`}
                    >
                        <ArrowDownCircle className="w-5 h-5" />
                        Entries ({summary?.entries.length || 0})
                    </button>
                    <button
                        onClick={() => setActiveTab('exits')}
                        className={`flex-1 px-6 py-4 font-medium transition-all flex items-center justify-center gap-2 ${activeTab === 'exits'
                            ? 'bg-orange-50 text-orange-700 border-b-2 border-orange-600'
                            : 'text-cocoa/60 hover:bg-cocoa/5'
                            }`}
                    >
                        <ArrowUpCircle className="w-5 h-5" />
                        Exits ({summary?.exits.length || 0})
                    </button>
                </div>

                <div className="p-6">
                    {loading ? (
                        <div className="flex justify-center py-12">
                            <div className="w-10 h-10 border-4 border-gold border-t-transparent rounded-full animate-spin"></div>
                        </div>
                    ) : movements.length === 0 ? (
                        <div className="text-center py-12">
                            <p className="text-cocoa/60 text-lg">
                                No {activeTab === 'entries' ? 'entries' : 'exits'} recorded for this date
                            </p>
                        </div>
                    ) : (
                        <>
                            <div className="mb-4 flex justify-between items-center">
                                <p className="text-sm text-cocoa/60">
                                    {movements.length} movements • {totalQuantity} total units
                                </p>
                            </div>

                            <div className="space-y-3">
                                {movements.map((movement) => (
                                    <MovementCard key={movement.id} movement={movement} type={activeTab} />
                                ))}
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

const MovementCard = ({ movement, type }: { movement: StockMovement; type: 'entries' | 'exits' }) => {
    const isEntry = type === 'entries';

    return (
        <div className={`p-4 rounded-lg border-l-4 ${isEntry ? 'bg-green-50 border-green-500' : 'bg-orange-50 border-orange-500'
            }`}>
            <div className="flex justify-between items-start gap-4">
                <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                        <h4 className="font-bold text-cocoa">{movement.productName}</h4>
                        <span className={`px-3 py-0.5 rounded-full text-xs font-medium ${isEntry ? 'bg-green-600 text-white' : 'bg-orange-600 text-white'
                            }`}>
                            {movement.quantity} units
                        </span>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-1 text-sm text-cocoa/70">
                        <div>
                            <span className="font-medium">Time:</span> {format(new Date(movement.date), 'HH:mm')}
                        </div>

                        {isEntry ? (
                            <>
                                {movement.supplier && (
                                    <div>
                                        <span className="font-medium">Supplier:</span> {movement.supplier}
                                    </div>
                                )}
                                {movement.reference && (
                                    <div>
                                        <span className="font-medium">Ref:</span> {movement.reference}
                                    </div>
                                )}
                                {movement.reason && (
                                    <div className="col-span-2">
                                        <span className="font-medium">Reason:</span> {movement.reason}
                                    </div>
                                )}
                            </>
                        ) : (
                            <>
                                {movement.receiver && (
                                    <div>
                                        <span className="font-medium">Receiver:</span> {movement.receiver}
                                    </div>
                                )}
                                {movement.user && (
                                    <div>
                                        <span className="font-medium">Dept:</span> {movement.user}
                                    </div>
                                )}
                                {movement.purpose && (
                                    <div className="col-span-2">
                                        <span className="font-medium">Purpose:</span> {movement.purpose}
                                    </div>
                                )}
                            </>
                        )}
                    </div>

                    {movement.notes && (
                        <p className="text-sm text-cocoa/60 mt-2 italic">Note: {movement.notes}</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DailyViews;
