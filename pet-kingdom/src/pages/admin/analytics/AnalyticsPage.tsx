import React, { useState, useEffect } from 'react';
import { Line, Bar } from 'react-chartjs-2';
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

// Register ChartJS components
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
    // TODO: Fetch real data from API
    // Mock data for now
    const mockSalesData: SalesData[] = Array.from({ length: 7 }, (_, i) => ({
      date: new Date(Date.now() - (6 - i) * 24 * 60 * 60 * 1000).toLocaleDateString(),
      amount: Math.floor(Math.random() * 50000000) + 10000000
    }));

    const mockCategorySales: CategorySales[] = [
      { category: 'Dogs', sales: 45000000 },
      { category: 'Cats', sales: 38000000 },
      { category: 'Pet Tools', sales: 25000000 }
    ];

    const mockDeliveryCosts: DeliveryCost[] = Array.from({ length: 6 }, (_, i) => ({
      month: new Date(2025, i, 1).toLocaleString('default', { month: 'short' }),
      cost: Math.floor(Math.random() * 5000000) + 1000000,
      orders: Math.floor(Math.random() * 50) + 10
    }));

    setSalesData(mockSalesData);
    setCategorySales(mockCategorySales);
    setDeliveryCosts(mockDeliveryCosts);
  }, [dateRange]);

  const salesChartData: ChartData<'line'> = {
    labels: salesData.map(d => d.date),
    datasets: [
      {
        label: 'Sales (VND)',
        data: salesData.map(d => d.amount),
        borderColor: '#ffc371',
        backgroundColor: 'rgba(255, 195, 113, 0.1)',
        fill: true,
        tension: 0.4
      }
    ]
  };

  const categoryChartData: ChartData<'bar'> = {
    labels: categorySales.map(c => c.category),
    datasets: [
      {
        label: 'Sales by Category (VND)',
        data: categorySales.map(c => c.sales),
        backgroundColor: [
          'rgba(255, 195, 113, 0.8)',
          'rgba(129, 140, 248, 0.8)',
          'rgba(52, 211, 153, 0.8)'
        ]
      }
    ]
  };

  const deliveryChartData: ChartData<'line'> = {
    labels: deliveryCosts.map(d => d.month),
    datasets: [
      {
        label: 'Average Delivery Cost per Order (VND)',
        data: deliveryCosts.map(d => d.cost / d.orders),
        borderColor: '#818cf8',
        backgroundColor: 'rgba(129, 140, 248, 0.1)',
        fill: true,
        tension: 0.4
      }
    ]
  };

  const chartOptions: ChartOptions<'line' | 'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const
      }
    },
    scales: {
      y: {
        type: 'linear' as const,
        beginAtZero: true,
        ticks: {
          callback: function(value) {
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
        <h1>Analytics Dashboard</h1>
        <div className="date-range-filter">
          <button
            className={dateRange === 'week' ? 'active' : ''}
            onClick={() => setDateRange('week')}
          >
            Week
          </button>
          <button
            className={dateRange === 'month' ? 'active' : ''}
            onClick={() => setDateRange('month')}
          >
            Month
          </button>
          <button
            className={dateRange === 'year' ? 'active' : ''}
            onClick={() => setDateRange('year')}
          >
            Year
          </button>
        </div>
      </div>

      <div className="analytics-grid">
        <div className="chart-container sales-chart">
          <h2>Sales Overview</h2>
          <div className="chart-wrapper">
            <Line data={salesChartData} options={chartOptions} />
          </div>
        </div>

        <div className="chart-container category-chart">
          <h2>Sales by Category</h2>
          <div className="chart-wrapper">
            <Bar data={categoryChartData} options={chartOptions} />
          </div>
        </div>

        <div className="chart-container delivery-chart">
          <h2>Delivery Cost Efficiency</h2>
          <div className="chart-wrapper">
            <Line data={deliveryChartData} options={chartOptions} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;