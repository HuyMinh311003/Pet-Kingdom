import axios from '../admin-api/axiosConfig';

export interface SalesData {
    date: string;
    amount: number;
}
export interface CategorySales {
    category: string;
    sales: number;
}
export interface DeliveryCost {
    month: string;
    cost: number;
    orders: number;
}

/**
 * Lấy doanh thu tổng quan
 * @param range 'week' | 'month' | 'year'
 */
export const getSalesOverview = (range: 'week' | 'month' | 'year') => {
    return axios.get<{ success: boolean; data: SalesData[] }>(
        `/admin/analytics/sales`,
        { params: { range } }
    );
};

/**
 * Lấy doanh thu theo danh mục
 * @param range 'week' | 'month' | 'year'
 */
export const getCategorySales = (range: 'week' | 'month' | 'year') => {
    return axios.get<{ success: boolean; data: CategorySales[] }>(
        `/admin/analytics/category-sales`,
        { params: { range } }
    );
};

/**
 * Lấy chi phí giao hàng trung bình
 * @param months số tháng cần lấy, mặc định 6
 */
export const getDeliveryCosts = (months: number = 6) => {
    return axios.get<{ success: boolean; data: DeliveryCost[] }>(
        `/admin/analytics/delivery-costs`,
        { params: { months } }
    );
};
