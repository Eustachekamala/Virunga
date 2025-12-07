export const Status = {
    URGENT: 'URGENT',
    NON_URGENT: 'NON_URGENT',
} as const;
export type Status = typeof Status[keyof typeof Status];

export const TypeProduct = {
    CONSUMABLE: 'CONSUMABLE',
    NON_CONSUMABLE: 'NON_CONSUMABLE',
} as const;
export type TypeProduct = typeof TypeProduct[keyof typeof TypeProduct];

export const Category = {
    ELECTRICITY: 'ELECTRICITY',
    PLUMBING: 'PLUMBING',
    ELECTRONICS: 'ELECTRONICS',
} as const;
export type Category = typeof Category[keyof typeof Category];

export interface Product {
    id: number;
    name: string;
    quantity: number;
    status: Status;
    typeProduct: TypeProduct;
    category: Category;
    stockAlertThreshold: number;
    description: string;
    createdAt: string;
    updatedAt: string;
    imageFile: string;
    lowStock: boolean;
}

export interface CreateProductDTO {
    name: string;
    quantity: number;
    description: string;
    category: Category;
    typeProduct: TypeProduct;
    imagFile?: File;
}

