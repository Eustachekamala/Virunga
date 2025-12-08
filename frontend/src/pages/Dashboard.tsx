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
import { AlertTriangle, BarChart2, Package, Tag } from 'lucide-react';

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

    const COLORS = ['#D4AF37', '#2D4F1E']; // Gold, Forest

    // Top 5 Products by Quantity
    const barData = products
        .sort((a, b) => b.quantity - a.quantity)
        .slice(0, 5)
        .map(p => ({
            name: p.name.length > 15 ? p.name.substring(0, 15) + '...' : p.name,
            quantity: p.quantity
        }));

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <h2 className="text-4xl font-serif font-bold text-cocoa">Dashboard</h2>
                <div className="bg-white px-4 py-2 rounded-lg text-sm text-cocoa/60 border border-cocoa/10">
                    Last updated: {new Date().toLocaleTimeString()}
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Total Products"
                    value={products.length}
                    icon={<Package className="w-5 h-5" />}
                    bg="bg-cocoa"
                    textColor="text-gold"
                />
                <StatCard
                    title="Low Stock Alerts"
                    value={lowStockCount}
                    icon={<AlertTriangle className="w-5 h-5" />}
                    bg="bg-red-600"
                    textColor="text-white"
                />
                <StatCard
                    title="Total Inventory Size"
                    value={totalQuantity}
                    icon={<BarChart2 className="w-5 h-5" />}
                    bg="bg-forest"
                    textColor="text-white"
                />
                <StatCard
                    title="Product Types"
                    value={`${consumables} / ${nonConsumables}`}
                    subtitle="Consumable / Non"
                    icon={<Tag className="w-5 h-5" />}
                    bg="bg-white"
                    textColor="text-cocoa"
                    border
                />
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Inventory Distribution */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-cocoa/5">
                    <h3 className="text-xl font-bold text-cocoa mb-6 font-serif">Inventory Distribution</h3>
                    <div className="h-80" style={{ minHeight: '320px' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={pieData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={100}
                                    fill="#8884d8"
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {pieData.map((_, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Top Products */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-cocoa/5">
                    <h3 className="text-xl font-bold text-cocoa mb-6 font-serif">Top 5 Products</h3>
                    <div className="h-80" style={{ minHeight: '320px' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={barData} layout="vertical">
                                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                                <XAxis type="number" hide />
                                <YAxis dataKey="name" type="category" width={100} tick={{ fontSize: 12 }} />
                                <Tooltip cursor={{ fill: 'transparent' }} />
                                <Bar dataKey="quantity" fill="#2C1810" radius={[0, 4, 4, 0]} barSize={20} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
};

const StatCard = ({ title, value, subtitle, icon, bg, textColor, border }: any) => (
    <div className={`p-6 rounded-xl shadow-sm ${bg} ${border ? 'border border-cocoa/10' : ''}`}>
        <div className="flex justify-between items-start">
            <div>
                <p className={`text-sm font-medium opacity-80 ${textColor}`}>{title}</p>
                <h3 className={`text-3xl font-bold mt-2 ${textColor}`}>{value}</h3>
                {subtitle && <p className={`text-xs mt-1 opacity-60 ${textColor}`}>{subtitle}</p>}
            </div>
            <div className={`text-2xl p-2 rounded-lg bg-white/10 ${textColor}`}>
                {icon}
            </div>
        </div>
    </div>
);

export default Dashboard;
