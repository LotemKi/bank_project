import { useState, useRef, useEffect } from "react";
import { Box, TextField, IconButton, Typography, Paper, Avatar, Fab, Zoom, } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import ChatIcon from "@mui/icons-material/Chat";
import CloseIcon from "@mui/icons-material/Close";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import { useChat } from "../hooks/useChat";

export function ChatPanel() {
    const { messages, sendMessage, ready } = useChat();
    const [input, setInput] = useState("");
    const [isOpen, setIsOpen] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    // Auto-scroll logic (Fixed TS type)
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, isOpen]);

    const handleSend = () => {
        if (input.trim()) {
            sendMessage(input);
            setInput("");
        }
    };

    return (
        <Box sx={{ position: "fixed", bottom: 30, right: 30, zIndex: 1000 }}>
            {/* 1. THE FLOATING BUTTON */}
            <Fab
                color="primary"
                onClick={() => setIsOpen(!isOpen)}
                sx={{ bgcolor: "primary.main", color: "secondary.main" }}
            >
                {isOpen ? <CloseIcon /> : <ChatIcon />}
            </Fab>

            {/* 2. THE CHAT PANEL (Only shows when clicked) */}
            <Zoom in={isOpen}>
                <Paper
                    elevation={6}
                    sx={{
                        position: "absolute",
                        bottom: 80,
                        right: 0,
                        width: 350,
                        height: 500,
                        display: "flex",
                        flexDirection: "column",
                        borderRadius: 3,
                        overflow: "hidden",
                        border: "1px solid",
                        borderColor: "divider"
                    }}
                >
                    {/* Header */}
                    <Box sx={{ p: 2, bgcolor: "primary.main", color: "white", display: "flex", alignItems: "center", gap: 1.5 }}>
                        <Avatar sx={{ bgcolor: "secondary.main", width: 32, height: 32 }}>
                            <AccountBalanceIcon sx={{ fontSize: 18, color: "primary.dark" }} />
                        </Avatar>
                        <Typography variant="subtitle2" fontWeight="bold">Vault Support</Typography>
                    </Box>

                    {/* Message Area */}
                    <Box
                        ref={scrollRef}
                        sx={{
                            flexGrow: 1, p: 2, overflowY: "auto",
                            bgcolor: "background.default", display: "flex",
                            flexDirection: "column", gap: 1.5
                        }}
                    >
                        {messages.map((m, i) => {
                            // "me" = Deep Forest (Right) | "Bot" = Grey/Gold (Left)
                            const isUser = m.sender.toLowerCase() === "me";

                            return (
                                <Box
                                    key={i}
                                    sx={{
                                        alignSelf: isUser ? "flex-end" : "flex-start",
                                        maxWidth: "85%"
                                    }}
                                >
                                    <Paper
                                        sx={{
                                            p: 1.5,
                                            bgcolor: isUser ? "primary.main" : "background.paper",
                                            color: isUser ? "white" : "text.primary",
                                            borderRadius: isUser ? "15px 15px 2px 15px" : "15px 15px 15px 2px",
                                            border: isUser ? "none" : "1px solid",
                                            borderColor: "secondary.main", // Gold border for bot messages
                                        }}
                                    >
                                        <Typography variant="body2">{m.text}</Typography>
                                    </Paper>
                                    <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: "block", textAlign: isUser ? "right" : "left" }}>
                                        {isUser ? m.sender.toLowerCase() : m.sender.toLowerCase()}
                                    </Typography>
                                </Box>
                            );
                        })}
                    </Box>

                    {/* Input */}
                    <Box sx={{ p: 2, bgcolor: "background.paper", display: "flex", gap: 1, borderTop: "1px solid #eee" }}>
                        <TextField
                            fullWidth
                            size="small"
                            variant="standard"
                            placeholder="Ask a question..."
                            value={input}
                            disabled={!ready}
                            onChange={e => setInput(e.target.value)}
                            onKeyDown={e => e.key === "Enter" && handleSend()}
                            InputProps={{ disableUnderline: true, sx: { fontSize: '0.9rem' } }}
                        />
                        <IconButton
                            onClick={handleSend}
                            disabled={!input.trim()}
                            sx={{ color: "primary.main" }}
                        >
                            <SendIcon fontSize="small" />
                        </IconButton>
                    </Box>
                </Paper>
            </Zoom>
        </Box>
    );
}