import React, { useState } from "react";
import { useSendChatMessageMutation, useGetPaymentsQuery } from "state/api";
import {
  Box,
  Typography,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  CircularProgress,
  useTheme,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import Header from "components/Header";

const Chat = () => {
  const theme = useTheme();
  const [messages, setMessages] = useState([
    { sender: "bot", text: "Hello! How can I help you today?" },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [sendChatMessage] = useSendChatMessageMutation();
  const { data: paymentsData, isLoading: paymentsLoading } = useGetPaymentsQuery({
    page: 0,
    pageSize: 100,
  });

  const sendMessage = async () => {
    if (!input.trim()) return;

    const newMessage = { sender: "user", text: input };
    setMessages((prev) => [...prev, newMessage]);
    setInput("");
    setLoading(true);

    try {
      if (paymentsLoading || !paymentsData) {
        throw new Error("Payment data is still loading...");
      }

      const totalPayments = paymentsData.total || 0;
      const pendingPayments = paymentsData.payments.filter((p) => p.status === "pending").length;
      const successfulPayments = paymentsData.payments.filter((p) => p.status === "success").length;

      const enhancedPrompt = `
        You are a business advisor for a pizza restaurant. Here is some data about payments:
        - Total payments: ${totalPayments}
        - Pending payments: ${pendingPayments}
        - Successful payments: ${successfulPayments}
        
        User prompt: ${input}
        
        Provide advice based on the data and the user's prompt.
      `;

      const response = await sendChatMessage(enhancedPrompt).unwrap();
      // Since backend sends a plain string, not { data: ... }
      const botReply = typeof response === "string" ? response : "No reply";
      setMessages((prev) => [...prev, { sender: "bot", text: botReply }]);
    } catch (error) {
      console.error("Error sending message:", error);
      const errorMessage = error.data?.error || error.message || "Failed to get a response from the server";
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: `Error: ${errorMessage}` },
      ]);
    }

    setLoading(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && input.trim()) {
      sendMessage();
    }
  };

  return (
    <Box m="1.5rem 2.5rem">
      <Header title="AI CHAT" subtitle="Chat with your AI assistant" />
      <Box
        sx={{
          height: "70vh",
          display: "flex",
          flexDirection: "column",
          backgroundColor: theme.palette.background.alt,
          borderRadius: "0.55rem",
          p: "1rem",
          overflow: "hidden",
        }}
      >
        {/* Chat Messages */}
        <Box
          sx={{
            flexGrow: 1,
            overflowY: "auto",
            mb: "1rem",
            "&::-webkit-scrollbar": {
              width: "10px",
            },
            "&::-webkit-scrollbar-track": {
              background: theme.palette.grey[700],
            },
            "&::-webkit-scrollbar-thumb": {
              background: theme.palette.primary[500],
            },
            "&::-webkit-scrollbar-thumb:hover": {
              background: theme.palette.primary[600],
            },
          }}
        >
          <List>
            {messages.map((msg, i) => (
              <ListItem
                key={i}
                sx={{
                  justifyContent:
                    msg.sender === "user" ? "flex-end" : "flex-start",
                  mb: "0.5rem",
                }}
              >
                <Box
                  sx={{
                    backgroundColor:
                      msg.sender === "user"
                        ? theme.palette.primary.light
                        : theme.palette.grey[300],
                    color:
                      msg.sender === "user"
                        ? theme.palette.background.alt
                        : theme.palette.text.primary,
                    p: "0.5rem 1rem",
                    borderRadius: "10px",
                    maxWidth: "70%",
                  }}
                >
                  <ListItemText primary={msg.text} />
                </Box>
              </ListItem>
            ))}
            {loading && (
              <ListItem sx={{ justifyContent: "flex-start", mb: "0.5rem" }}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    color: theme.palette.grey[500],
                  }}
                >
                  <CircularProgress size={20} />
                  <Typography variant="body2">Typing...</Typography>
                </Box>
              </ListItem>
            )}
          </List>
        </Box>

        {/* Input Area */}
        <Box sx={{ display: "flex", gap: "1rem" }}>
          <TextField
            fullWidth
            variant="outlined"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your message..."
            sx={{
              "& .MuiOutlinedInput-root": {
                "& fieldset": {
                  borderColor: theme.palette.grey[400],
                },
                "&:hover fieldset": {
                  borderColor: theme.palette.primary[500],
                },
                "&.Mui-focused fieldset": {
                  borderColor: theme.palette.primary[500],
                },
              },
              backgroundColor: theme.palette.background.paper,
            }}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={sendMessage}
            disabled={!input.trim()}
            endIcon={<SendIcon />}
          >
            Send
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default Chat;