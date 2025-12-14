import { useState, useEffect } from 'react';
import { getStockAlerts } from '../services/stockMovements';
import { generateLowStockReport } from '../services/pdfGenerator';
import AlertChip from '../components/product/AlertChip';
import { showSuccess } from '../components/ui/Toast';
import type { StockAlert } from '../types/movements';
import { useNavigate } from 'react-router-dom';
import { FileDown, Package, TrendingDown, AlertTriangle, CheckCircle, Loader2, ArrowRight } from 'lucide-react';

const StockAlerts = () => {
    const [alerts, setAlerts] = useState<StockAlert[]>([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        fetchAlerts();
    }, []);

    const fetchAlerts = async () => {
        setLoading(true);
        try {
            const data = await getStockAlerts();
            setAlerts(data);
        } catch (error) {
            console.error('Failed to fetch alerts', error);
        } finally {
            setLoading(false);
        }
    };

    const handleExportPDF = () => {
        generateLowStockReport(alerts);
        showSuccess('Low stock report downloaded');
    };

    const outOfStock = alerts.filter(a => a.severity === 'OUT_OF_STOCK');
    const critical = alerts.filter(a => a.severity === 'CRITICAL');
    const low = alerts.filter(a => a.severity === 'LOW');

    if (loading) {
        return (
            <div className="absolute inset-0 flex items-center justify-center bg-cream/50 z-10">
                <div className="flex flex-col items-center gap-3">
                    <Loader2 className="w-10 h-10 text-gold animate-spin" />
                    <p className="text-cocoa/60 font-medium">Loading alerts...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-500 pb-20">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h2 className="text-3xl font-bold text-cocoa tracking-tight flex items-center gap-3">
                        Stock Alerts
                    </h2>
                    <p className="text-cocoa/60 font-medium text-sm mt-1">
                        {alerts.length === 0 ? 'All products are adequately stocked' : `${alerts.length} items require attention`}
                    </p>
                </div>

                {alerts.length > 0 && (
                    <button
                        onClick={handleExportPDF}
                        className="px-6 py-3 bg-cocoa text-gold hover:bg-cocoa/90 rounded-xl font-bold transition-all shadow-lg shadow-cocoa/20 flex items-center gap-2 active:scale-95"
                    >
                        <FileDown className="w-5 h-5" />
                        Export Report
                    </button>
                )}
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="glass-panel p-6 rounded-2xl border-l-[6px] border-l-red-500 relative overflow-hidden group">
                    {/* Gradient Blob */}
                    <div className="absolute -right-6 -top-6 w-24 h-24 bg-red-500/10 rounded-full blur-xl group-hover:scale-150 transition-transform duration-500"></div>

                    <div className="flex justify-between items-start relative z-10">
                        <div>
                            <p className="text-xs font-bold text-red-600 uppercase tracking-widest mb-1">Out of Stock</p>
                            <h3 className="text-4xl font-extrabold text-cocoa">{outOfStock.length}</h3>
                        </div>
                        <div className="bg-red-100 p-3 rounded-xl">
                            <Package className="w-6 h-6 text-red-600" />
                        </div>
                    </div>
                </div>

                <div className="glass-panel p-6 rounded-2xl border-l-[6px] border-l-orange-500 relative overflow-hidden group">
                    <div className="absolute -right-6 -top-6 w-24 h-24 bg-orange-500/10 rounded-full blur-xl group-hover:scale-150 transition-transform duration-500"></div>
                    <div className="flex justify-between items-start relative z-10">
                        <div>
                            <p className="text-xs font-bold text-orange-600 uppercase tracking-widest mb-1">Critical Low</p>
                            <h3 className="text-4xl font-extrabold text-cocoa">{critical.length}</h3>
                        </div>
                        <div className="bg-orange-100 p-3 rounded-xl">
                            <AlertTriangle className="w-6 h-6 text-orange-600" />
                        </div>
                    </div>
                </div>

                <div className="glass-panel p-6 rounded-2xl border-l-[6px] border-l-yellow-500 relative overflow-hidden group">
                    <div className="absolute -right-6 -top-6 w-24 h-24 bg-yellow-500/10 rounded-full blur-xl group-hover:scale-150 transition-transform duration-500"></div>
                    <div className="flex justify-between items-start relative z-10">
                        <div>
                            <p className="text-xs font-bold text-yellow-600 uppercase tracking-widest mb-1">Low Stock</p>
                            <h3 className="text-4xl font-extrabold text-cocoa">{low.length}</h3>
                        </div>
                        <div className="bg-yellow-100 p-3 rounded-xl">
                            <TrendingDown className="w-6 h-6 text-yellow-600" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Alerts List */}
            {alerts.length === 0 ? (
                <div className="glass-panel p-12 rounded-3xl text-center border border-green-200/50 bg-gradient-to-br from-green-50/50 to-emerald-50/50">
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle className="w-10 h-10 text-green-600" />
                    </div>
                    <h3 className="text-2xl font-bold text-green-800 mb-2">Inventory Healthy</h3>
                    <p className="text-green-700/70 font-medium">All products are adequately stocked. No alerts at this time.</p>
                </div>
            ) : (
                <div className="space-y-10">
                    {/* Out of Stock Section */}
                    {outOfStock.length > 0 && (
                        <div>
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-2 bg-red-100 rounded-lg">
                                    <Package className="w-5 h-5 text-red-600" />
                                </div>
                                <h3 className="text-xl font-bold text-cocoa">Out of Stock</h3>
                                <span className="text-sm font-semibold text-cocoa/40 bg-cocoa/5 px-2 py-1 rounded-md">{outOfStock.length} items</span>
                            </div>
                            <div className="grid grid-cols-1 gap-4">
                                {outOfStock.map(alert => (
                                    <AlertCard key={alert.product.id} alert={alert} navigate={navigate} />
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Critical Section */}
                    {critical.length > 0 && (
                        <div>
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-2 bg-orange-100 rounded-lg">
                                    <AlertTriangle className="w-5 h-5 text-orange-600" />
                                </div>
                                <h3 className="text-xl font-bold text-cocoa">Critical Low Stock</h3>
                                <span className="text-sm font-semibold text-cocoa/40 bg-cocoa/5 px-2 py-1 rounded-md">{critical.length} items</span>
                            </div>
                            <div className="grid grid-cols-1 gap-4">
                                {critical.map(alert => (
                                    <AlertCard key={alert.product.id} alert={alert} navigate={navigate} />
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Low Stock Section */}
                    {low.length > 0 && (
                        <div>
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-2 bg-yellow-100 rounded-lg">
                                    <TrendingDown className="w-5 h-5 text-yellow-600" />
                                </div>
                                <h3 className="text-xl font-bold text-cocoa">Low Stock</h3>
                                <span className="text-sm font-semibold text-cocoa/40 bg-cocoa/5 px-2 py-1 rounded-md">{low.length} items</span>
                            </div>
                            <div className="grid grid-cols-1 gap-4">
                                {low.map(alert => (
                                    <AlertCard key={alert.product.id} alert={alert} navigate={navigate} />
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const AlertCard = ({ alert, navigate }: { alert: StockAlert; navigate: any }) => {
    const severityStyles = {
        OUT_OF_STOCK: 'border-l-red-500 hover:shadow-red-500/10',
        CRITICAL: 'border-l-orange-500 hover:shadow-orange-500/10',
        LOW: 'border-l-yellow-500 hover:shadow-yellow-500/10'
    };

    const bgStyles = {
        OUT_OF_STOCK: 'bg-red-50/40',
        CRITICAL: 'bg-orange-50/40',
        LOW: 'bg-yellow-50/40'
    }

    const percentage = alert.product.stockAlertThreshold > 0
        ? Math.round((alert.product.quantity / alert.product.stockAlertThreshold) * 100)
        : 0;

    return (
        <div className={`glass-panel p-6 rounded-2xl border-l-[6px] ${severityStyles[alert.severity]} ${bgStyles[alert.severity]} transition-all hover:translate-x-1 duration-300 group`}>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div className="flex-1 w-full">
                    <div className="flex items-center justify-between md:justify-start gap-4 mb-2">
                        <h4 className="text-xl font-bold text-cocoa">{alert.product.name}</h4>
                        <AlertChip severity={alert.severity} size="sm" />
                    </div>

                    <p className="text-cocoa/70 mb-4 text-sm font-medium">{alert.message}</p>

                    <div className="flex items-center gap-4 md:gap-8 flex-wrap">
                        <div className="flex items-center gap-2">
                            <span className="text-xs uppercase tracking-wider font-bold text-cocoa/40">Current</span>
                            <span className={`text-sm font-bold px-2 py-1 rounded-md ${alert.severity === 'OUT_OF_STOCK' ? 'bg-red-100 text-red-700' :
                                alert.severity === 'CRITICAL' ? 'bg-orange-100 text-orange-700' :
                                    'bg-yellow-100 text-yellow-700'
                                }`}>
                                {alert.product.quantity} units
                            </span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-xs uppercase tracking-wider font-bold text-cocoa/40">Min</span>
                            <span className="text-sm font-bold text-cocoa">{alert.product.stockAlertThreshold} units</span>
                        </div>
                        {alert.severity !== 'OUT_OF_STOCK' && (
                            <div className="flex items-center gap-2">
                                <span className="text-xs uppercase tracking-wider font-bold text-cocoa/40">Level</span>
                                <span className="text-sm font-bold text-cocoa">{percentage}%</span>
                            </div>
                        )}
                    </div>
                </div>

                <div className="w-full md:w-auto">
                    <button
                        onClick={() => navigate('/stock-in')}
                        className="w-full md:w-auto px-6 py-3 bg-white text-cocoa border border-cocoa/10 hover:bg-cocoa/5 rounded-xl font-bold transition-all flex items-center justify-center gap-2 active:scale-95 group-hover:border-cocoa/20"
                    >
                        <Package className="w-4 h-4" />
                        <span>Restock</span>
                        <ArrowRight className="w-4 h-4 opacity-50 group-hover:translate-x-1 transition-transform" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default StockAlerts;
