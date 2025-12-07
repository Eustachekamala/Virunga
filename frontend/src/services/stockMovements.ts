import {
    StockMovement,
    MovementType,
    MovementFilter,
    DailySummary,
    WeeklySummary,
    StockAlert
} from '../types/movements';
import { getProducts, getProductById } from './api';
import { startOfDay, endOfDay, startOfWeek, endOfWeek, isWithinInterval, format, addDays } from 'date-fns';

const STORAGE_KEY = 'virunga_stock_movements';

// Get all movements from localStorage
export const getMovements = (): StockMovement[] => {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
};

// Save movements to localStorage
const saveMovements = (movements: StockMovement[]): void => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(movements));
};

// Generate unique ID
const generateId = (): string => {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

// Add stock entry (IN)
export const addStockEntry = async (entry: Omit<StockMovement, 'id' | 'type' | 'productName'>): Promise<void> => {
    const product = await getProductById(entry.productId);
    const movements = getMovements();

    const newMovement: StockMovement = {
        ...entry,
        id: generateId(),
        type: MovementType.ENTREE,
        productName: product.name,
        date: entry.date || new Date().toISOString(),
    };

    movements.push(newMovement);
    saveMovements(movements);

    // Note: Product quantity update should be handled by calling updateProduct from API
    // This service just tracks the movements
};

// Add stock exit (OUT)
export const addStockExit = async (exit: Omit<StockMovement, 'id' | 'type' | 'productName'>): Promise<void> => {
    const product = await getProductById(exit.productId);

    // Validate sufficient stock
    if (product.quantity < exit.quantity) {
        throw new Error(`Insufficient stock. Available: ${product.quantity}, Requested: ${exit.quantity}`);
    }

    const movements = getMovements();

    const newMovement: StockMovement = {
        ...exit,
        id: generateId(),
        type: MovementType.SORTIE,
        productName: product.name,
        date: exit.date || new Date().toISOString(),
    };

    movements.push(newMovement);
    saveMovements(movements);
};

// Filter movements
export const filterMovements = (filter: MovementFilter): StockMovement[] => {
    let movements = getMovements();

    if (filter.startDate && filter.endDate) {
        const start = new Date(filter.startDate);
        const end = new Date(filter.endDate);
        movements = movements.filter(m =>
            isWithinInterval(new Date(m.date), { start, end })
        );
    }

    if (filter.productId) {
        movements = movements.filter(m => m.productId === filter.productId);
    }

    if (filter.type) {
        movements = movements.filter(m => m.type === filter.type);
    }

    if (filter.user) {
        movements = movements.filter(m =>
            m.user?.toLowerCase().includes(filter.user!.toLowerCase()) ||
            m.receiver?.toLowerCase().includes(filter.user!.toLowerCase())
        );
    }

    if (filter.searchTerm) {
        const term = filter.searchTerm.toLowerCase();
        movements = movements.filter(m =>
            m.productName.toLowerCase().includes(term) ||
            m.reference?.toLowerCase().includes(term) ||
            m.supplier?.toLowerCase().includes(term) ||
            m.notes?.toLowerCase().includes(term)
        );
    }

    return movements.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};

// Get daily summary
export const getDailySummary = (date: Date = new Date()): DailySummary => {
    const start = startOfDay(date);
    const end = endOfDay(date);

    const movements = filterMovements({
        startDate: start.toISOString(),
        endDate: end.toISOString(),
    });

    const entries = movements.filter(m => m.type === MovementType.ENTREE);
    const exits = movements.filter(m => m.type === MovementType.SORTIE);

    return {
        date: format(date, 'yyyy-MM-dd'),
        entries,
        exits,
        totalEntriesQuantity: entries.reduce((sum, e) => sum + e.quantity, 0),
        totalExitsQuantity: exits.reduce((sum, e) => sum + e.quantity, 0),
    };
};

// Get weekly summary
export const getWeeklySummary = (date: Date = new Date()): WeeklySummary => {
    const start = startOfWeek(date, { weekStartsOn: 1 }); // Monday
    const end = endOfWeek(date, { weekStartsOn: 1 }); // Sunday

    const movements = filterMovements({
        startDate: start.toISOString(),
        endDate: end.toISOString(),
    });

    const entries = movements.filter(m => m.type === MovementType.ENTREE);
    const exits = movements.filter(m => m.type === MovementType.SORTIE);

    // Create daily breakdown
    const dailyBreakdown = [];
    for (let i = 0; i < 7; i++) {
        const currentDay = addDays(start, i);
        const dayStart = startOfDay(currentDay);
        const dayEnd = endOfDay(currentDay);

        const dayMovements = movements.filter(m =>
            isWithinInterval(new Date(m.date), { start: dayStart, end: dayEnd })
        );

        const dayEntries = dayMovements.filter(m => m.type === MovementType.ENTREE);
        const dayExits = dayMovements.filter(m => m.type === MovementType.SORTIE);

        dailyBreakdown.push({
            date: format(currentDay, 'yyyy-MM-dd'),
            entriesCount: dayEntries.length,
            exitsCount: dayExits.length,
            entriesQuantity: dayEntries.reduce((sum, e) => sum + e.quantity, 0),
            exitsQuantity: dayExits.reduce((sum, e) => sum + e.quantity, 0),
        });
    }

    return {
        weekStart: format(start, 'yyyy-MM-dd'),
        weekEnd: format(end, 'yyyy-MM-dd'),
        entries,
        exits,
        dailyBreakdown,
    };
};

// Get stock alerts
export const getStockAlerts = async (): Promise<StockAlert[]> => {
    const products = await getProducts();
    const alerts: StockAlert[] = [];

    for (const product of products) {
        const threshold = product.stockAlertThreshold || 10;

        if (product.quantity === 0) {
            alerts.push({
                product: {
                    id: product.id,
                    name: product.name,
                    quantity: product.quantity,
                    stockAlertThreshold: threshold,
                },
                severity: 'OUT_OF_STOCK',
                message: `${product.name} is out of stock`,
            });
        } else if (product.quantity <= threshold * 0.3) {
            alerts.push({
                product: {
                    id: product.id,
                    name: product.name,
                    quantity: product.quantity,
                    stockAlertThreshold: threshold,
                },
                severity: 'CRITICAL',
                message: `${product.name} is critically low (${product.quantity} units remaining)`,
            });
        } else if (product.quantity <= threshold) {
            alerts.push({
                product: {
                    id: product.id,
                    name: product.name,
                    quantity: product.quantity,
                    stockAlertThreshold: threshold,
                },
                severity: 'LOW',
                message: `${product.name} is approaching low stock (${product.quantity} units remaining)`,
            });
        }
    }

    return alerts.sort((a, b) => {
        const severityOrder = { OUT_OF_STOCK: 0, CRITICAL: 1, LOW: 2 };
        return severityOrder[a.severity] - severityOrder[b.severity];
    });
};

// Delete movement (for corrections)
export const deleteMovement = (id: string): void => {
    const movements = getMovements().filter(m => m.id !== id);
    saveMovements(movements);
};

// Clear all movements (for testing/reset)
export const clearAllMovements = (): void => {
    localStorage.removeItem(STORAGE_KEY);
};
