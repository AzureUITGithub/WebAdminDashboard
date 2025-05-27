import React, { useState } from "react";
import { Box, useTheme, Tabs, Tab, Typography } from "@mui/material";
import { Bar, Pie, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { useGetAverageOrderValueQuery, useGetOrderCountByStatusQuery, useGetTopActiveUsersQuery, useGetRevenueByDayQuery, useGetTotalRevenueQuery, useGetTopSellingProductsQuery } from "state/api";
import Header from "components/Header";

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, LineElement, PointElement, Title, Tooltip, Legend);

const Chart = () => {
  const theme = useTheme();
  const [tabValue, setTabValue] = useState(0);

  // Fetch data with default parameters (no date filters for simplicity)
  const { data: aovData } = useGetAverageOrderValueQuery({});
  const { data: orderStatusData } = useGetOrderCountByStatusQuery({});
  const { data: topUsersData } = useGetTopActiveUsersQuery({ metric: "orderCount" });
  const { data: revenueByDayData } = useGetRevenueByDayQuery({});
  const { data: totalRevenueData } = useGetTotalRevenueQuery({});
  const { data: topProductsData } = useGetTopSellingProductsQuery({ limit: 10 });

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  // Chart Data
  const aovChartData = {
    labels: ["Average Order Value"],
    datasets: [
      {
        label: "AOV ($)",
        data: [aovData?.averageOrderValue || 0],
        backgroundColor: theme.palette.primary.main,
        borderColor: theme.palette.primary.main,
        borderWidth: 1,
      },
    ],
  };

  const orderStatusChartData = {
    labels: orderStatusData?.orderCountByStatus.map((item) => item.status) || [],
    datasets: [
      {
        data: orderStatusData?.orderCountByStatus.map((item) => item.count) || [],
        backgroundColor: [
          theme.palette.success.main,
          theme.palette.error.main,
          theme.palette.warning.main,
        ],
        borderWidth: 1,
      },
    ],
  };

  const getRandomColor = () =>
  `hsl(${Math.floor(Math.random() * 360)}, 70%, 60%)`;

const topUsers = topUsersData?.topUsers || [];

const topUsersChartData = {
  labels: topUsers.map((user) => user.username),
  datasets: [
    {
      label: "Order Count",
      data: topUsers.map((user) => user.orderCount),
      backgroundColor: topUsers.map(() => getRandomColor()),
      borderColor: topUsers.map(() => getRandomColor()),
      borderWidth: 1,
    },
  ],
};


  const revenueByDayChartData = {
    labels: revenueByDayData?.dailyRevenue.map((item) => item.date) || [],
    datasets: [
      {
        label: "Revenue ($)",
        data: revenueByDayData?.dailyRevenue.map((item) => item.totalRevenue) || [],
        fill: false,
        backgroundColor: theme.palette.secondary.main,
        borderColor: theme.palette.secondary.main,
        tension: 0.1,
      },
    ],
  };

  const totalRevenueChartData = {
    labels: ["Total Revenue"],
    datasets: [
      {
        label: "Revenue ($)",
        data: [totalRevenueData?.totalRevenue || 0],
        backgroundColor: theme.palette.success.main,
        borderColor: theme.palette.success.main,
        borderWidth: 1,
      },
    ],
  };

  const topProductsChartData = {
  labels: topProductsData?.topProducts.map((product) => product.productName) || [],
  datasets: [
    {
      data: topProductsData?.topProducts.map((product) => product.totalQuantity) || [],
      backgroundColor: topProductsData?.topProducts.map(() =>
        `rgba(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, 0.6)`
      ) || [],
      borderWidth: 1,
    },
  ],
};

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: "top" },
      title: { display: true, text: "Chart" },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <Box m="1.5rem 2.5rem">
      <Header title="CHARTS" subtitle="Business Analytics" />
      <Tabs value={tabValue} onChange={handleTabChange} sx={{ mb: 2 }}>
        <Tab label="Average Order Value" />
        <Tab label="Order Status" />
        <Tab label="Top Users" />
        <Tab label="Revenue by Day" />
        <Tab label="Total Revenue" />
        <Tab label="Top Products" />
      </Tabs>
      <Box height="70vh" sx={{ position: "relative" }}>
        {tabValue === 0 && (
          <Box sx={{ height: "100%" }}>
            <Typography variant="h6" gutterBottom>
              Average Order Value
            </Typography>
            <Bar data={aovChartData} options={{ ...chartOptions, plugins: { title: { text: "Average Order Value ($)" } } }} />
          </Box>
        )}
        {tabValue === 1 && (
          <Box sx={{ height: "100%" }}>
            <Typography variant="h6" gutterBottom>
              Order Count by Status
            </Typography>
            <Pie data={orderStatusChartData} options={{ ...chartOptions, plugins: { title: { text: "Order Count by Status" } } }} />
          </Box>
        )}
        {tabValue === 2 && (
          <Box sx={{ height: "100%" }}>
            <Typography variant="h6" gutterBottom>
              Top Active Users
            </Typography>
            <Bar data={topUsersChartData} options={{ ...chartOptions, plugins: { title: { text: "Top Active Users by Order Count" } } }} />
          </Box>
        )}
        {tabValue === 3 && (
          <Box sx={{ height: "100%" }}>
            <Typography variant="h6" gutterBottom>
              Revenue by Day
            </Typography>
            <Line data={revenueByDayChartData} options={{ ...chartOptions, plugins: { title: { text: "Revenue by Day ($)" } } }} />
          </Box>
        )}
        {tabValue === 4 && (
          <Box sx={{ height: "100%" }}>
            <Typography variant="h6" gutterBottom>
              Total Revenue
            </Typography>
            <Bar data={totalRevenueChartData} options={{ ...chartOptions, plugins: { title: { text: "Total Revenue ($)" } } }} />
          </Box>
        )}
        {tabValue === 5 && (
          <Box sx={{ height: "100%" }}>
            <Typography variant="h6" gutterBottom>
              Top Selling Products
            </Typography>
            <Pie data={topProductsChartData} options={{ ...chartOptions, plugins: { title: { text: "Top Selling Products by Quantity" } } }} />
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default Chart;