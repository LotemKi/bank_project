import React from "react";
import { Box } from "@mui/material";

type Props = {
    children: React.ReactNode;
    sx?: any;
};

export default function PageWrapper({ children, sx }: Props) {
    return (
        <Box sx={{ minHeight: "100vh", bgcolor: "#f5f6fa", p: 4, ...sx }}>
            {children}
        </Box>
    );
}
