import { CssBaseline, ThemeProvider } from "@mui/material";
import { createTheme } from "@mui/material/styles";
import { useMemo } from "react";
import { useSelector } from "react-redux";
import { themeSettings } from "theme";
import Layout from "scenes/layout";
import Dashboard from "scenes/dashboard";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "scenes/login";
import Product from "scenes/product";
import Customer from "scenes/customer";
import Transaction from "scenes/transaction";
import Chart from "scenes/chart";
import Chat from "scenes/askAI";

function App() {
  const mode = useSelector((state) => state.global.mode);
  const token = useSelector((state) => state.global.token);
  const theme = useMemo(() => createTheme(themeSettings(mode)), [mode]);

  return (
    <div className="app">
      <BrowserRouter>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Routes>
            <Route
              path="/"
              element={token ? <Navigate to="/dashboard" /> : <Navigate to="/login" />}
            />
            <Route
              path="/login"
              element={token ? <Navigate to="/dashboard" /> : <Login />}
            />
            <Route
              element={token ? <Layout /> : <Navigate to="/login" />}
            >
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/products" element={<Product />} />
              <Route path="/customers" element={<Customer />} />
              <Route path="/transactions" element={<Transaction />} />
              <Route path="/charts" element={<Chart />} />
              <Route path="/askAI" element={<Chat />} />
            </Route>
          </Routes>
        </ThemeProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;