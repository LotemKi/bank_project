import { useState } from "react";
import { Box, TextField, IconButton, Typography, Paper, Avatar, Divider } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import { useChat } from "../hooks/useChat";

export function ChatPanel() {
    const { messages, sendMessage, ready } = useChat();
    const [input, setInput] = useState("");

    const handleSend = () => {
        if (input.trim()) {
            sendMessage(input);
            setInput("");
        }
    };

    return (
        <Paper
            elevation={3}
            sx={{
                height: "500px",
                display: "flex",
                flexDirection: "column",
                border: "1px solid",
                borderColor: "divider", // Your Deep Shield Border (#043015)
                overflow: "hidden"
            }}
        >
            {/* Header */}
            <Box sx={{ p: 2, bgcolor: "primary.main", color: "white", display: "flex", alignItems: "center", gap: 2 }}>
                <Avatar sx={{ bgcolor: "secondary.main" }}>
                    <AccountBalanceIcon sx={{ color: "primary.dark" }} />
                </Avatar>
                <Box>
                    <Typography variant="subtitle1" fontWeight="bold">Secure Support</Typography>
                    <Typography variant="caption" sx={{ opacity: 0.8 }}>End-to-end encrypted</Typography>
                </Box>
            </Box>

            {/* Message Area */}
            <Box
                sx={{
                    flexGrow: 1,
                    p: 2,
                    overflowY: "auto",
                    bgcolor: "background.default",
                    display: "flex",
                    flexDirection: "column",
                    gap: 1
                }}
            >
                {messages.map((m, i) => {
                    const isUser = m.sender; // Adjust logic based on your hook data
                    return (
                        <Box
                            key={i}
                            sx={{
                                alignSelf: isUser ? "flex-end" : "flex-start",
                                maxWidth: "80%"
                            }}
                        >
                            <Paper
                                sx={{
                                    p: 1.5,
                                    bgcolor: isUser ? "primary.main" : "background.paper",
                                    color: isUser ? "white" : "text.primary",
                                    borderRadius: isUser ? "15px 15px 2px 15px" : "15px 15px 15px 2px",
                                    border: isUser ? "none" : "1px solid",
                                    borderColor: "divider"
                                }}
                            >
                                <Typography variant="body2">{m.text}</Typography>
                            </Paper>
                            <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: "block" }}>
                                {m.sender}
                            </Typography>
                        </Box>
                    );
                })}
            </Box>

            <Divider />

            {/* Input Area */}
            <Box sx={{ p: 2, bgcolor: "background.paper", display: "flex", gap: 1 }}>
                <TextField
                    fullWidth
                    size="small"
                    placeholder="Type your message..."
                    disabled={!ready}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSend()}
                    sx={{
                        "& .MuiOutlinedInput-root": {
                            "&.Mui-focused fieldset": { borderColor: "secondary.main" }
                        }
                    }}
                />
                <IconButton
                    onClick={handleSend}
                    disabled={!ready || !input.trim()}
                    sx={{
                        bgcolor: "primary.main",
                        color: "secondary.main",
                        "&:hover": { bgcolor: "primary.dark" },
                        "&.Mui-disabled": { bgcolor: "text.disabled", color: "white" }
                    }}
                >
                    <SendIcon />
                </IconButton>
            </Box>
        </Paper>
    );
}