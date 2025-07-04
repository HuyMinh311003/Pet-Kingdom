import React, { useState, useEffect } from 'react';
import { Line, Bar } from 'react-chartjs-2';
import { getSalesOverview, getCategorySales, getDeliveryCosts } from '../../../services/admin-api/analyticsApi';

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartData,
  ChartOptions
} from 'chart.js';
import './AnalyticsPage.css';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface SalesData {
  date: string;
  amount: number;
}

interface CategorySales {
  category: string;
  sales: number;
}

interface DeliveryCost {
  month: string;
  cost: number;
  orders: number;
}

const AnalyticsPage: React.FC = () => {
  const [dateRange, setDateRange] = useState<'week' | 'month' | 'year'>('week');
  const [salesData, setSalesData] = useState<SalesData[]>([]);
  const [categorySales, setCategorySales] = useState<CategorySales[]>([]);
  const [deliveryCosts, setDeliveryCosts] = useState<DeliveryCost[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [salesRes, catRes, delRes] = await Promise.all([
          getSalesOverview(dateRange),
          getCategorySales(dateRange),
          getDeliveryCosts(6)        // hoặc months tuỳ biến
        ]);

        if (salesRes.data.success) setSalesData(salesRes.data.data);
        if (catRes.data.success) setCategorySales(catRes.data.data);
        if (delRes.data.success) setDeliveryCosts(delRes.data.data);
      } catch (error) {
        console.error('Lỗi khi lấy dữ liệu analytics:', error);
      }
    };

    fetchData();
  }, [dateRange]);


  const salesChartData: ChartData<'line'> = {
    labels: salesData.map(d => d.date),
    datasets: [
      {
        label: 'Doanh thu (VND)',
        data: salesData.map(d => d.amount),
        borderColor: '#ffc371',
        backgroundColor: 'rgba(255, 195, 113, 0.1)',
        fill: true,
        tension: 0.4
      }
    ]
  };

  // Cấu hình data cho biểu đồ doanh thu theo danh mục
  const categoryChartData: ChartData<'bar'> = {
    labels: categorySales.map(c => c.category),
    datasets: [
      {
        label: 'Doanh thu theo danh mục (VND)',
        data: categorySales.map(c => c.sales),
        backgroundColor: [
          'rgba(255, 195, 113, 0.8)',
          'rgba(129, 140, 248, 0.8)',
          'rgba(52, 211, 153, 0.8)'
        ]
      }
    ]
  };

  // Cấu hình data cho biểu đồ chi phí giao hàng trung bình
  const deliveryChartData: ChartData<'line'> = {
    labels: deliveryCosts.map(d => d.month),
    datasets: [
      {
        label: 'Chi phí giao trung bình / đơn (VND)',
        data: deliveryCosts.map(d => d.cost / d.orders),
        borderColor: '#818cf8',
        backgroundColor: 'rgba(129, 140, 248, 0.1)',
        fill: true,
        tension: 0.4
      }
    ]
  };

  // Cấu hình chung cho chart
  const chartOptions: ChartOptions<'line' | 'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'top' }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: (value) => {
            if (typeof value === 'number') {
              return new Intl.NumberFormat('vi-VN', {
                style: 'currency',
                currency: 'VND',
                maximumFractionDigits: 0
              }).format(value);
            }
            return value;
          }
        }
      }
    }
  };

  return (
    <div className="analytics-page">
      <div className="analytics-header">
        <h1>Bảng Thống Kê</h1>
        <div className="date-range-filter">
          <button
            className={dateRange === 'week' ? 'active' : ''}
            onClick={() => setDateRange('week')}
          >
            Tuần
          </button>
          <button
            className={dateRange === 'month' ? 'active' : ''}
            onClick={() => setDateRange('month')}
          >
            Tháng
          </button>
          <button
            className={dateRange === 'year' ? 'active' : ''}
            onClick={() => setDateRange('year')}
          >
            Năm
          </button>
        </div>
      </div>

      <div className="analytics-grid">
        {/* Doanh thu tổng quan */}
        <div className="chart-container sales-chart">
          <h2>Doanh thu tổng quan</h2>
          <div className="chart-wrapper">
            <Line data={salesChartData} options={chartOptions} />
          </div>
        </div>

        {/* Doanh thu theo danh mục */}
        <div className="chart-container category-chart">
          <h2>Doanh thu theo danh mục</h2>
          <div className="chart-wrapper">
            <Bar data={categoryChartData} options={chartOptions} />
          </div>
        </div>

        {/* Chi phí giao hàng trung bình */}
        <div className="chart-container delivery-chart">
          <h2>Chi phí giao hàng trung bình (6 tháng)</h2>
          <div className="chart-wrapper">
            <Line data={deliveryChartData} options={chartOptions} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;
