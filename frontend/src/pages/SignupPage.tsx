import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, TextField, Typography, Button, IconButton, InputAdornment, alpha, Divider, Paper, Grid } from "@mui/material";
import { Visibility, VisibilityOff, Shield, PersonAddAlt1, RadioButtonChecked } from "@mui/icons-material";
import { theme } from "../theme/theme.ts";

import signup from "../api/signupService.ts";
import type { SignupRequest } from "../types/authTypes.ts";

const Signup = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async () => {
    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    const signupData: SignupRequest = { firstName, lastName, phone, email, password };
    const result = await signup(signupData);

    if (result.success) {
      navigate("/login", { replace: true });
    } else {
      alert(result.error);
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
            minHeight: 700, // Adjusted for more fields
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
              flex: 1,
              display: { xs: "none", md: "flex" },
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              bgcolor: theme.palette.primary.dark,
              color: "white",
              p: 6,
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
              style={{ width: "350px", marginBottom: "2.5rem" }}
            />

            <Typography variant="h3" fontWeight={800} sx={{ mb: 2 }}>
              Join the Institution.
            </Typography>

            <Typography variant="body1" sx={{ color: alpha("#fff", 0.7), maxWidth: 400, mx: "auto" }}>
              Secure your future with the most advanced banking encryption in the digital asset space.
            </Typography>

            <Box sx={{ mt: 5, display: 'flex', gap: 3 }}>
              <Box sx={{ textAlign: 'center' }}>
                <PersonAddAlt1 sx={{ color: theme.palette.secondary.main, mb: 0.5 }} />
                <Typography variant="caption" display="block" fontWeight={700}>Fast Entry</Typography>
              </Box>
              <Box sx={{ textAlign: 'center' }}>
                <Shield sx={{ color: theme.palette.secondary.main, mb: 0.5 }} />
                <Typography variant="caption" display="block" fontWeight={700}>Protected</Typography>
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
              p: { xs: 4, md: 6 },
              bgcolor: "#ffffff",
            }}
          >
            <Box sx={{ width: "100%", maxWidth: 450, mx: "auto" }}>
              <Box sx={{ mb: 3 }}>
                <Typography variant="h3" fontWeight={900} color="text.primary" sx={{ letterSpacing: -1 }}>
                  Create Account
                </Typography>
                <Box sx={{ height: '3px', width: '40px', bgcolor: theme.palette.secondary.main, mt: 1, mb: 2 }} />
                <Typography variant="body2" color="text.secondary" fontWeight={500}>
                  Begin your journey with LOK Bank.
                </Typography>
              </Box>

              <Box component="form" noValidate>
                <Grid container spacing={3}>
                  {/* ROW 1: NAMES */}
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      fullWidth
                      label="First Name"
                      variant="standard"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      sx={{ '& .MuiInputLabel-root': { fontWeight: 700, fontSize: '0.8rem' } }}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      fullWidth
                      label="Last Name"
                      variant="standard"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      sx={{ '& .MuiInputLabel-root': { fontWeight: 700, fontSize: '0.8rem' } }}
                    />
                  </Grid>

                  {/* ROW 2: CONTACT */}
                  <Grid size={{ xs: 12 }}>
                    <TextField
                      fullWidth
                      label="Phone Number"
                      type="tel"
                      variant="standard"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      sx={{ '& .MuiInputLabel-root': { fontWeight: 700, fontSize: '0.8rem' } }}
                    />
                  </Grid>
                  <Grid size={{ xs: 12 }}>
                    <TextField
                      fullWidth
                      label="Email"
                      type="email"
                      variant="standard"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      sx={{ '& .MuiInputLabel-root': { fontWeight: 700, fontSize: '0.8rem' } }}
                    />
                  </Grid>

                  {/* ROW 3: SECURITY CODES */}
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      fullWidth
                      label="Password"
                      type={showPassword ? "text" : "password"}
                      variant="standard"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      sx={{ '& .MuiInputLabel-root': { fontWeight: 700, fontSize: '0.8rem' } }}
                      slotProps={{
                        input: {
                          endAdornment: (
                            <InputAdornment position="end">
                              <IconButton onClick={() => setShowPassword(!showPassword)} size="small">
                                {showPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                              </IconButton>
                            </InputAdornment>
                          ),
                        },
                      }}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      fullWidth
                      label="Confirm"
                      type={showConfirm ? "text" : "password"}
                      variant="standard"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      sx={{ '& .MuiInputLabel-root': { fontWeight: 700, fontSize: '0.8rem' } }}
                      slotProps={{
                        input: {
                          endAdornment: (
                            <InputAdornment position="end">
                              <IconButton onClick={() => setShowConfirm(!showConfirm)} size="small">
                                {showConfirm ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                              </IconButton>
                            </InputAdornment>
                          ),
                        },
                      }}
                    />
                  </Grid>
                </Grid>

                <Button
                  fullWidth
                  variant="contained"
                  size="large"
                  onClick={handleSubmit}
                  sx={{
                    mt: 4,
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
                  Register Account
                </Button>

                <Divider sx={{ my: 3 }}>
                  <Typography variant="caption" color="text.disabled" sx={{ fontWeight: 800, letterSpacing: 1 }}>
                    MEMBERSHIP
                  </Typography>
                </Divider>

                <Typography variant="body2" align="center" color="text.secondary">
                  Already have an account?
                  <Button
                    onClick={() => navigate("/login")}
                    sx={{ fontWeight: 800, color: theme.palette.primary.dark, ml: 0.5 }}>
                    Log In Here
                  </Button>
                </Typography>
              </Box>
            </Box>
          </Box>
        </Paper>
      </Box>

      {/* COMPLIANCE FOOTER */}
      <Box sx={{ pb: 3, textAlign: 'center', opacity: 0.5 }}>
        <Typography variant="caption" sx={{ color: "#fff", letterSpacing: 1 }}>
          LOK Bank Infrastructure © 2026 | All data is encrypted via SHA-256
        </Typography>
      </Box>
    </Box>
  );
}

export default Signup;