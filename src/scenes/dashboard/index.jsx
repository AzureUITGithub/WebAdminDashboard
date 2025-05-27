import React from "react";
import FlexBetween from "components/FlexBetween";
import Header from "components/Header";
import {
  DownloadOutlined,
  MonetizationOn,
  ShoppingCart,
  People,
  TrendingUp,
} from "@mui/icons-material";
import {
  Box,
  Button,
  Typography,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import {
  useGetPaymentsQuery,
  useGetTotalRevenueQuery,
  useGetAverageOrderValueQuery,
  useGetRevenueByDayQuery, // Thêm import này
  useGetOrderCountByStatusQuery,
} from "state/api";
import StatBox from "components/StatBox";
import { Pie, Line } from "react-chartjs-2"; // Thêm Line
import {
  Chart as ChartJS,
  ArcElement,
  LineElement, // Thêm LineElement
  PointElement, // Thêm PointElement
  CategoryScale, // Thêm CategoryScale
  LinearScale, // Thêm LinearScale
  Tooltip,
  Legend,
} from "chart.js";

// Register Chart.js components
ChartJS.register(ArcElement, LineElement, PointElement, CategoryScale, LinearScale, Tooltip, Legend);

const Dashboard = () => {
  const theme = useTheme();
  const isNonMediumScreens = useMediaQuery("(min-width: 1200px)");
  const { data: paymentsData, isLoading: paymentsLoading } = useGetPaymentsQuery({ page: 0, pageSize: 5 });
  const { data: totalRevenueData, isLoading: totalRevenueLoading } = useGetTotalRevenueQuery({});
  const { data: aovData, isLoading: aovLoading } = useGetAverageOrderValueQuery({});
  const { data: revenueByDayData, isLoading: revenueByDayLoading } = useGetRevenueByDayQuery({}); // Thêm query này
  const { data: orderStatusData, isLoading: orderStatusLoading } = useGetOrderCountByStatusQuery({});

  const columns = [
    {
      field: "_id",
      headerName: "ID",
      flex: 1,
    },
    {
      field: "orderId",
      headerName: "Order ID",
      flex: 1,
    },
    {
      field: "amount",
      headerName: "Amount",
      flex: 0.5,
      renderCell: (params) => `$${Number(params.value).toFixed(2)}`,
    },
    {
      field: "status",
      headerName: "Status",
      flex: 0.5,
    },
    {
      field: "createdAt",
      headerName: "Created At",
      flex: 1,
      renderCell: (params) =>
        new Date(params.value).toLocaleString("en-US", {
          timeZone: "Asia/Ho_Chi_Minh",
          dateStyle: "medium",
          timeStyle: "short",
        }),
    },
  ];

  // Revenue by Day Chart Data
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

  // Order Status Chart Data
  const orderStatusChartData = {
    labels: orderStatusData?.orderCountByStatus.map((item) => item.status) || [],
    datasets: [
      {
        data: orderStatusData?.orderCountByStatus.map((item) => item.count) || [],
        backgroundColor: [
          theme.palette.success.main, // Success
          theme.palette.error.main,   // Failed
          theme.palette.warning.main, // Pending
        ],
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
      <FlexBetween>
        <Header title="DASHBOARD" subtitle="Welcome to your business dashboard" />

        <Box>
          <Button
            sx={{
              backgroundColor: theme.palette.secondary.light,
              color: theme.palette.background.alt,
              fontSize: "14px",
              fontWeight: "bold",
              padding: "10px 20px",
            }}
          >
            <DownloadOutlined sx={{ mr: "10px" }} />
            Download Reports
          </Button>
        </Box>
      </FlexBetween>

      <Box
        mt="20px"
        display="grid"
        gridTemplateColumns="repeat(12, 1fr)"
        gridAutoRows="160px"
        gap="20px"
        sx={{
          "& > div": { gridColumn: isNonMediumScreens ? undefined : "span 12" },
        }}
      >
        {/* ROW 1 */}
        <StatBox
          title="Total Revenue"
          value={totalRevenueData?.totalRevenue || 0}
          increase="+10%"
          description="Since last month"
          icon={
            <MonetizationOn
              sx={{ color: theme.palette.secondary[300], fontSize: "26px" }}
            />
          }
        />
        <StatBox
          title="Average Order Value"
          value={aovData?.averageOrderValue || 0}
          increase="+5%"
          description="Since last month"
          icon={
            <ShoppingCart
              sx={{ color: theme.palette.secondary[300], fontSize: "26px" }}
            />
          }
        />
        <Box
          gridColumn="span 8"
          gridRow="span 2"
          backgroundColor={theme.palette.background.alt}
          p="1rem"
          borderRadius="0.55rem"
        >
          <Typography variant="h6" sx={{ color: theme.palette.secondary[100] }}>
            Revenue by Day
          </Typography>
          <Box height="100%" sx={{ position: "relative" }}>
            <Line
              data={revenueByDayChartData}
              options={{
                ...chartOptions,
                plugins: { title: { text: "Revenue by Day ($)" } },
              }}
            />
          </Box>
        </Box>
        <StatBox
          title="Total Customers"
          value={paymentsData?.total || 0}
          increase="+3%"
          description="Since last month"
          icon={
            <People
              sx={{ color: theme.palette.secondary[300], fontSize: "26px" }}
            />
          }
        />
        <StatBox
          title="Revenue Trend"
          value={aovData?.totalOrders || 0}
          increase="+15%"
          description="Since last month"
          icon={
            <TrendingUp
              sx={{ color: theme.palette.secondary[300], fontSize: "26px" }}
            />
          }
        />

        {/* ROW 2 */}
        <Box
          gridColumn="span 8"
          gridRow="span 3"
          sx={{
            "& .MuiDataGrid-root": {
              border: "none",
              borderRadius: "5rem",
            },
            "& .MuiDataGrid-cell": {
              borderBottom: "none",
            },
            "& .MuiDataGrid-columnHeaders": {
              backgroundColor: theme.palette.background.alt,
              color: theme.palette.secondary[100],
              borderBottom: "none",
            },
            "& .MuiDataGrid-virtualScroller": {
              backgroundColor: theme.palette.background.alt,
            },
            "& .MuiDataGrid-footerContainer": {
              backgroundColor: theme.palette.background.alt,
              color: theme.palette.secondary[100],
              borderTop: "none",
            },
            "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
              color: `${theme.palette.secondary[200]} !important`,
            },
          }}
        >
          <DataGrid
            loading={paymentsLoading || !paymentsData}
            getRowId={(row) => row._id}
            rows={(paymentsData && paymentsData.payments) || []}
            columns={columns}
          />
        </Box>
        <Box
          gridColumn="span 4"
          gridRow="span 3"
          backgroundColor={theme.palette.background.alt}
          p="1.5rem"
          borderRadius="0.55rem"
        >
          <Typography variant="h6" sx={{ color: theme.palette.secondary[100] }}>
            Order Count by Status
          </Typography>
          <Box height="100%" sx={{ position: "relative" }}>
            <Pie
              data={orderStatusChartData}
              options={{
                ...chartOptions,
                plugins: { title: { text: "Order Count by Status" } },
              }}
            />
          </Box>
          <Typography
            p="0 0.6rem"
            fontSize="0.8rem"
            sx={{ color: theme.palette.secondary[200] }}
          >
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default Dashboard;