import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { setToken, setUserId } from "state";
import {
  Box,
  Button,
  TextField,
  Typography,
  Alert,
  useTheme,
  Link,
  Paper,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const theme = useTheme(); // Access the theme
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const response = await fetch(`${process.env.REACT_APP_BASE_URL}/api/user/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (response.ok && data.token) {
        dispatch(setToken(data.token));
        dispatch(setUserId(data.user.id)); // Assuming login returns user.id
        localStorage.setItem("token", data.token); // Persist token
        navigate("/dashboard"); // Redirect to dashboard after login
      } else {
        setError(data.error || "Login failed");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
      console.error("Login error:", err);
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        background: `linear-gradient(135deg, ${theme.palette.primary[800]}, ${theme.palette.primary[900]})`,
        fontFamily: theme.typography.fontFamily,
      }}
    >
      <Box
        component={Paper}
        elevation={6}
        sx={{
          width: "100%",
          maxWidth: "400px",
          padding: "2rem",
          borderRadius: "12px",
          backgroundColor: theme.palette.background.default,
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.2)",
          transition: "transform 0.2s ease-in-out",
          "&:hover": {
            transform: "translateY(-2px)",
          },
        }}
      >
        <Typography
          variant="h4"
          align="center"
          gutterBottom
          sx={{
            color: theme.palette.secondary[300],
            fontWeight: 700,
            mb: 3,
          }}
        >
          Login
        </Typography>
        {error && (
          <Alert severity="error" sx={{ mb: 2, borderRadius: "4px" }}>
            {error}
          </Alert>
        )}
        <form onSubmit={handleLogin}>
          <TextField
            label="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            fullWidth
            margin="normal"
            variant="outlined"
            required
            sx={{
              "& .MuiOutlinedInput-root": {
                "& fieldset": {
                  borderColor: theme.palette.neutral[400],
                },
                "&:hover fieldset": {
                  borderColor: theme.palette.primary[300],
                },
                "&.Mui-focused fieldset": {
                  borderColor: theme.palette.primary[500],
                },
              },
              "& .MuiInputLabel-root": {
                color: theme.palette.neutral[300],
              },
              "& .MuiInputBase-input": {
                color: theme.palette.neutral[100],
              },
            }}
          />
          <TextField
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            fullWidth
            margin="normal"
            variant="outlined"
            required
            sx={{
              "& .MuiOutlinedInput-root": {
                "& fieldset": {
                  borderColor: theme.palette.neutral[400],
                },
                "&:hover fieldset": {
                  borderColor: theme.palette.primary[300],
                },
                "&.Mui-focused fieldset": {
                  borderColor: theme.palette.primary[500],
                },
              },
              "& .MuiInputLabel-root": {
                color: theme.palette.neutral[300],
              },
              "& .MuiInputBase-input": {
                color: theme.palette.neutral[100],
              },
            }}
          />
          <Link
            href="/forgot-password"
            underline="hover"
            sx={{
              display: "block",
              textAlign: "right",
              color: theme.palette.secondary[200],
              fontSize: "0.875rem",
              mb: 2,
            }}
          >
            Forgot Password?
          </Link>
          <Button
            type="submit"
            variant="contained"
            color="secondary"
            fullWidth
            sx={{
              mt: 2,
              py: 1.5,
              backgroundColor: theme.palette.secondary[300],
              "&:hover": {
                backgroundColor: theme.palette.secondary[400],
              },
              borderRadius: "8px",
              textTransform: "none",
              fontWeight: 600,
            }}
          >
            Login
          </Button>
        </form>
      </Box>
    </Box>
  );
};

export default Login;