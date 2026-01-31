import { useState } from "react";
import { Box, Button, TextField, Typography, Grid, Paper, Fade, InputAdornment, Divider, Container, Dialog, DialogContent, DialogActions } from "@mui/material";
import { alpha } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import { theme } from "../theme/theme";
import { apiPrivate } from "../api/apiPrivate";
import { Navbar } from "../components";
import { useAuth } from "../hooks/useAuth"; // Added to fetch balance
import { ArrowBack, CheckCircleOutline, InfoOutlined, Security, Send, Shield } from "@mui/icons-material";

const TransferPage = () => {
  const navigate = useNavigate();
  const { balance } = useAuth(); // Get balance from Auth context

  // Form fields
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");

  // Transfer confirmation
  const [confirmation, setConfirmation] = useState<null | {
    toEmail: string;
    amount: number;
    description: string;
    date: string;
  }>(null);

  const [errorDialog, setErrorDialog] = useState<{ open: boolean; message: string }>({
    open: false,
    message: "",
  });

  const closeError = () => setErrorDialog({ ...errorDialog, open: false });

  const handleSubmit = async () => {
    const parsedAmount = Number(amount);

    const showError = (msg: string) => setErrorDialog({ open: true, message: msg });

    if (!recipient.trim()) { showError("Recipient email is required to proceed."); return; }
    if (isNaN(parsedAmount) || parsedAmount <= 0) { showError("Please enter a valid amount greater than 0."); return; }

    const payload = {
      toAccount: recipient.trim(),
      amount: parsedAmount,
      description: description.trim() || "",
    };

    try {
      const res = await apiPrivate.post("/transactions", payload);
      if (res.data?.success) {
        setConfirmation({
          toEmail: payload.toAccount,
          amount: payload.amount,
          description: payload.description,
          date: new Date(res.data.data.timestamp).toISOString().slice(0, 16).replace("T", " "),
        });
        setRecipient(""); setAmount(""); setDescription("");
      } else {
        showError(res.data?.error || "Transfer Authorization Failed");
      }
    } catch (err: any) {
      showError(err?.response?.data?.error || "A secure connection error occurred.");
    }
  };

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: theme.palette.primary.dark, display: 'flex', flexDirection: 'column' }}>

      {/* 1. NAVBAR (WHITE) */}
      <Box sx={{ bgcolor: "#fff", zIndex: 1100, flexShrink: 0 }}>
        <Navbar />
      </Box>

      {/* 2. HEADER SECTION (WHITE) */}
      <Box sx={{
        bgcolor: "#ffffff",
        color: theme.palette.primary.dark,
        pt: 3,
        pb: 4,
        borderBottom: `6px solid ${theme.palette.secondary.main}`,
        flexShrink: 0
      }}>
        <Container maxWidth="lg">
          <Button
            startIcon={<ArrowBack />}
            onClick={() => navigate("/dashboard")}
            sx={{ color: alpha(theme.palette.primary.dark, 0.4), mb: 2, textTransform: 'none', pl: 0, fontWeight: 700 }}
          >
            Back to Dashboard
          </Button>

          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Security sx={{ color: theme.palette.primary.main, fontSize: 70 }} />
              <Box>
                <Typography variant="h3" fontWeight={900} sx={{ letterSpacing: -1.5, lineHeight: 1 }}>
                  Secure <span style={{ color: theme.palette.secondary.main }}>Transfer</span>
                </Typography>
                <Typography variant="subtitle1" sx={{ color: alpha("#000", 0.5), mt: 1, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1 }}>
                  Institutional Authorization Portal
                </Typography>
              </Box>
            </Box>

            {/* BALANCE BOX - MATCHING TRANSACTIONS PAGE */}
            <Box sx={{
              bgcolor: alpha(theme.palette.secondary.main, 0.05),
              border: `1px solid ${alpha(theme.palette.secondary.main, 0.3)}`,
              p: 2,
              px: 3,
              borderRadius: 1,
              textAlign: "right",
              minWidth: 250
            }}>
              <Typography variant="caption" sx={{ color: theme.palette.secondary.main, fontWeight: 800, letterSpacing: 1, display: "block" }}>
                AVAILABLE BALANCE
              </Typography>
              <Typography variant="h4" fontWeight={900} sx={{ color: theme.palette.primary.dark }}>
                ₪ {balance?.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || "0.00"}
              </Typography>
            </Box>
          </Box>
        </Container>
      </Box>

      {/* 3. MAIN CONTENT (GREEN BACKGROUND) */}
      <Container maxWidth="lg" sx={{ mt: 5, flexGrow: 1 }}>
        <Grid container spacing={6} alignItems="stretch">

          {/* LEFT: FORM SECTION */}
          <Grid size={{ xs: 12, md: 7 }}>
            <Paper
              elevation={0}
              sx={{
                p: 5,
                borderRadius: 1, // Institutional sharp corners
                bgcolor: "background.paper",
                height: '100%',
                minHeight: 550,
                display: 'flex',
                flexDirection: 'column',
                border: `1px solid ${alpha("#000", 0.1)}`,
                boxShadow: `0 20px 60px ${alpha('#000', 0.4)}`,
              }}
            >
              {confirmation ? (
                /* --- SUCCESS RECEIPT VIEW --- */
                <Fade in={!!confirmation}>
                  <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
                    <CheckCircleOutline sx={{ fontSize: 70, color: '#2BAB27', mb: 2 }} />
                    <Typography variant="h4" fontWeight={900} color="#043015">Transfer Authorized</Typography>
                    <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>Transaction processed via LOK Ledger Protocol.</Typography>

                    <Box sx={{ width: '100%', bgcolor: '#f9f9f9', borderRadius: 1, p: 3, mb: 5, border: '1px dashed #ccc' }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                        <Typography color="text.secondary">Amount:</Typography>
                        <Typography fontWeight={900} color="#043015">₪ {confirmation.amount.toLocaleString()}</Typography>
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                        <Typography color="text.secondary">Recipient:</Typography>
                        <Typography fontWeight={700}>{confirmation.toEmail}</Typography>
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                        <Typography color="text.secondary">Description:</Typography>
                        <Typography fontWeight={700}>{confirmation.description}</Typography>
                      </Box>
                    </Box>
                    <Box sx={{ display: 'flex', gap: 2, width: '100%' }}>
                      <Button fullWidth variant="outlined" onClick={() => setConfirmation(null)} sx={{ py: 1.5, fontWeight: 700 }}>New Transfer</Button>
                      <Button fullWidth variant="contained" onClick={() => navigate("/dashboard")} sx={{ py: 1.5, fontWeight: 700, bgcolor: theme.palette.primary.main }}>Return Home</Button>
                    </Box>
                  </Box>
                </Fade>
              ) : (
                /* --- TRANSACTION FORM VIEW --- */
                <Box>
                  <Typography variant="h5" fontWeight={900} sx={{ mb: 4, color: theme.palette.primary.dark, textTransform: 'uppercase', fontSize: '1.2rem' }}>
                    Verification Required
                  </Typography>

                  <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                    <TextField
                      fullWidth
                      label="Recipient Email"
                      value={recipient}
                      onChange={(e) => setRecipient(e.target.value)}
                      slotProps={{ input: { startAdornment: <InputAdornment position="start"><InfoOutlined fontSize="small" /></InputAdornment> } }}
                    />

                    <TextField
                      fullWidth
                      label="Transfer Amount"
                      type="number"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      slotProps={{ input: { startAdornment: <InputAdornment position="start"><Typography fontWeight={900}>₪</Typography></InputAdornment> } }}
                    />

                    <TextField fullWidth label="Reference / Note" multiline rows={3} value={description} onChange={(e) => setDescription(e.target.value)} />

                    <Button
                      fullWidth
                      variant="contained"
                      onClick={handleSubmit}
                      startIcon={<Send />}
                      sx={{
                        py: 2.2,
                        fontWeight: 900,
                        fontSize: '1.1rem',
                        bgcolor: theme.palette.primary.main,
                        borderRadius: 1,
                        "&:hover": { bgcolor: theme.palette.primary.dark }
                      }}
                    >
                      Authorize & Execute
                    </Button>
                  </Box>
                </Box>
              )}
            </Paper>
          </Grid>

          {/* RIGHT: SECURITY SIDEBAR */}
          <Grid size={{ xs: 12, md: 5 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              <Paper sx={{
                p: 4,
                bgcolor: alpha("#000", 0.15),
                borderRadius: 1,
                border: `1px solid ${alpha("#fff", 0.1)}`,
                color: 'white'
              }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3, color: theme.palette.secondary.main }}>
                  <Shield />
                  <Typography variant="h6" fontWeight={800} sx={{ textTransform: 'uppercase' }}>Vault Protocol</Typography>
                </Box>

                <Typography variant="body2" sx={{ color: alpha("#fff", 0.8), mb: 3, lineHeight: 1.8 }}>
                  Funds are moved via the <strong>LOK Ledger Protocol</strong>. Transfers are near-instant and cannot be reversed once authorized.
                </Typography>

                <Divider sx={{ borderColor: alpha("#fff", 0.1), my: 3 }} />

                <Typography variant="caption" sx={{ color: theme.palette.secondary.main, fontWeight: 900, display: 'block', mb: 1 }}>
                  SYSTEM STATUS:
                </Typography>
                <Typography variant="caption" sx={{ color: alpha("#fff", 0.5) }}>
                  SECURED BY AES-256 ENCRYPTION • NODE: V4-ISR
                </Typography>
              </Paper>
            </Box>
          </Grid>
        </Grid>

        {/* ERROR POPUP BOX */}
        <Dialog
          open={errorDialog.open}
          onClose={closeError}
          slotProps={{
            paper: {
              sx: {
                borderRadius: 1,
                border: `2px solid #e20909`,
                bgcolor: "#fff",
                maxWidth: "400px",
                width: "100%"
              }
            }
          }}
        >
          <DialogContent sx={{ pt: 4, textAlign: 'center' }}>
            <Box sx={{
              width: 60, height: 60, bgcolor: alpha('#e20909', 0.1),
              borderRadius: '50%', display: 'flex', alignItems: 'center',
              justifyContent: 'center', mx: 'auto', mb: 2
            }}>
              <InfoOutlined sx={{ color: '#e20909', fontSize: 35 }} />
            </Box>

            <Typography variant="h6" fontWeight={900} color="#e20909" sx={{ textTransform: 'uppercase', mb: 1 }}>
              Transfer Failure
            </Typography>

            <Typography variant="body1" fontWeight={600} color="text.primary">
              {errorDialog.message}
            </Typography>
          </DialogContent>

          <DialogActions sx={{ p: 3, justifyContent: 'center' }}>
            <Button
              onClick={closeError}
              variant="contained"
              sx={{
                bgcolor: "#000",
                color: "#fff",
                fontWeight: 800,
                px: 4,
                "&:hover": { bgcolor: "#333" }
              }}
            >
              Acknowledge
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Box >
  );
}

export default TransferPage;