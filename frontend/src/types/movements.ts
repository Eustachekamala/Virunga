// Stock movement type definitions for Product Service
export const MovementType = {
    ENTREE: 'ENTREE',
    SORTIE: 'SORTIE',
} as const;

export type MovementType = typeof MovementType[keyof typeof MovementType];

export interface StockMovement {
    id: string;
    productId: number;
    productName: string;
    type: MovementType;
    quantity: number;
    date: string; // ISO date string
    reference?: string;
    supplier?: string;
    reason?: string;
    receiver?: string;
    user?: string;
    purpose?: string;
    createdBy?: string;
    notes?: string;
}

export interface MovementFilter {
    startDate?: string;
    endDate?: string;
    productId?: number;
    type?: MovementType;
    user?: string;
    category?: string;
    searchTerm?: string;
}

export interface DailySummary {
    date: string;
    entries: StockMovement[];
    exits: StockMovement[];
    totalEntriesQuantity: number;
    totalExitsQuantity: number;
}

export interface WeeklySummary {
    weekStart: string;
    weekEnd: string;
    entries: StockMovement[];
    exits: StockMovement[];
    dailyBreakdown: {
        date: string;
        entriesCount: number;
        exitsCount: number;
        entriesQuantity: number;
        exitsQuantity: number;
    }[];
}

export interface StockAlert {
    product: {
        id: number;
        name: string;
        quantity: number;
        stockAlertThreshold: number;
    };
    severity: 'OUT_OF_STOCK' | 'CRITICAL' | 'LOW';
    message: string;
}
