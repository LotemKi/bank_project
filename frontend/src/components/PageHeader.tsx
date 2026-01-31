import { Box, Typography } from "@mui/material";
import React from "react";

type Props = {
    title: string;
    subtitle?: string;
    right?: React.ReactNode;
};

export default function PageHeader({ title, subtitle, right }: Props) {
    return (
        <Box mb={4} display="flex" justifyContent="space-between" alignItems="center">
            <Box>
                <Typography variant="h4" fontWeight={700}>
                    {title}
                </Typography>
                {subtitle && (
                    <Typography color="text.secondary">{subtitle}</Typography>
                )}
            </Box>

            {right}
        </Box>
    );
}
