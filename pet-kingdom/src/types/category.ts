export interface Category {
    id: string;
    name: string;
    type: 'pets' | 'tools';
    slug: string;
    children?: Category[];
    hasChildren?: boolean;
    parentId?: string | null;
}

export interface CategoryResponse {
    success: boolean;
    data: Category[];
}