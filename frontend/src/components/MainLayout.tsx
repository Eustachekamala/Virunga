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
    X
} from 'lucide-react';

const MainLayout = ({ children }: { children: React.ReactNode }) => {
    const { user, logout } = useAuthStore();
    const lowStockProducts = useProductStore(state => state.lowStockProducts);
    const fetchLowStockProducts = useProductStore(state => state.fetchLowStockProducts);

    useEffect(() => {
        fetchLowStockProducts();

        // Poll every 10 seconds to keep the badge updated
        const interval = setInterval(() => {
            fetchLowStockProducts();
        }, 10000);

        return () => clearInterval(interval);
    }, [fetchLowStockProducts]);

    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="flex h-screen bg-gradient-to-br from-cream via-white to-cream/50">
            {/* Sidebar - hidden on small screens, visible on md+ */}
            <aside className="hidden md:flex md:w-72 bg-gradient-to-b from-cocoa to-cocoa/95 text-cream shadow-2xl flex-col">
                {/* Logo/Header */}
                <div className="p-8 border-b border-white/10">
                    <h1 className="text-2xl font-serif font-bold text-gold flex items-center gap-3">
                        Virunga ToolHub
                    </h1>
                    <p className="text-sm text-white/60 mt-1 pl-9">
                        Central hub for tools & materials.
                    </p>
                </div>


                <nav className="flex-1 py-8 px-4 space-y-2">
                    <NavItem to="/" exact icon={<LayoutDashboard className="w-5 h-5" />}>
                        Dashboard
                    </NavItem>
                    <NavItem to="/inventory" badge={lowStockProducts.length} icon={<Package className="w-5 h-5" />}>
                        Inventory
                    </NavItem>

                    <div className="pt-6 pb-2 px-4">
                        <p className="text-xs text-white/40 uppercase tracking-wider font-medium">Stock Operations</p>
                    </div>
                    <NavItem to="/stock-in" icon={<ArrowDownToLine className="w-5 h-5" />}>
                        Stock IN (Entrée)
                    </NavItem>
                    <NavItem to="/stock-out" icon={<ArrowUpFromLine className="w-5 h-5" />}>
                        Stock OUT (Sortie)
                    </NavItem>

                    <div className="pt-6 pb-2 px-4">
                        <p className="text-xs text-white/40 uppercase tracking-wider font-medium">Reports & Views</p>
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
                        Movement History
                    </NavItem>
                </nav>

                <div className="p-6 border-t border-white/10 bg-black/20">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-full bg-gold/20 flex items-center justify-center text-gold overflow-hidden">
                            {user?.avatar ? <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" /> : <User className="w-5 h-5" />}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">{user?.name || 'User'}</p>
                            <p className="text-xs text-white/50 truncate capitalize">{user?.role?.replace('_', ' ') || 'Guest'}</p>
                        </div>
                    </div>
                    <button
                        onClick={logout}
                        className="w-full flex items-center justify-center gap-2 py-2 px-4 bg-white/5 hover:bg-white/10 text-white/80 hover:text-red-400 rounded-lg transition-colors text-sm font-medium"
                    >
                        <LogOut className="w-4 h-4" /> Sign Out
                    </button>
                </div>
            </aside>

            {/* Mobile drawer (off-canvas) */}
            {sidebarOpen && (
                <div className="fixed inset-0 z-50 md:hidden">
                    <div className="absolute inset-0 bg-black/40" onClick={() => setSidebarOpen(false)} />
                    <aside className="absolute left-0 top-0 bottom-0 w-64 bg-gradient-to-b from-cocoa to-cocoa/95 text-cream shadow-2xl flex flex-col p-4">
                        <div className="flex items-center justify-between p-2">
                            <h2 className="text-lg font-bold text-gold">Virunga ToolHub</h2>
                            <button onClick={() => setSidebarOpen(false)} aria-label="Close menu" className="text-cream">
                                <X className="w-6 h-6" />
                            </button>
                        </div>
                        <nav className="mt-4 space-y-2">
                            <NavItem to="/" exact icon={<LayoutDashboard className="w-5 h-5" />}>Dashboard</NavItem>
                            <NavItem to="/inventory" badge={lowStockProducts.length} icon={<Package className="w-5 h-5" />}>Inventory</NavItem>
                            <div className="pt-6 pb-2 px-2">
                                <p className="text-xs text-white/40 uppercase tracking-wider font-medium">Stock Operations</p>
                            </div>
                            <NavItem to="/stock-in" icon={<ArrowDownToLine className="w-5 h-5" />}>Stock IN (Entrée)</NavItem>
                            <NavItem to="/stock-out" icon={<ArrowUpFromLine className="w-5 h-5" />}>Stock OUT (Sortie)</NavItem>
                            <div className="pt-6 pb-2 px-2">
                                <p className="text-xs text-white/40 uppercase tracking-wider font-medium">Reports & Views</p>
                            </div>
                            <NavItem to="/daily" icon={<Calendar className="w-5 h-5" />}>Daily Views</NavItem>
                            <NavItem to="/weekly" icon={<CalendarDays className="w-5 h-5" />}>Weekly Views</NavItem>
                            <NavItem to="/alerts" icon={<AlertTriangle className="w-5 h-5" />}>Stock Alerts</NavItem>
                            <NavItem to="/history" icon={<History className="w-5 h-5" />}>Movement History</NavItem>
                        </nav>
                        <div className="mt-auto p-4 border-t border-white/10">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="w-10 h-10 rounded-full bg-gold/20 flex items-center justify-center text-gold overflow-hidden">
                                    {user?.avatar ? <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" /> : <User className="w-5 h-5" />}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium truncate">{user?.name || 'User'}</p>
                                    <p className="text-xs text-white/50 truncate capitalize">{user?.role?.replace('_', ' ') || 'Guest'}</p>
                                </div>
                            </div>
                            <button
                                onClick={logout}
                                className="w-full flex items-center justify-center gap-2 py-2 px-4 bg-white/5 hover:bg-white/10 text-white/80 hover:text-red-400 rounded-lg transition-colors text-sm font-medium"
                            >
                                <LogOut className="w-4 h-4" /> Sign Out
                            </button>
                        </div>
                    </aside>
                </div>
            )}

            {/* Main Content */}
            {/* Main Content */}
            <main className="flex-1 overflow-y-auto">
                {/* Mobile header */}
                <div className="md:hidden flex items-center justify-between p-4 border-b border-white/10 bg-transparent">
                    <button onClick={() => setSidebarOpen(true)} aria-label="Open menu" className="text-cocoa">
                        <Menu className="w-6 h-6" />
                    </button>
                    <h1 className="text-lg font-semibold">Virunga ToolHub</h1>
                    <div />
                </div>

                <div className="p-4 sm:p-6 md:p-8 max-w-7xl mx-auto">
                    {children}
                </div>
            </main>
        </div>
    );
};

const NavItem = ({
    to,
    children,
    exact = false,
    badge,
    icon
}: {
    to: string;
    children: React.ReactNode;
    exact?: boolean;
    badge?: number;
    icon?: React.ReactNode;
}) => {
    return (
        <NavLink
            to={to}
            end={exact}
            className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group relative ${isActive
                    ? 'bg-gold text-cocoa font-semibold shadow-lg shadow-gold/20'
                    : 'text-white/80 hover:bg-white/10 hover:text-white'
                }`
            }
        >
            <span className="transition-transform group-hover:scale-110">{icon}</span>
            <span className="flex-1">{children}</span>
            {badge !== undefined && badge > 0 && (
                <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full min-w-[20px] text-center animate-pulse">
                    {badge}
                </span>
            )}
        </NavLink>
    );
};

export default MainLayout;
