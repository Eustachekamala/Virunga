import { useState, useEffect } from 'react';
import { getWeeklySummary } from '../services/stockMovements';
import { generateWeeklyStockReport } from '../services/pdfGenerator';
import { showSuccess } from '../components/ui/Toast';
import { format } from 'date-fns';
import { CalendarDays, FileDown, TrendingUp, TrendingDown } from 'lucide-react';

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

    return (
        <div>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                <div>
                    <h2 className="text-4xl font-serif font-bold text-cocoa flex items-center gap-3">
                        <CalendarDays className="w-10 h-10 text-purple-600" />
                        Weekly Summary
                    </h2>
                    <p className="text-cocoa/60 mt-2">
                        {summary && `Week of ${format(new Date(summary.weekStart), 'MMM dd')} - ${format(new Date(summary.weekEnd), 'MMM dd, yyyy')}`}
                    </p>
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
                        className="px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-700 text-white hover:from-purple-700 hover:to-purple-800 rounded-lg font-medium transition-all shadow-lg hover:shadow-xl disabled:opacity-50 flex items-center gap-2"
                    >
                        <FileDown className="w-5 h-5" />
                        Export PDF
                    </button>
                </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-cocoa/5">
                    <p className="text-sm text-cocoa/60 font-medium">Total Entries</p>
                    <h3 className="text-3xl font-bold text-green-600 mt-1">{totalEntries}</h3>
                    <p className="text-sm text-cocoa/50 mt-1">{totalEntriesQty} units</p>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-cocoa/5">
                    <p className="text-sm text-cocoa/60 font-medium">Total Exits</p>
                    <h3 className="text-3xl font-bold text-orange-600 mt-1">{totalExits}</h3>
                    <p className="text-sm text-cocoa/50 mt-1">{totalExitsQty} units</p>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-cocoa/5">
                    <p className="text-sm text-cocoa/60 font-medium">Net Change</p>
                    <h3 className={`text-3xl font-bold mt-1 ${(totalEntriesQty - totalExitsQty) >= 0 ? 'text-green-600' : 'text-red-600'
                        }`}>
                        {(totalEntriesQty - totalExitsQty) >= 0 ? '+' : ''}
                        {totalEntriesQty - totalExitsQty}
                    </h3>
                    <p className="text-sm text-cocoa/50 mt-1">units</p>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-cocoa/5">
                    <p className="text-sm text-cocoa/60 font-medium">Daily Average</p>
                    <h3 className="text-3xl font-bold text-blue-600 mt-1">
                        {Math.round((totalEntries + totalExits) / 7)}
                    </h3>
                    <p className="text-sm text-cocoa/50 mt-1">movements/day</p>
                </div>
            </div>

            {/* Chart */}
            <div className="bg-white rounded-xl shadow-sm border border-cocoa/5 p-6 mb-8">
                <h3 className="text-xl font-bold text-cocoa mb-6">Daily Breakdown</h3>
                <div className="h-80" style={{ minHeight: '320px' }}>
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={chartData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="date" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="Entries" fill="#10b981" radius={[4, 4, 0, 0]} />
                            <Bar dataKey="Exits" fill="#f97316" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Tabs */}
            <div className="bg-white rounded-xl shadow-sm border border-cocoa/5 overflow-hidden">
                <div className="border-b border-cocoa/10 flex">
                    <button
                        onClick={() => setActiveTab('entries')}
                        className={`flex-1 px-6 py-4 font-medium transition-all ${activeTab === 'entries'
                            ? 'bg-green-50 text-green-700 border-b-2 border-green-600'
                            : 'text-cocoa/60 hover:bg-cocoa/5'
                            }`}
                    >
                        📥 Entries ({totalEntries})
                    </button>
                    <button
                        onClick={() => setActiveTab('exits')}
                        className={`flex-1 px-6 py-4 font-medium transition-all ${activeTab === 'exits'
                            ? 'bg-orange-50 text-orange-700 border-b-2 border-orange-600'
                            : 'text-cocoa/60 hover:bg-cocoa/5'
                            }`}
                    >
                        📤 Exits ({totalExits})
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
                                No {activeTab === 'entries' ? 'entries' : 'exits'} recorded this week
                            </p>
                        </div>
                    ) : (
                        <>
                            <p className="text-sm text-cocoa/60 mb-4">
                                Showing all {movements.length} movements
                            </p>

                            <div className="space-y-2 max-h-96 overflow-y-auto">
                                {movements.map((movement) => (
                                    <div
                                        key={movement.id}
                                        className={`p-3 rounded-lg border-l-4 ${activeTab === 'entries'
                                            ? 'bg-green-50 border-green-500'
                                            : 'bg-orange-50 border-orange-500'
                                            }`}
                                    >
                                        <div className="flex justify-between items-center">
                                            <div className="flex items-center gap-3">
                                                <span className="text-sm text-cocoa/60">
                                                    {format(new Date(movement.date), 'MMM dd, HH:mm')}
                                                </span>
                                                <span className="font-medium text-cocoa">
                                                    {movement.productName}
                                                </span>
                                            </div>
                                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${activeTab === 'entries'
                                                ? 'bg-green-600 text-white'
                                                : 'bg-orange-600 text-white'
                                                }`}>
                                                {movement.quantity} units
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default WeeklyViews;
