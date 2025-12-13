import { useState, useEffect } from 'react';
import { getStockAlerts } from '../services/stockMovements';
import { generateLowStockReport } from '../services/pdfGenerator';
import AlertChip from '../components/product/AlertChip';
import { showSuccess } from '../components/ui/Toast';
import type { StockAlert } from '../types/movements';
import { useNavigate } from 'react-router-dom';
import { FileDown, Package, TrendingDown, AlertTriangle, CheckCircle } from 'lucide-react';

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
            <div className="flex items-center justify-center py-20">
                <div className="w-12 h-12 border-4 border-gold border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                <div>
                    <h2 className="text-4xl font-serif font-bold text-cocoa flex items-center gap-3">
                        <AlertTriangle className="w-10 h-10 text-orange-600" />
                        Stock Alerts
                    </h2>
                    <p className="text-cocoa/60 mt-2">
                        {alerts.length === 0 ? 'All products are adequately stocked' : `${alerts.length} items need attention`}
                    </p>
                </div>

                {alerts.length > 0 && (
                    <button
                        onClick={handleExportPDF}
                        className="px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white hover:from-red-700 hover:to-red-800 rounded-lg font-medium transition-all shadow-lg hover:shadow-xl flex items-center gap-2"
                    >
                        <FileDown className="w-5 h-5" />
                        Export Report
                    </button>
                )}
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-gradient-to-br from-red-50 to-red-100 p-6 rounded-xl shadow-md border border-red-200 hover:shadow-lg transition-shadow">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-sm text-red-700 font-semibold uppercase tracking-wide">Out of Stock</p>
                            <h3 className="text-4xl font-bold text-red-600 mt-2">{outOfStock.length}</h3>
                        </div>
                        <div className="bg-red-200 p-3 rounded-full">
                            <Package className="w-6 h-6 text-red-700" />
                        </div>
                    </div>
                </div>

                <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-6 rounded-xl shadow-md border border-orange-200 hover:shadow-lg transition-shadow">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-sm text-orange-700 font-semibold uppercase tracking-wide">Critical Low</p>
                            <h3 className="text-4xl font-bold text-orange-600 mt-2">{critical.length}</h3>
                        </div>
                        <div className="bg-orange-200 p-3 rounded-full">
                            <AlertTriangle className="w-6 h-6 text-orange-700" />
                        </div>
                    </div>
                </div>

                <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 p-6 rounded-xl shadow-md border border-yellow-200 hover:shadow-lg transition-shadow">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-sm text-yellow-700 font-semibold uppercase tracking-wide">Low Stock</p>
                            <h3 className="text-4xl font-bold text-yellow-600 mt-2">{low.length}</h3>
                        </div>
                        <div className="bg-yellow-200 p-3 rounded-full">
                            <TrendingDown className="w-6 h-6 text-yellow-700" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Alerts List */}
            {alerts.length === 0 ? (
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl shadow-md border border-green-200 p-12 text-center">
                    <CheckCircle className="w-20 h-20 text-green-600 mx-auto mb-4" />
                    <h3 className="text-2xl font-bold text-green-700 mb-2">All Good!</h3>
                    <p className="text-green-600">All products are adequately stocked. No alerts at this time.</p>
                </div>
            ) : (
                <div className="space-y-6">
                    {/* Out of Stock Section */}
                    {outOfStock.length > 0 && (
                        <div>
                            <h3 className="text-xl font-bold text-red-600 mb-4 flex items-center gap-2">
                                <Package className="w-5 h-5" />
                                Out of Stock ({outOfStock.length})
                            </h3>
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
                            <h3 className="text-xl font-bold text-orange-600 mb-4 flex items-center gap-2">
                                <AlertTriangle className="w-5 h-5" />
                                Critical Low Stock ({critical.length})
                            </h3>
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
                            <h3 className="text-xl font-bold text-yellow-600 mb-4 flex items-center gap-2">
                                <TrendingDown className="w-5 h-5" />
                                Low Stock ({low.length})
                            </h3>
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
    const severityColors = {
        OUT_OF_STOCK: 'border-red-400 bg-gradient-to-r from-red-50 to-red-100 hover:from-red-100 hover:to-red-150',
        CRITICAL: 'border-orange-400 bg-gradient-to-r from-orange-50 to-orange-100 hover:from-orange-100 hover:to-orange-150',
        LOW: 'border-yellow-400 bg-gradient-to-r from-yellow-50 to-yellow-100 hover:from-yellow-100 hover:to-yellow-150'
    };

    const percentage = alert.product.stockAlertThreshold > 0
        ? Math.round((alert.product.quantity / alert.product.stockAlertThreshold) * 100)
        : 0;

    return (
        <div className={`bg-white rounded-xl p-6 shadow-md border-l-4 ${severityColors[alert.severity]} transition-all cursor-pointer`}>
            <div className="flex justify-between items-start gap-4">
                <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                        <h4 className="text-lg font-bold text-cocoa">{alert.product.name}</h4>
                        <AlertChip severity={alert.severity} size="sm" />
                    </div>

                    <p className="text-cocoa/70 mb-4">{alert.message}</p>

                    <div className="flex items-center gap-6 text-sm flex-wrap">
                        <div className="flex items-center gap-2">
                            <span className="text-cocoa/60 font-medium">Current:</span>
                            <span className={`font-bold px-2 py-1 rounded ${alert.severity === 'OUT_OF_STOCK' ? 'bg-red-100 text-red-700' :
                                    alert.severity === 'CRITICAL' ? 'bg-orange-100 text-orange-700' :
                                        'bg-yellow-100 text-yellow-700'
                                }`}>
                                {alert.product.quantity} units
                            </span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-cocoa/60 font-medium">Threshold:</span>
                            <span className="font-medium text-cocoa">{alert.product.stockAlertThreshold} units</span>
                        </div>
                        {alert.severity !== 'OUT_OF_STOCK' && (
                            <div className="flex items-center gap-2">
                                <span className="text-cocoa/60 font-medium">Level:</span>
                                <span className="font-medium text-cocoa">{percentage}%</span>
                            </div>
                        )}
                    </div>
                </div>

                <button
                    onClick={() => navigate('/stock-in')}
                    className="px-5 py-2.5 bg-gradient-to-r from-forest to-green-700 text-white hover:from-green-700 hover:to-green-800 rounded-lg font-medium transition-all shadow-md hover:shadow-lg text-sm whitespace-nowrap flex items-center gap-2"
                >
                    <Package className="w-4 h-4" />
                    Restock
                </button>
            </div>
        </div>
    );
};

export default StockAlerts;
