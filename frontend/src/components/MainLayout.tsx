import { NavLink } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useProductStore, useAuthStore } from '../stores';
import {
    LayoutDashboard,
    Package,
    ArrowDownToLine,
    ArrowUpFromLine,
    Calendar,
    CalendarDays,
    AlertTriangle,
    History,
    User,
    LogOut,
    Menu,
    X,
    ChevronRight
} from 'lucide-react';

const MainLayout = ({ children }: { children: React.ReactNode }) => {
    const { user, logout } = useAuthStore();
    const lowStockProducts = useProductStore(state => state.lowStockProducts);
    const fetchLowStockProducts = useProductStore(state => state.fetchLowStockProducts);
    const [sidebarOpen, setSidebarOpen] = useState(false);

    useEffect(() => {
        fetchLowStockProducts();
        const interval = setInterval(() => {
            fetchLowStockProducts();
        }, 10000);
        return () => clearInterval(interval);
    }, [fetchLowStockProducts]);

    return (
        <div className="flex h-screen bg-cream overflow-hidden">
            {/* Sidebar - hidden on small screens, visible on md+ */}
            <aside className="hidden md:flex flex-col w-72 h-full bg-cocoa text-cream shadow-2xl z-20 transition-all duration-300 relative border-r border-white/5">
                {/* Background Decor */}
                <div className="absolute inset-0 bg-gradient-to-b from-cocoa via-[#3E2723] to-cocoa opacity-90"></div>

                {/* Content Container */}
                <div className="relative flex flex-col h-full z-10">
                    {/* Header */}
                    <div className="p-8 pb-6">
                        <div className="flex items-center gap-3 mb-1">
                            <div className="bg-gold p-1.5 rounded-lg shadow-lg shadow-gold/20">
                                <Package className="w-6 h-6 text-cocoa" />
                            </div>
                            <h1 className="text-2xl font-bold tracking-tight text-gold">
                                ToolHub
                            </h1>
                        </div>
                        <p className="text-xs text-white/50 pl-1">Virunga Chocolate Factory</p>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 px-4 space-y-1 overflow-y-auto no-scrollbar py-4">
                        <NavItem to="/" exact icon={<LayoutDashboard className="w-5 h-5" />}>
                            Dashboard
                        </NavItem>
                        <NavItem to="/inventory" badge={lowStockProducts.length} icon={<Package className="w-5 h-5" />}>
                            Inventory
                        </NavItem>

                        <div className="pt-6 pb-3 px-4">
                            <p className="text-[10px] text-white/40 uppercase tracking-widest font-bold">Stock Operations</p>
                        </div>
                        <NavItem to="/stock-in" icon={<ArrowDownToLine className="w-5 h-5" />}>
                            Stock In
                        </NavItem>
                        <NavItem to="/stock-out" icon={<ArrowUpFromLine className="w-5 h-5" />}>
                            Stock Out
                        </NavItem>

                        <div className="pt-6 pb-3 px-4">
                            <p className="text-[10px] text-white/40 uppercase tracking-widest font-bold">Analytics</p>
                        </div>
                        <NavItem to="/daily" icon={<Calendar className="w-5 h-5" />}>
                            Daily Views
                        </NavItem>
                        <NavItem to="/weekly" icon={<CalendarDays className="w-5 h-5" />}>
                            Weekly Views
                        </NavItem>
                        <NavItem to="/alerts" icon={<AlertTriangle className="w-5 h-5" />}>
                            Stock Alerts
                        </NavItem>
                        <NavItem to="/history" icon={<History className="w-5 h-5" />}>
                            History
                        </NavItem>
                    </nav>

                    {/* User Footer */}
                    <div className="p-4 m-4 mt-2 rounded-xl bg-white/5 border border-white/5 backdrop-blur-sm">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-9 h-9 rounded-full bg-gold/20 ring-1 ring-gold/30 flex items-center justify-center text-gold overflow-hidden shrink-0">
                                {user?.avatar ? <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" /> : <User className="w-5 h-5" />}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold truncate text-white/90">{user?.name || 'User'}</p>
                                <p className="text-[10px] text-white/50 truncate capitalize tracking-wide">{user?.role?.replace('_', ' ') || 'Guest'}</p>
                            </div>
                        </div>
                        <button
                            onClick={logout}
                            className="w-full flex items-center justify-center gap-2 py-2 px-4 bg-white/10 hover:bg-red-500/20 text-white/70 hover:text-red-300 rounded-lg transition-all duration-200 text-xs font-medium border border-transparent hover:border-red-500/20 group"
                        >
                            <LogOut className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
                            Sign Out
                        </button>
                    </div>
                </div>
            </aside>

            {/* Mobile Sidebar Overlay */}
            {sidebarOpen && (
                <div className="fixed inset-0 z-50 md:hidden font-sans">
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" onClick={() => setSidebarOpen(false)} />
                    <aside className="absolute left-0 top-0 bottom-0 w-72 bg-cocoa text-cream shadow-2xl flex flex-col z-50 animate-in slide-in-from-left duration-300">
                        <div className="flex items-center justify-between p-6 border-b border-white/5">
                            <div className="flex items-center gap-2">
                                <div className="bg-gold p-1 rounded">
                                    <Package className="w-5 h-5 text-cocoa" />
                                </div>
                                <h2 className="text-lg font-bold text-gold">ToolHub</h2>
                            </div>
                            <button onClick={() => setSidebarOpen(false)} className="p-2 hover:bg-white/10 rounded-full text-white/70 transition-colors">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <nav className="flex-1 overflow-y-auto p-4 space-y-1">
                            <NavItem to="/" exact icon={<LayoutDashboard className="w-5 h-5" />} onClick={() => setSidebarOpen(false)}>Dashboard</NavItem>
                            <NavItem to="/inventory" badge={lowStockProducts.length} icon={<Package className="w-5 h-5" />} onClick={() => setSidebarOpen(false)}>Inventory</NavItem>
                            <div className="pt-4 pb-2 px-2"><p className="text-xs text-white/40 uppercase tracking-wider font-bold">Actions</p></div>
                            <NavItem to="/stock-in" icon={<ArrowDownToLine className="w-5 h-5" />} onClick={() => setSidebarOpen(false)}>Stock In</NavItem>
                            <NavItem to="/stock-out" icon={<ArrowUpFromLine className="w-5 h-5" />} onClick={() => setSidebarOpen(false)}>Stock Out</NavItem>
                            <div className="pt-4 pb-2 px-2"><p className="text-xs text-white/40 uppercase tracking-wider font-bold">Data</p></div>
                            <NavItem to="/daily" icon={<Calendar className="w-5 h-5" />} onClick={() => setSidebarOpen(false)}>Daily</NavItem>
                            <NavItem to="/weekly" icon={<CalendarDays className="w-5 h-5" />} onClick={() => setSidebarOpen(false)}>Weekly</NavItem>
                            <NavItem to="/alerts" icon={<AlertTriangle className="w-5 h-5" />} onClick={() => setSidebarOpen(false)}>Alerts</NavItem>
                            <NavItem to="/history" icon={<History className="w-5 h-5" />} onClick={() => setSidebarOpen(false)}>History</NavItem>
                        </nav>
                        <div className="p-4 border-t border-white/5 bg-black/20">
                            <button onClick={logout} className="flex items-center justify-center w-full gap-2 p-3 text-sm text-red-300 bg-red-500/10 rounded-lg">
                                <LogOut className="w-4 h-4" /> Sign Out
                            </button>
                        </div>
                    </aside>
                </div>
            )}

            {/* Main Content Area */}
            <main className="flex-1 relative flex flex-col h-screen overflow-hidden bg-cream">
                {/* Top Mobile Header */}
                <header className="md:hidden flex items-center justify-between p-4 bg-white/80 backdrop-blur border-b border-cocoa/5 shadow-sm sticky top-0 z-30">
                    <button onClick={() => setSidebarOpen(true)} className="p-2 text-cocoa hover:bg-cocoa/5 rounded-lg">
                        <Menu className="w-6 h-6" />
                    </button>
                    <span className="font-bold text-lg text-cocoa">Virunga ToolHub</span>
                    <div className="w-10" /> {/* Spacer */}
                </header>

                {/* Scrollable Content */}
                <div className="flex-1 overflow-y-auto relative no-scrollbar">
                    <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-gold/5 via-transparent to-transparent opacity-50"></div>
                    <div className="p-4 sm:p-6 lg:p-10 max-w-[1600px] mx-auto min-h-full pb-20">
                        {children}
                    </div>
                </div>
            </main>
        </div>
    );
};

interface NavItemProps {
    to: string;
    children: React.ReactNode;
    exact?: boolean;
    badge?: number;
    icon?: React.ReactNode;
    onClick?: () => void;
}

const NavItem = ({ to, children, exact = false, badge, icon, onClick }: NavItemProps) => {
    return (
        <NavLink
            to={to}
            end={exact}
            onClick={onClick}
            className={({ isActive }) =>
                `group relative flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${isActive
                    ? 'bg-gradient-to-r from-gold/20 to-transparent text-gold font-medium'
                    : 'text-white/60 hover:text-white hover:bg-white/5'
                }`
            }
        >
            {({ isActive }) => (
                <>
                    {/* Active Indicator Line */}
                    {isActive && (
                        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-gold rounded-r-full shadow-[0_0_12px_rgba(212,175,55,0.6)]" />
                    )}

                    <span className={`relative z-10 transition-colors duration-300 ${isActive ? 'text-gold' : 'text-current group-hover:text-white'}`}>
                        {icon}
                    </span>

                    <span className="flex-1 relative z-10 text-sm tracking-wide">{children}</span>

                    {badge !== undefined && badge > 0 && (
                        <span className="relative z-10 px-2 py-0.5 text-[10px] font-bold text-white bg-red-500 rounded-full shadow-lg shadow-red-500/30 animate-pulse">
                            {badge}
                        </span>
                    )}

                    {!isActive && (
                        <ChevronRight className="w-3 h-3 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 text-white/40" />
                    )}
                </>
            )}
        </NavLink>
    );
};

export default MainLayout;
