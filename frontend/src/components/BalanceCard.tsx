import { Box, Paper, Typography, Button, alpha } from "@mui/material";
import { theme } from "../theme/theme";
import { Send } from "@mui/icons-material";

type Props = {
    balance: number | null;
    onTransfer: () => void;
};

export default function BalanceCard({ balance, onTransfer }: Props) {
    return (
        <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center', mb: 4 }}>
            <Paper
                elevation={0}
                sx={{
                    p: 5,
                    borderRadius: 4,
                    background: `linear-gradient(150deg, ${theme.palette.primary.dark} 55%, ${theme.palette.primary.light} 100%)`,
                    color: 'white',
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    width: '100%',
                    maxWidth: '1300px',
                    boxSizing: 'border-box'
                }}
            >
                {/* Balance Info */}
                <Box>
                    <Typography variant="subtitle2" sx={{ opacity: 0.8, letterSpacing: 1, fontWeight: 700 }}>
                        AVAILABLE BALANCE
                    </Typography>
                    <Typography
                        variant="h2"
                        fontWeight={900}
                        sx={{
                            color: theme.palette.background.default,
                            whiteSpace: 'nowrap',
                            fontSize: { xs: '2.5rem', md: '3.75rem' } // Keeps it huge
                        }}
                    >
                        ₪ {balance?.toLocaleString('en-US', {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2
                        }) || "0.00"}
                    </Typography>
                </Box>

                {/* Transfer Button - Pushed to the far right */}
                <Button
                    variant="contained"
                    disableElevation
                    onClick={onTransfer}
                    startIcon={<Send />}
                    sx={{
                        bgcolor: theme.palette.secondary.main,
                        color: theme.palette.text.primary,
                        fontWeight: 800,
                        px: 6, // Wider button
                        py: 2,
                        fontSize: "1.4rem",
                        borderRadius: 1.5,
                        whiteSpace: 'nowrap',
                        transition: "all 0.2s ease-in-out",
                        "&:hover": {
                            bgcolor: theme.palette.secondary.dark,
                            transform: "scale(1.05)", // Grows slightly on hover
                            boxShadow: `0 10px 30px ${alpha(theme.palette.secondary.main, 0.4)}`,
                        },
                        "&:active": {
                            transform: "scale(0.98)",
                        }
                    }}
                >
                    Transfer
                </Button>
            </Paper>
        </Box>
    );
}