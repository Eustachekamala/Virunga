import { useEffect, useState } from 'react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell
} from 'recharts';
import { getProducts, getLowStockProducts } from '../services/api';
import type { Product } from '../types';
import { AlertTriangle, BarChart2, Package, Tag, TrendingUp, Clock } from 'lucide-react';

const Dashboard = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [lowStockCount, setLowStockCount] = useState(0);

    useEffect(() => {
        const fetchData = async () => {
            const allProducts = await getProducts();
            const lowStock = await getLowStockProducts();
            setProducts(allProducts);
            setLowStockCount(lowStock.length);
        };
        fetchData();
    }, []);

    // Stats
    const totalQuantity = products.reduce((acc, curr) => acc + curr.quantity, 0);
    const consumables = products.filter(p => p.typeProduct === 'CONSUMABLE').length;
    const nonConsumables = products.filter(p => p.typeProduct === 'NON_CONSUMABLE').length;

    // Chart Data
    const pieData = [
        { name: 'Consumable', value: consumables },
        { name: 'Non-Consumable', value: nonConsumables },
    ];

    const COLORS = ['#D4AF37', '#2C1810']; // Gold, Cocoa

    // Top 5 Products by Quantity
    const barData = products
        .sort((a, b) => b.quantity - a.quantity)
        .slice(0, 5)
        .map(p => ({
            name: p.name.length > 15 ? p.name.substring(0, 15) + '...' : p.name,
            quantity: p.quantity
        }));

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                <div>
                    <h2 className="text-3xl md:text-4xl font-bold text-cocoa tracking-tight">Dashboard</h2>
                    <p className="text-cocoa/60 mt-2 text-sm">Overview of your inventory status.</p>
                </div>
                <div className="glass-panel px-4 py-2 rounded-lg text-xs font-medium text-cocoa/70 flex items-center gap-2">
                    <Clock className="w-3 h-3" />
                    Last updated: {new Date().toLocaleTimeString()}
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Total Products"
                    value={products.length}
                    icon={<Package className="w-5 h-5 text-white" />}
                    gradient="bg-gradient-to-br from-cocoa to-[#3E2723]"
                    textColor="text-white"
                />
                <StatCard
                    title="Low Stock Alerts"
                    value={lowStockCount}
                    icon={<AlertTriangle className="w-5 h-5 text-white" />}
                    gradient="bg-gradient-to-br from-red-600 to-red-700"
                    textColor="text-white"
                />
                <StatCard
                    title="Total Items"
                    value={totalQuantity}
                    icon={<BarChart2 className="w-5 h-5 text-white" />}
                    gradient="bg-gradient-to-br from-forest to-[#1a3311]"
                    textColor="text-white"
                />
                <StatCard
                    title="Product Types"
                    value={`${consumables}/${nonConsumables}`}
                    subtitle="Consumable / Non"
                    icon={<Tag className="w-5 h-5 text-cocoa" />}
                    gradient="bg-white"
                    textColor="text-cocoa"
                    isLight
                />
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Inventory Distribution */}
                <div className="glass-panel p-6 md:p-8 rounded-2xl">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h3 className="text-lg font-bold text-cocoa">Distribution</h3>
                            <p className="text-xs text-cocoa/50">Consumable vs Non-Consumable</p>
                        </div>
                        <div className="p-2 bg-gold/10 rounded-lg">
                            <TrendingUp className="w-5 h-5 text-gold" />
                        </div>
                    </div>

                    <div className="h-80 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={pieData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={80}
                                    outerRadius={100}
                                    paddingAngle={5}
                                    dataKey="value"
                                    stroke="none"
                                >
                                    {pieData.map((_, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: 'rgba(255, 255, 255, 0.9)',
                                        borderRadius: '12px',
                                        border: 'none',
                                        boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
                                    }}
                                />
                                <Legend verticalAlign="bottom" height={36} iconType="circle" />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Top Products */}
                <div className="glass-panel p-6 md:p-8 rounded-2xl">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h3 className="text-lg font-bold text-cocoa">Top Inventory</h3>
                            <p className="text-xs text-cocoa/50">Highest quantity items</p>
                        </div>
                        <div className="p-2 bg-cocoa/5 rounded-lg">
                            <BarChart2 className="w-5 h-5 text-cocoa" />
                        </div>
                    </div>

                    <div className="h-80 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={barData} layout="vertical" margin={{ left: 20 }}>
                                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#EFEBE0" />
                                <XAxis type="number" hide />
                                <YAxis
                                    dataKey="name"
                                    type="category"
                                    width={100}
                                    tick={{ fontSize: 12, fill: '#5D4037', fontWeight: 500 }}
                                    axisLine={false}
                                    tickLine={false}
                                />
                                <Tooltip
                                    cursor={{ fill: 'rgba(212, 175, 55, 0.1)' }}
                                    contentStyle={{
                                        backgroundColor: 'rgba(255, 255, 255, 0.9)',
                                        borderRadius: '12px',
                                        border: 'none',
                                        boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
                                    }}
                                />
                                <Bar
                                    dataKey="quantity"
                                    fill="#2C1810"
                                    radius={[0, 6, 6, 0]}
                                    barSize={24}
                                    background={{ fill: '#F5F5F5' }}
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const StatCard = ({ title, value, subtitle, icon, gradient, textColor, isLight }: any) => (
    <div className={`p-6 rounded-2xl shadow-lg relative overflow-hidden group transition-all duration-300 hover:scale-[1.02] hover:shadow-xl ${gradient}`}>
        {/* Background Pattern */}
        <div className="absolute right-0 top-0 w-32 h-32 bg-white/5 rounded-full -mr-10 -mt-10 blur-2xl group-hover:bg-white/10 transition-colors"></div>

        <div className="relative z-10 flex justify-between items-start">
            <div>
                <p className={`text-sm font-medium ${isLight ? 'text-cocoa/60' : 'text-white/70'}`}>{title}</p>
                <h3 className={`text-3xl font-bold mt-2 tracking-tight ${textColor}`}>{value}</h3>
                {subtitle && <p className={`text-xs mt-1 ${isLight ? 'text-cocoa/40' : 'text-white/40'}`}>{subtitle}</p>}
            </div>
            <div className={`p-3 rounded-xl ${isLight ? 'bg-cocoa/5 shadow-sm' : 'bg-white/10 backdrop-blur-sm'}`}>
                {icon}
            </div>
        </div>
    </div>
);

export default Dashboard;
