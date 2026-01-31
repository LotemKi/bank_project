import React from "react";
import { Table, TableHead, TableBody, TableRow, TableCell, TableContainer, Box } from "@mui/material";
import { alpha } from "@mui/material/styles";
import { theme } from "../theme/theme";
import type { Transaction } from "../types/userTransactionTypes";

type Props = {
    transactions: Transaction[];
    profileEmail: string | null | undefined;
    maxHeight?: number;
    onScroll?: (e: React.UIEvent<HTMLDivElement>) => void;
};

export default function TransactionsTable({ transactions, profileEmail, maxHeight = 520, onScroll }: Props) {
    return (
        <TableContainer sx={{ maxHeight, overflowY: "auto" }} onScroll={onScroll}>
            <Table stickyHeader>
                <TableHead>
                    <TableRow>
                        <TableCell align="left" sx={headerStyle}>Date</TableCell>
                        <TableCell sx={headerStyle}>Description</TableCell>
                        <TableCell align="center" sx={headerStyle}>Amount</TableCell>
                        <TableCell align="left" sx={headerStyle}>Recipient / Sender</TableCell>
                    </TableRow>
                </TableHead>

                <TableBody>
                    {transactions.map((tx) => {
                        if (!profileEmail) return null;

                        const isCredit = tx.toEmail === profileEmail;
                        const counterpartyEmail = isCredit ? tx.fromEmail : tx.toEmail;

                        return (
                            <TableRow
                                key={tx.id}
                                hover
                                sx={{
                                    transition: "all 0.1s ease",
                                    "&:hover": { bgcolor: alpha(theme.palette.primary.main, 0.04) },
                                    "& td": { py: 2, borderBottom: "1px solid #f0f0f0" }
                                }}
                            >
                                {/* DATE - Fixed width, no wrap */}
                                <TableCell align="left" sx={{
                                    fontSize: 18,
                                    color: 'text.secondary',
                                    whiteSpace: 'nowrap',
                                    width: '150px'
                                }}>
                                    {new Date(tx.createdAt).toISOString().slice(0, 10)}
                                </TableCell>

                                {/* DESCRIPTION - Flexible width */}
                                <TableCell align="left" sx={{
                                    fontSize: 18,
                                    color: 'text.secondary',
                                    minWidth: '200px'
                                }}>
                                    {tx.description || "Settlement"}
                                </TableCell>

                                {/* AMOUNT - center aligned, no wrap, high contrast */}
                                <TableCell align="center" sx={{
                                    fontWeight: 900,
                                    fontSize: 18,
                                    whiteSpace: 'nowrap',
                                    width: '180px'
                                }}>
                                    <Box sx={{
                                        color: isCredit ? '#2BAB27' : '#e20909',
                                        fontFamily: 'monospace',
                                        display: 'inline-block'
                                    }}>
                                        {isCredit ? '+' : '-'} ₪ {Math.abs(tx.amount).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                    </Box>
                                </TableCell>

                                {/* COUNTERPARTY - Greyed "To/From" prefix */}
                                <TableCell align="left" sx={{
                                    color: 'text.secondary',
                                    fontSize: 18,
                                    whiteSpace: 'nowrap'
                                }}>
                                    <span style={{ fontSize: '14px', fontWeight: 800, opacity: 0.5, marginRight: '8px' }}>
                                        {isCredit ? 'FROM' : 'TO'}
                                    </span>
                                    {counterpartyEmail}
                                </TableCell>
                            </TableRow>
                        );
                    })}
                </TableBody>
            </Table>
        </TableContainer>
    );
}

// Consistently styled header to keep the code clean
const headerStyle = {
    bgcolor: "#043015 !important",
    color: "#fff",
    fontWeight: 800,
    fontSize: "14px",
    textTransform: "uppercase",
    letterSpacing: 1.2,
    py: 2,
    whiteSpace: 'nowrap',
    borderBottom: `2px solid ${theme.palette.secondary.main}`
};