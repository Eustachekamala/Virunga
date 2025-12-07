export const Unit = {
    KG: 'KG',
    LITER: 'LITER',
    BAG: 'BAG',
    BOX: 'BOX',
    UNIT: 'UNIT'
} as const;
export type Unit = typeof Unit[keyof typeof Unit];

export const MovementType = {
    IN: 'IN',
    OUT: 'OUT',
    ADJUSTMENT: 'ADJUSTMENT'
} as const;
export type MovementType = typeof MovementType[keyof typeof MovementType];

export interface RawMaterial {
    id: number;
    name: string;
    category: string;
    unit: Unit;
    currentStock: number;
    minimumStock: number;
    supplier: string;
    batchReference?: string;
}

export interface FinishedGood {
    id: number;
    sku: string;
    productName: string;
    quantity: number;
    storageLocation: string;
    expiryDate: string;
    batchNumber: string;
}

export interface StockMovement {
    id: number;
    type: MovementType;
    quantity: number;
    date: string;
    referenceEntity: string; // "RawMaterial" or "FinishedGood"
    referenceId: number;
    reason: string;
}

export interface WarehouseLocation {
    id: number;
    code: string; // e.g. A-01-02
    description: string;
    capacity: number;
    currentLoad: number;
    type: 'SHELF' | 'BIN' | 'PALLET' | 'SECTION';
}

export interface SupplierDelivery {
    id: number;
    supplierName: string;
    deliveryDate: string;
    status: 'PENDING' | 'RECEIVED' | 'INSPECTED';
    items: DeliveryItem[];
}

export interface DeliveryItem {
    rawMaterialId: number;
    quantity: number;
    unit: Unit;
}
