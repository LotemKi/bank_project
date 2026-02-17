import { useState, useEffect } from "react";
import {
  Box, TextField, Typography, Button, IconButton, InputAdornment,
  alpha, Divider, Paper, Dialog, DialogTitle,
  DialogContent, DialogContentText, DialogActions
} from "@mui/material";
import { LockOutlined, Shield, Visibility, VisibilityOff, RadioButtonChecked, InfoOutlined } from "@mui/icons-material";
import { theme } from "../theme/theme.ts";
import Cookies from "js-cookie";
import { useSearchParams, useNavigate } from "react-router-dom";
import { api } from "../api/apiPublic.ts";
import login from "../api/loginService.ts";
import type { LoginRequest } from "../types/authTypes.ts";
import { useAuthContext } from "../hooks/AuthProvider.tsx";

const Login = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const verifyToken = searchParams.get("token");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [openForgot, setOpenForgot] = useState(false); // State for the popup
  const navigate = useNavigate();
  const { refreshProfile } = useAuthContext();

  useEffect(() => {
    if (!verifyToken) return;
    const verifyUser = async () => {
      try {
        await api.get("/auth/verify", { params: { token: verifyToken } });
        alert("Email verified successfully");
        searchParams.delete("token");
        setSearchParams(searchParams, { replace: true });
      } catch (err: any) {
        alert(err?.response?.data?.error ?? "Verification failed");
      }
    };
    verifyUser();
  }, []);

  const handleSubmit = async () => {
    const loginData: LoginRequest = { email, password };
    const res = await login(loginData);
    if (res.success) {
      Cookies.set("access_token", res.data.jwt, { secure: true, sameSite: "strict" });
      await refreshProfile();
      navigate("/dashboard");
    }
    else {
      if (res.data === "INVALID_CREDENTIALS") {
        alert("Invalid email or password. Please try again.");
      }
      else if (res.data === "SERVER_ERROR") {
        alert("Server error occurred. Please try again later.");
      }
      else {
        alert("Network error. Please check your connection and try again.");
      }
    }
  };

  return (
    <Box sx={{
      minHeight: "100vh",
      display: "flex",
      flexDirection: 'column',
      bgcolor: theme.palette.primary.main,
    }}>

      {/* SOLID GOLD TOP ACCENT */}
      <Box sx={{ height: '6px', bgcolor: theme.palette.secondary.main, width: '100%' }} />

      <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', p: 2 }}>
        <Paper
          elevation={0}
          sx={{
            display: "flex",
            width: "100%",
            maxWidth: 1100,
            minHeight: 650,
            borderRadius: 3,
            overflow: "hidden",
            bgcolor: "background.paper",
            boxShadow: `0 40px 100px ${alpha('#000', 0.5)}`,
            border: `1px solid ${alpha(theme.palette.secondary.main, 0.2)}`
          }}
        >
          {/* LEFT SECTION: BRANDING */}
          <Box
            sx={{
              flex: 1.2,
              display: { xs: "none", md: "flex" },
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              bgcolor: theme.palette.primary.dark,
              color: "white",
              p: 3,
              textAlign: "center",
              position: "relative",
              borderRight: `1px solid ${alpha(theme.palette.secondary.main, 0.3)}`
            }}
          >
            <Box sx={{ position: 'absolute', top: 40, display: 'flex', alignItems: 'center', gap: 1 }}>
              <RadioButtonChecked sx={{ fontSize: 10, color: '#4caf50' }} />
              <Typography variant="caption" sx={{ letterSpacing: 1.5, fontWeight: 700, opacity: 0.8 }}>
                SECURE SERVER ACTIVE
              </Typography>
            </Box>

            <img
              src={theme.custom.logoImage}
              alt="LOK Bank Logo"
              style={{ width: "380px", marginBottom: "2.5rem" }}
            />

            <Typography variant="h3" fontWeight={800} sx={{ mb: 2 }}>
              The Gold Standard.
            </Typography>

            <Typography variant="body1" sx={{ color: alpha("#fff", 0.7), maxWidth: 400, mx: "auto" }}>
              Institutional-grade security for the modern era. Your assets are protected by the LOK multi-vault encryption protocol.
            </Typography>

            <Box sx={{ mt: 5, display: 'flex', gap: 3 }}>
              <Box sx={{ textAlign: 'center' }}>
                <Shield sx={{ color: theme.palette.secondary.main, mb: 0.5 }} />
                <Typography variant="caption" display="block" fontWeight={700}>Verified</Typography>
              </Box>
              <Box sx={{ textAlign: 'center' }}>
                <LockOutlined sx={{ color: theme.palette.secondary.main, mb: 0.5 }} />
                <Typography variant="caption" display="block" fontWeight={700}>Encrypted</Typography>
              </Box>
            </Box>
          </Box>

          {/* RIGHT SECTION: FORM */}
          <Box
            sx={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              p: { xs: 4, md: 8 },
              bgcolor: "#ffffff",
            }}
          >
            <Box sx={{ width: "100%", maxWidth: 360, mx: "auto" }}>
              <Box sx={{ mb: 4 }}>
                <Typography variant="h3" fontWeight={900} color="text.primary" sx={{ letterSpacing: -1 }}>
                  Sign In
                </Typography>
                <Box sx={{ height: '3px', width: '40px', bgcolor: theme.palette.secondary.main, mt: 1, mb: 2 }} />
                <Typography variant="body2" color="text.secondary" fontWeight={500}>
                  Enter your secure credentials to proceed.
                </Typography>
              </Box>

              <Box component="form" noValidate>
                <TextField
                  margin="normal"
                  fullWidth
                  label="Email"
                  variant="standard"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  sx={{ mb: 2, '& .MuiInputLabel-root': { fontWeight: 700, fontSize: '0.8rem' } }}
                />
                <TextField
                  margin="normal"
                  fullWidth
                  label="Password"
                  type={showPassword ? "text" : "password"}
                  variant="standard"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  sx={{ mb: 1, '& .MuiInputLabel-root': { fontWeight: 700, fontSize: '0.8rem' } }}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={() => setShowPassword(!showPassword)} size="small">
                          {showPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />

                <Box sx={{ textAlign: 'right', mt: 1, mb: 4 }}>
                  <Button
                    variant="text"
                    size="small"
                    onClick={() => setOpenForgot(true)} // Opens the Dialog
                    sx={{ textTransform: 'none', color: theme.palette.primary.dark, fontWeight: 700 }}
                  >
                    Forgot Password?
                  </Button>
                </Box>

                <Button
                  fullWidth
                  variant="contained"
                  size="large"
                  onClick={handleSubmit}
                  sx={{
                    py: 2,
                    fontWeight: 800,
                    borderRadius: 1,
                    bgcolor: theme.palette.primary.dark,
                    fontSize: "1rem",
                    letterSpacing: 1,
                    "&:hover": { bgcolor: theme.palette.primary.dark },
                    boxShadow: `0 8px 16px ${alpha(theme.palette.primary.dark, 0.2)}`,
                  }}
                >
                  Access Account
                </Button>

                <Divider sx={{ my: 4 }}>
                  <Typography variant="caption" color="text.disabled" sx={{ fontWeight: 800, letterSpacing: 1 }}>
                    SECURE AUTHENTICATION
                  </Typography>
                </Divider>

                <Typography variant="body2" align="center" color="text.secondary">
                  Don't have an account yet?
                  <Button
                    onClick={() => navigate("/signup")}
                    sx={{ fontWeight: 800, color: theme.palette.primary.dark, ml: 0.5 }}>
                    Signup here
                  </Button>
                </Typography>
              </Box>
            </Box>
          </Box>
        </Paper>
      </Box>

      {/* 4. FORGOT PASSWORD DIALOG */}
      <Dialog
        open={openForgot}
        onClose={() => setOpenForgot(false)}
        PaperProps={{
          sx: { borderRadius: 2, p: 1, borderTop: `4px solid ${theme.palette.secondary.main}` }
        }}
      >
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1.5, fontWeight: 800 }}>
          <InfoOutlined color="primary" /> Institutional Reminder
        </DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ fontWeight: 500, color: 'text.primary' }}>
            We currently don't have a password reset protocol in place for this vault.
            <br /><br />
            <strong>Pro Tip:</strong> Try to remember it next time! If you're truly locked out, you may need to register a new entity.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ pb: 2, px: 3 }}>
          <Button
            onClick={() => setOpenForgot(false)}
            variant="contained"
            sx={{ bgcolor: theme.palette.primary.dark, fontWeight: 700 }}
          >
            Understood
          </Button>
        </DialogActions>
      </Dialog>

      {/* COMPLIANCE FOOTER */}
      <Box sx={{ pb: 3, textAlign: 'center', opacity: 0.5 }}>
        <Typography variant="caption" sx={{ color: "#fff", letterSpacing: 1 }}>
          LOK Bank Infrastructure © 2026 | Certified Secure Environment
        </Typography>
      </Box>
    </Box>
  );
}

export default Login;