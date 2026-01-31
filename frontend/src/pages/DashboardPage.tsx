import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Box, Typography, Card, Button, alpha, Container } from "@mui/material";
import { ReceiptLong, History } from "@mui/icons-material";
import { theme } from "../theme/theme";
import { apiPrivate } from "../api/apiPrivate";
import type { Transaction } from "../types/userTransactionTypes";
import { useAuth } from "../hooks/useAuth";
import { BalanceCard, TransactionsTable, Navbar } from "../components";

const Dashboard = () => {
  const navigate = useNavigate();
  const { profile, balance, loading } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    const fetchTx = async () => {
      try {
        const resTx = await apiPrivate.get("/transactions", {
          params: { offset: 0, limit: 10 }
        });
        setTransactions(resTx.data.data.transactions);
      } catch (err: any) {
        if (err.response?.status === 401) navigate("/login");
      }
    };
    fetchTx();
  }, [navigate]);

  if (loading) return <p>Loading...</p>;

  const displayName = profile?.firstName || profile?.email?.split('@')[0] || "User";

  return (
    <Box sx={{
      height: "100vh",
      display: "flex",
      flexDirection: "column",
      bgcolor: theme.palette.primary.dark,
      overflow: "hidden"
    }}>

      {/* NAVIGATION BAR */}
      <Box sx={{ bgcolor: theme.palette.background.paper, flexShrink: 0 }}>
        <Navbar />
      </Box>

      {/* TOP WHITE SECTION */}
      <Box sx={{
        bgcolor: theme.palette.background.paper,
        pt: 4,
        pb: 0,
        borderBottom: `6px solid ${theme.palette.secondary.main}`,
        flexShrink: 0
      }}>
        <Container maxWidth="lg">
          <Box sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 5
          }}>
            <Box>
              <Typography variant="h3" fontWeight={900} sx={{ letterSpacing: -1.5, color: theme.palette.primary.dark }}>
                Welcome, <span style={{ color: theme.palette.secondary.main }}>{displayName}</span>
              </Typography>
              <Typography variant="subtitle1" sx={{ fontWeight: 800, color: alpha("#000", 0.4), textTransform: "uppercase", letterSpacing: 2 }}>
                SECURE VAULT ACCESS
              </Typography>
            </Box>

            <Box sx={{ flexGrow: 1, maxWidth: 800 }}>
              <BalanceCard balance={balance} onTransfer={() => navigate("/transfer")} />
            </Box>
          </Box>
        </Container>
      </Box>

      {/* BOTTOM GREEN SECTION */}
      <Box sx={{
        flex: 1, // Takes all remaining vertical space
        display: "flex",
        flexDirection: "column",
        p: 3,
        minHeight: 0,
        overflow: "hidden"
      }}>
        <Container maxWidth="lg" sx={{ flex: 1, display: "flex", flexDirection: "column", minHeight: 0 }}>

          <Card
            elevation={0}
            sx={{
              borderRadius: 4,
              border: `2px solid ${theme.palette.primary.main}`,
              display: "flex",
              flexDirection: "column",
              flex: 1,// Takes 70% of the vertical space
              minHeight: 0, // Forces card to stay within the green section
              overflow: "hidden",
              bgcolor: theme.palette.background.paper
            }}
          >
            {/* TEXT LABELS AS PROVIDED */}
            <Box sx={{ p: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0 }}>
              <Typography variant="h5" fontWeight={700} sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <History sx={{ color: theme.palette.primary.main }} /> Recent Activity
              </Typography>

              <Button
                endIcon={<ReceiptLong />}
                variant="text"
                sx={{ fontWeight: 700, color: theme.palette.primary.main }}
                onClick={() => navigate("/transactions")}
              >
                View All Transactions
              </Button>
            </Box>

            {/* SCROLLABLE CONTAINER */}
            <Box sx={{
              flex: 1,
              minHeight: 0,
              overflow: "hidden", // We let the TableContainer inside do the scrolling
              px: 1,
              pb: 1
            }}>
              <TransactionsTable
                transactions={transactions}
                profileEmail={profile?.email}
                maxHeight={450}
              />
            </Box>
          </Card>

          {/* FOOTER */}
          <Box sx={{ py: 1.5, textAlign: 'center', opacity: 0.4, flexShrink: 0 }}>
            <Typography variant="caption" sx={{ color: "#fff", fontWeight: 600 }}>
              LOK BANK INSTITUTIONAL DIVISION • © 2026
            </Typography>
          </Box>
        </Container>
      </Box>
    </Box>
  );
}

export default Dashboard;