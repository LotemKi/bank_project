import { Box, Typography, alpha, Container, Paper, Button, MenuItem, Select, FormControl } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { Transaction } from "../types/userTransactionTypes";
import { apiPrivate } from "../api/apiPrivate";
import { theme } from "../theme/theme";
import { TransactionsTable, Navbar } from "../components";
import { useAuth } from "../hooks/useAuth";
import { ArrowBack, Security, Tune } from "@mui/icons-material";
import { ChatPanel } from "../components/ChatPanel";

const TransactionsPage = () => {
  const navigate = useNavigate();
  const { profile, loading: authLoading, balance } = useAuth();

  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  // FIXED FILTER STATES
  const [typeFilter, setTypeFilter] = useState<"all" | "credit" | "debit">("all");
  const [sortOrder, setSortOrder] = useState<"desc" | "asc">("desc");

  const limit = 10;
  const isFetchingRef = useRef(false);

  // FETCH LOGIC (Now depends on filters)
  const fetchTransactions = async (reset: boolean = false) => {
    if (isFetchingRef.current) return;
    isFetchingRef.current = true;

    try {
      const offset = reset ? 0 : transactions.length;

      // We determine the "type" for the API based on the filter
      const res = await apiPrivate.get("/transactions", {
        params: {
          offset,
          limit: typeFilter === "all" ? limit : 5000,
        },
      });

      const newTx = res.data.data.transactions;

      if (reset) {
        setTransactions(newTx);
      } else {
        setTransactions((prev) => [...prev, ...newTx]);
      }
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      isFetchingRef.current = false;
      setLoading(false);
    }
  };

  // Trigger reset whenever filters change
  useEffect(() => {
    setTransactions([]);
    fetchTransactions(true);
  }, [typeFilter, sortOrder]);

  // LOCAL SORTING (Since we are handling the display array)
  const displayedTransactions = [...transactions].sort((a, b) => {
    const dateA = new Date(a.createdAt).getTime();
    const dateB = new Date(b.createdAt).getTime();
    return sortOrder === "desc" ? dateB - dateA : dateA - dateB;
  }).filter(tx => {
    if (!profile) return false;

    if (typeFilter === "credit") return tx.toEmail === profile.email;
    if (typeFilter === "debit") return tx.fromEmail === profile.email;

    return true;
  });

  if (authLoading || loading) return <p>Loading...</p>;

  return (
    <Box sx={{ height: "100vh", display: "flex", flexDirection: "column", bgcolor: theme.palette.primary.dark, overflow: "hidden" }}>
      <Navbar />

      {/* HEADER */}
      <Box sx={{ bgcolor: "#ffffff", pt: 2, pb: 2, borderBottom: `0px solid ${theme.palette.secondary.main}` }}>
        <Container maxWidth="lg">
          <Button startIcon={<ArrowBack />} onClick={() => navigate("/dashboard")} sx={{ color: alpha(theme.palette.primary.dark, 0.4), mb: 1, textTransform: "none", fontWeight: 700 }}>
            Back to Dashboard
          </Button>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
            <Box>
              <Typography variant="h2" fontWeight={800} sx={{ letterSpacing: -2, color: theme.palette.primary.dark, lineHeight: 1 }}>
                Transactions <span style={{ color: theme.palette.secondary.main }}>History</span>
              </Typography>
            </Box>
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

      {/* MAIN CONTENT */}
      <Box sx={{ flexGrow: 1, display: "flex", flexDirection: "column", pt: 3, pb: 2, overflow: "hidden" }}>
        <Container maxWidth="lg" sx={{ height: "100%", display: "flex", flexDirection: "column" }}>

          <Paper elevation={0} sx={{ borderRadius: 2, flexGrow: 1, display: "flex", flexDirection: "column", overflow: "hidden", border: `1px solid ${alpha("#000", 0.1)}` }}>

            {/* FIXED FILTER BAR */}
            <Box sx={{ px: 3, py: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between', bgcolor: '#fcfcfc', borderBottom: '0px solid #eee' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Tune sx={{ color: theme.palette.primary.main, fontSize: 18 }} />
                <Typography variant="subtitle2" fontWeight={800}>LEDGER FILTERS</Typography>
              </Box>

              <Box sx={{ display: 'flex', gap: 2 }}>
                {/* TYPE FILTER */}
                <FormControl size="small" sx={{ minWidth: 140 }}>
                  <Select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value as any)} sx={{ fontWeight: 700, fontSize: '0.75rem' }}>
                    <MenuItem value="all">ALL TRANSACTIONS</MenuItem>
                    <MenuItem value="credit">CREDIT (+) </MenuItem>
                    <MenuItem value="debit">DEBIT (-)</MenuItem>
                  </Select>
                </FormControl>

                {/* DATE SORT */}
                <FormControl size="small" sx={{ minWidth: 140 }}>
                  <Select value={sortOrder} onChange={(e) => setSortOrder(e.target.value as any)} sx={{ fontWeight: 700, fontSize: '0.75rem' }}>
                    <MenuItem value="desc">NEWEST FIRST</MenuItem>
                    <MenuItem value="asc">OLDEST FIRST</MenuItem>
                  </Select>
                </FormControl>
              </Box>
            </Box>

            {/* TABLE */}
            <Box sx={{ flexGrow: 1, overflow: "hidden" }}>
              <TransactionsTable
                transactions={displayedTransactions}
                profileEmail={profile?.email}
                maxHeight={window.innerHeight - 450}
                onScroll={(e) => {
                  const el = e.currentTarget as HTMLDivElement;
                  if (el.scrollTop + el.clientHeight >= el.scrollHeight - 50) fetchTransactions();
                }}
              />
            </Box>
          </Paper>
          <Box sx={{ p: 1.5, display: "flex", justifyContent: "center", gap: 1.2, bgcolor: theme.palette.primary.dark }}>
            <Security sx={{ fontSize: 16, color: theme.palette.background.default }} />
            <Typography
              variant="caption"
              sx={{
                color: theme.palette.background.default
              }}
            >
              SECURE LOK GATEWAY ACTIVE
            </Typography>
          </Box>
        </Container>
      </Box>
      <ChatPanel />
    </Box >
  );
}

export default TransactionsPage;