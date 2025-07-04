export interface Category {
    _id: string;
    name: string;
    type: 'pet' | 'tool';
    children?: Category[];
    hasChildren?: boolean;
    parentId?: string | null;
    isActive: boolean;
}

export interface CategoryResponse {
    success: boolean;
    data: Category[];
}