import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Inventory from './pages/Inventory';
import StockIn from './pages/StockIn';
import StockOut from './pages/StockOut';
import DailyViews from './pages/DailyViews';
import WeeklyViews from './pages/WeeklyViews';
import StockAlerts from './pages/StockAlerts';
import History from './pages/History';
import { ToastToaster } from './components/ui/Toast';

function App() {
    return (
        <>
            <ToastToaster />
            <Layout>
                <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/inventory" element={<Inventory />} />
                    <Route path="/stock-in" element={<StockIn />} />
                    <Route path="/stock-out" element={<StockOut />} />
                    <Route path="/daily" element={<DailyViews />} />
                    <Route path="/weekly" element={<WeeklyViews />} />
                    <Route path="/alerts" element={<StockAlerts />} />
                    <Route path="/history" element={<History />} />

                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </Layout>
        </>
    );
}

export default App;
