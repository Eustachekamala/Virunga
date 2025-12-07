import { create } from 'zustand';
import { StockMovement, MovementFilter, DailySummary, WeeklySummary, StockAlert } from '../types/movements';
import * as stockMovementsService from '../services/stockMovements';

interface StockMovementState {
    // State
    movements: StockMovement[];
    alerts: StockAlert[];
    dailySummary: DailySummary | null;
    weeklySummary: WeeklySummary | null;
    loading: boolean;
    error: string | null;

    // Actions
    addStockEntry: (data: Omit<StockMovement, 'id' | 'type'>) => Promise<void>;
    addStockExit: (data: Omit<StockMovement, 'id' | 'type'>) => Promise<void>;
    fetchMovements: () => void;
    filterMovements: (filter: MovementFilter) => StockMovement[];
    fetchAlerts: () => void;
    fetchDailySummary: (date: Date) => void;
    fetchWeeklySummary: (date: Date) => void;
    clearMovements: () => void;
    deleteMovement: (id: string) => void;
    clearError: () => void;
}

export const useStockMovementStore = create<StockMovementState>((set, get) => ({
    // Initial state
    movements: [],
    alerts: [],
    dailySummary: null,
    weeklySummary: null,
    loading: false,
    error: null,

    // Add stock entry
    addStockEntry: async (data: Omit<StockMovement, 'id' | 'type'>) => {
        set({ loading: true, error: null });
        try {
            await stockMovementsService.addStockEntry(data);
            // Refresh movements
            get().fetchMovements();
            set({ loading: false });
        } catch (error: any) {
            set({ error: error.message || 'Failed to add stock entry', loading: false });
            throw error;
        }
    },

    // Add stock exit
    addStockExit: async (data: Omit<StockMovement, 'id' | 'type'>) => {
        set({ loading: true, error: null });
        try {
            await stockMovementsService.addStockExit(data);
            // Refresh movements
            get().fetchMovements();
            set({ loading: false });
        } catch (error: any) {
            set({ error: error.message || 'Failed to add stock exit', loading: false });
            throw error;
        }
    },

    // Fetch all movements
    fetchMovements: () => {
        const movements = stockMovementsService.getMovements();
        set({ movements });
    },

    // Filter movements
    filterMovements: (filter: MovementFilter) => {
        const movements = get().movements;
        return stockMovementsService.filterMovements(movements, filter);
    },

    // Fetch stock alerts
    fetchAlerts: async () => {
        const alerts = await stockMovementsService.getStockAlerts();
        set({ alerts });
    },

    // Fetch daily summary
    fetchDailySummary: (date: Date) => {
        set({ loading: true });
        const dailySummary = stockMovementsService.getDailySummary(date);
        set({ dailySummary, loading: false });
    },

    // Fetch weekly summary
    fetchWeeklySummary: (date: Date) => {
        set({ loading: true });
        const weeklySummary = stockMovementsService.getWeeklySummary(date);
        set({ weeklySummary, loading: false });
    },

    // Clear all movements
    clearMovements: () => {
        stockMovementsService.clearAllMovements();
        set({ movements: [], dailySummary: null, weeklySummary: null });
    },

    // Delete single movement
    deleteMovement: (id: string) => {
        stockMovementsService.deleteMovement(id);
        get().fetchMovements();
    },

    // Clear error
    clearError: () => {
        set({ error: null });
    },
}));
