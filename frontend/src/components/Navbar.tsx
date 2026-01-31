import { Avatar, Box, IconButton, Tooltip, Menu, MenuItem, ListItemIcon, Divider, Typography, alpha, Paper } from "@mui/material";
import React, { useState } from "react";
import { Person, Logout, Badge, ContactPhone, MailOutline, Security } from "@mui/icons-material"; // Added more icons
import { theme } from "../theme/theme";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { useAuth } from "../hooks/useAuth";

export default function Navbar() {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const navigate = useNavigate();
    const { profile } = useAuth();

    const handleProfileClick = (event: React.MouseEvent<HTMLElement>) => setAnchorEl(event.currentTarget);
    const handleCloseMenu = () => setAnchorEl(null);

    const handleLogout = () => {
        Cookies.remove("access_token");
        navigate("/login");
    };

    const handleDashboard = () => navigate("/dashboard");

    // Truncate logic for User ID
    const displayId = profile?.id ? (profile.id.length > 10 ? `${profile.id.substring(0, 22)}` : profile.id) : "N/A";

    return (
        <Box sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            px: { xs: 3, md: 8 },
            height: '130px',
            borderBottom: `4px solid ${theme.palette.secondary.main}`, // Stronger secondary border
            bgcolor: theme.palette.primary.dark,
            boxShadow: `0 4px 20px ${alpha('#000', 0.5)}`
        }}>
            <img
                src={theme.custom.logoImage}
                alt="LOK BANK"
                style={{ height: '170px', width: 'auto', cursor: 'pointer', transition: 'all 0.3s' }}
                onClick={handleDashboard}
            />

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box sx={{ textAlign: 'right', mr: 2, display: { xs: 'none', sm: 'block' } }}>
                    <Typography variant="caption" sx={{ color: theme.palette.secondary.main, fontWeight: 900, letterSpacing: 1.5 }}>
                        OFFICIAL SESSION
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#fff', fontWeight: 600 }}>
                        {profile?.firstName} {profile?.lastName}
                    </Typography>
                </Box>

                <Tooltip title="Vault Access & Profile">
                    <IconButton
                        onClick={handleProfileClick}
                        sx={{
                            p: '4px',
                            border: `2px solid ${alpha(theme.palette.secondary.main, 0.5)}`,
                            '&:hover': { border: `2px solid ${theme.palette.secondary.main}`, bgcolor: alpha('#fff', 0.05) }
                        }}
                    >
                        <Avatar
                            sx={{
                                width: 55,
                                height: 55,
                                bgcolor: theme.palette.secondary.main,
                                color: theme.palette.primary.dark,
                                fontWeight: 900
                            }}
                        >
                            {profile?.firstName?.[0]}{profile?.lastName?.[0]}
                        </Avatar>
                    </IconButton>
                </Tooltip>
            </Box>

            <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={handleCloseMenu}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                slotProps={{
                    paper: {
                        elevation: 0,
                        sx: {
                            borderRadius: 1, // Sharp, institutional edges
                            mt: 2,
                            minWidth: 280,
                            border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
                            boxShadow: '0 10px 40px rgba(0,0,0,0.15)',
                            overflow: 'visible',
                            '&:before': { // The little triangle arrow
                                content: '""',
                                display: 'block',
                                position: 'absolute',
                                top: 0,
                                right: 32,
                                width: 10,
                                height: 10,
                                bgcolor: 'background.paper',
                                transform: 'translateY(-50%) rotate(45deg)',
                                zIndex: 0,
                                borderLeft: '1px solid #eee',
                                borderTop: '1px solid #eee'
                            }
                        }
                    }
                }}
            >
                {/* ACCOUNT HEADER CARD */}
                <Box sx={{ px: 2.5, py: 2, bgcolor: alpha(theme.palette.primary.main, 0.03) }}>
                    <Typography variant="overline" sx={{ color: theme.palette.secondary.main, fontWeight: 900, lineHeight: 1 }}>
                        Authorized Personnel
                    </Typography>
                    <Typography variant="h6" sx={{ fontWeight: 800, color: theme.palette.primary.dark }}>
                        {profile?.firstName} {profile?.lastName}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.5 }}>
                        <Security sx={{ fontSize: 14, color: '#2BAB27' }} />
                        <Typography variant="caption" sx={{ color: '#2BAB27', fontWeight: 700 }}>
                            Active Security Clearance
                        </Typography>
                    </Box>
                </Box>

                <Divider />

                {/* DETAILS LIST */}
                <Box sx={{ py: 1 }}>
                    <MenuItem sx={{ py: 1.5, cursor: 'default', '&:hover': { bgcolor: 'transparent' } }}>
                        <ListItemIcon><MailOutline fontSize="small" /></ListItemIcon>
                        <Box>
                            <Typography variant="caption" display="block" color="text.secondary">Primary Email</Typography>
                            <Typography variant="body2" fontWeight={600}>{profile?.email}</Typography>
                        </Box>
                    </MenuItem>

                    <MenuItem sx={{ py: 1.5, cursor: 'default', '&:hover': { bgcolor: 'transparent' } }}>
                        <ListItemIcon><ContactPhone fontSize="small" /></ListItemIcon>
                        <Box>
                            <Typography variant="caption" display="block" color="text.secondary">Contact Phone</Typography>
                            <Typography variant="body2" fontWeight={600}>{profile?.phone}</Typography>
                        </Box>
                    </MenuItem>

                    <MenuItem sx={{ py: 1.5, cursor: 'default', '&:hover': { bgcolor: 'transparent' } }}>
                        <ListItemIcon><Badge fontSize="small" /></ListItemIcon>
                        <Box>
                            <Typography variant="caption" display="block" color="text.secondary">User Identifier</Typography>
                            <Typography variant="body2" fontWeight={600}>
                                {displayId}
                            </Typography>
                        </Box>
                    </MenuItem>
                </Box>

                <Divider sx={{ borderStyle: 'dashed' }} />

                <MenuItem
                    onClick={handleLogout}
                    sx={{
                        py: 2,
                        color: '#d32f2f',
                        fontWeight: 800,
                        transition: "all 0.2s ease-in-out",
                        mx: 1, // Added margin so the hover background doesn't hit the edges
                        borderRadius: 1,
                        "&:hover": {
                            bgcolor: alpha('#d32f2f', 0.08), // Soft red background on hover
                            color: '#b71c1c',
                            "& .logout-icon": {
                                transform: "translateX(5px) scale(1.1)", // Icon slides and grows
                                color: '#b71c1c',
                            }
                        },
                        "&:active": {
                            transform: "scale(0.98)",
                        }
                    }}
                >
                    <ListItemIcon>
                        <Logout
                            className="logout-icon" // Class name for targeting
                            fontSize="small"
                            sx={{
                                color: '#d32f2f',
                                transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                            }}
                        />
                    </ListItemIcon>
                    <Typography variant="body2" fontWeight={800} sx={{ letterSpacing: 0.5 }}>
                        Logout
                    </Typography>
                </MenuItem>
            </Menu>
        </Box >
    );
}