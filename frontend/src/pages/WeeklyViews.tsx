import { useState, useEffect } from 'react';
import { getWeeklySummary } from '../services/stockMovements';
import { generateWeeklyStockReport } from '../services/pdfGenerator';
import { showSuccess } from '../components/ui/Toast';
import { format } from 'date-fns';
import { CalendarDays, FileDown, ArrowDownCircle, ArrowUpCircle,Loader2, BarChart2, CheckCircle2 } from 'lucide-react';
import type { WeeklySummary } from '../types/movements';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer
} from 'recharts';

const WeeklyViews = () => {
    const [activeTab, setActiveTab] = useState<'entries' | 'exits'>('entries');
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [summary, setSummary] = useState<WeeklySummary | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchWeeklySummary();
    }, [selectedDate]);

    const fetchWeeklySummary = () => {
        setLoading(true);
        const data = getWeeklySummary(new Date(selectedDate));
        setSummary(data);
        setLoading(false);
    };

    const handleExport = () => {
        if (!summary) return;
        generateWeeklyStockReport(summary);
        showSuccess('Weekly stock report downloaded');
    };

    const movements = activeTab === 'entries' ? summary?.entries || [] : summary?.exits || [];
    const totalEntries = summary?.entries.length || 0;
    const totalExits = summary?.exits.length || 0;
    const totalEntriesQty = summary?.entries.reduce((sum, e) => sum + e.quantity, 0) || 0;
    const totalExitsQty = summary?.exits.reduce((sum, e) => sum + e.quantity, 0) || 0;

    // Prepare chart data
    const chartData = (summary?.dailyBreakdown || []).map(day => ({
        date: format(new Date(day.date), 'EEE dd'),
        Entries: day.entriesQuantity,
        Exits: day.exitsQuantity,
    }));

    // Calculate net change
    const netChange = totalEntriesQty - totalExitsQty;

    return (
        <div className="space-y-8 animate-in fade-in duration-500 pb-20">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h2 className="text-3xl font-bold text-cocoa tracking-tight flex items-center gap-3">
                        Weekly Summary
                    </h2>
                    <p className="text-cocoa/60 font-medium text-sm mt-1">
                        {summary ? `Week of ${format(new Date(summary.weekStart), 'MMM dd')} - ${format(new Date(summary.weekEnd), 'MMM dd, yyyy')}` : 'Select a week'}
                    </p>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
                    <div className="relative w-full sm:w-auto">
                        <input
                            type="date"
                            value={selectedDate}
                            onChange={(e) => setSelectedDate(e.target.value)}
                            className="w-full px-4 py-3 bg-white/80 border border-cocoa/10 rounded-xl text-cocoa focus:ring-2 focus:ring-gold/50 outline-none transition-all font-medium cursor-pointer hover:bg-white"
                        />
                        <CalendarDays className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-cocoa/40 pointer-events-none" />
                    </div>

                    <button
                        onClick={handleExport}
                        disabled={!summary}
                        className="w-full sm:w-auto px-6 py-3 bg-cocoa text-gold hover:bg-cocoa/90 rounded-xl font-bold transition-all shadow-lg shadow-cocoa/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 active:scale-95"
                    >
                        <FileDown className="w-5 h-5" />
                        <span>Export PDF</span>
                    </button>
                </div>
            </div>

            {/* Insight Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="glass-panel p-6 rounded-2xl border-l-[6px] border-l-green-500 relative overflow-hidden group">
                    <div className="absolute -right-6 -top-6 w-24 h-24 bg-green-500/10 rounded-full blur-xl group-hover:scale-150 transition-transform duration-500"></div>
                    <div className="relative z-10">
                        <p className="text-xs font-bold text-green-600 uppercase tracking-widest mb-1">Total Entries</p>
                        <div className="flex items-end gap-2">
                            <h3 className="text-3xl font-extrabold text-cocoa">{totalEntries}</h3>
                            <span className="text-sm font-medium text-cocoa/50 mb-1">movements</span>
                        </div>
                        <p className="text-sm text-green-700 font-bold mt-2 bg-green-100/50 inline-block px-2 py-1 rounded-md">+{totalEntriesQty} units</p>
                    </div>
                </div>

                <div className="glass-panel p-6 rounded-2xl border-l-[6px] border-l-orange-500 relative overflow-hidden group">
                    <div className="absolute -right-6 -top-6 w-24 h-24 bg-orange-500/10 rounded-full blur-xl group-hover:scale-150 transition-transform duration-500"></div>
                    <div className="relative z-10">
                        <p className="text-xs font-bold text-orange-600 uppercase tracking-widest mb-1">Total Exits</p>
                        <div className="flex items-end gap-2">
                            <h3 className="text-3xl font-extrabold text-cocoa">{totalExits}</h3>
                            <span className="text-sm font-medium text-cocoa/50 mb-1">movements</span>
                        </div>
                        <p className="text-sm text-orange-700 font-bold mt-2 bg-orange-100/50 inline-block px-2 py-1 rounded-md">-{totalExitsQty} units</p>
                    </div>
                </div>

                <div className={`glass-panel p-6 rounded-2xl border-l-[6px] relative overflow-hidden group ${netChange >= 0
                    ? 'border-l-blue-500'
                    : 'border-l-red-500'
                    }`}>
                    <div className={`absolute -right-6 -top-6 w-24 h-24 rounded-full blur-xl group-hover:scale-150 transition-transform duration-500 ${netChange >= 0 ? 'bg-blue-500/10' : 'bg-red-500/10'}`}></div>
                    <div className="relative z-10">
                        <p className={`text-xs font-bold uppercase tracking-widest mb-1 ${netChange >= 0 ? 'text-blue-600' : 'text-red-600'}`}>Net Change</p>
                        <h3 className={`text-3xl font-extrabold ${netChange >= 0 ? 'text-blue-600' : 'text-red-600'}`}>
                            {netChange >= 0 ? '+' : ''}{netChange}
                        </h3>
                        <p className="text-sm text-cocoa/50 mt-2 font-medium">total units change</p>
                    </div>
                </div>

                <div className="glass-panel p-6 rounded-2xl border-l-[6px] border-l-indigo-500 relative overflow-hidden group">
                    <div className="absolute -right-6 -top-6 w-24 h-24 bg-indigo-500/10 rounded-full blur-xl group-hover:scale-150 transition-transform duration-500"></div>
                    <div className="relative z-10">
                        <p className="text-xs font-bold text-indigo-600 uppercase tracking-widest mb-1">Daily Avg</p>
                        <h3 className="text-3xl font-extrabold text-cocoa">
                            {Math.round((totalEntries + totalExits) / 7)}
                        </h3>
                        <p className="text-sm text-cocoa/50 mt-2 font-medium">movements / day</p>
                    </div>
                </div>
            </div>

            {/* Chart Section */}
            <div className="glass-panel p-6 rounded-3xl border border-cocoa/5 shadow-lg">
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-cocoa/5 rounded-lg">
                        <BarChart2 className="w-5 h-5 text-cocoa" />
                    </div>
                    <h3 className="text-xl font-bold text-cocoa">Daily Breakdown</h3>
                </div>

                <div className="h-[350px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.05)" />
                            <XAxis
                                dataKey="date"
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: '#6B7280', fontSize: 12 }}
                                dy={10}
                            />
                            <YAxis
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: '#6B7280', fontSize: 12 }}
                            />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                                    borderRadius: '12px',
                                    border: 'none',
                                    boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
                                }}
                                cursor={{ fill: 'rgba(0,0,0,0.02)' }}
                            />
                            <Legend
                                wrapperStyle={{ paddingTop: '20px' }}
                                iconType="circle"
                            />
                            <Bar
                                name="Entries"
                                dataKey="Entries"
                                fill="#22c55e"
                                radius={[6, 6, 0, 0]}
                                barSize={20}
                            />
                            <Bar
                                name="Exits"
                                dataKey="Exits"
                                fill="#f97316"
                                radius={[6, 6, 0, 0]}
                                barSize={20}
                            />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Tabs & List */}
            <div className="glass-panel rounded-3xl overflow-hidden border border-cocoa/5 shadow-xl min-h-[400px]">
                <div className="border-b border-cocoa/5 flex bg-cocoa/[0.02]">
                    <button
                        onClick={() => setActiveTab('entries')}
                        className={`flex-1 px-6 py-5 font-bold text-sm uppercase tracking-wider transition-all flex items-center justify-center gap-2 relative ${activeTab === 'entries'
                            ? 'text-green-700 bg-white/50'
                            : 'text-cocoa/40 hover:bg-cocoa/5 hover:text-cocoa/60'
                            }`}
                    >
                        <ArrowUpCircle className={`w-4 h-4 ${activeTab === 'entries' ? 'text-green-600' : ''}`} />
                        Entries ({totalEntries})
                        {activeTab === 'entries' && <div className="absolute bottom-0 left-0 right-0 h-1 bg-green-500 rounded-t-full mx-6" />}
                    </button>
                    <button
                        onClick={() => setActiveTab('exits')}
                        className={`flex-1 px-6 py-5 font-bold text-sm uppercase tracking-wider transition-all flex items-center justify-center gap-2 relative ${activeTab === 'exits'
                            ? 'text-orange-700 bg-white/50'
                            : 'text-cocoa/40 hover:bg-cocoa/5 hover:text-cocoa/60'
                            }`}
                    >
                        <ArrowDownCircle className={`w-4 h-4 ${activeTab === 'exits' ? 'text-orange-600' : ''}`} />
                        Exits ({totalExits})
                        {activeTab === 'exits' && <div className="absolute bottom-0 left-0 right-0 h-1 bg-orange-500 rounded-t-full mx-6" />}
                    </button>
                </div>

                <div className="p-6 md:p-8">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-20">
                            <Loader2 className="w-10 h-10 text-cocoa/20 animate-spin mb-4" />
                            <p className="text-cocoa/40 font-medium">Loading weekly data...</p>
                        </div>
                    ) : movements.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-20 text-center">
                            <div className={`w-20 h-20 rounded-full flex items-center justify-center mb-6 ${activeTab === 'entries' ? 'bg-green-50' : 'bg-orange-50'}`}>
                                {activeTab === 'entries' ? <ArrowUpCircle className="w-10 h-10 text-green-200" /> : <ArrowDownCircle className="w-10 h-10 text-orange-200" />}
                            </div>
                            <p className="text-cocoa/60 text-lg">
                                No {activeTab === 'entries' ? 'entries' : 'exits'} recorded this week
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 text-sm font-medium text-cocoa/60 mb-2">
                                <CheckCircle2 className="w-4 h-4" />
                                Showing all {movements.length} movements
                            </div>

                            <div className="grid grid-cols-1 gap-3 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                                {movements.map((movement) => (
                                    <div
                                        key={movement.id}
                                        className={`group p-4 rounded-xl border-l-[4px] transition-all hover:translate-x-1 ${activeTab === 'entries'
                                            ? 'bg-green-50/30 border-l-green-500 hover:bg-green-50'
                                            : 'bg-orange-50/30 border-l-orange-500 hover:bg-orange-50'
                                            }`}
                                    >
                                        <div className="flex justify-between items-center">
                                            <div className="flex items-center gap-4">
                                                <div className={`px-3 py-2 rounded-lg text-xs font-bold uppercase tracking-wider text-center min-w-[60px] ${activeTab === 'entries' ? 'bg-white text-green-700 shadow-sm' : 'bg-white text-orange-700 shadow-sm'}`}>
                                                    <span className="block text-[10px] opacity-60">{format(new Date(movement.date), 'MMM')}</span>
                                                    <span className="text-lg leading-none">{format(new Date(movement.date), 'dd')}</span>
                                                </div>

                                                <div>
                                                    <h4 className="font-bold text-cocoa">{movement.productName}</h4>
                                                    <span className="text-xs text-cocoa/50 font-medium">
                                                        {format(new Date(movement.date), 'HH:mm')}
                                                    </span>
                                                </div>
                                            </div>

                                            <span className={`px-3 py-1 rounded-full text-sm font-bold ${activeTab === 'entries'
                                                ? 'bg-green-100 text-green-700'
                                                : 'bg-orange-100 text-orange-700'
                                                }`}>
                                                {movement.quantity} units
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default WeeklyViews;
