// frontend/src/pages/Home.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/api";
import TransactionForm from "../components/TransactionForm";

import {
  AppBar,
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Container,
  Grid,
  IconButton,
  Menu,
  MenuItem,
  Paper,
  Stack,
  Toolbar,
  Typography,
  Pagination,
  TextField,
  FormControl,
  InputLabel,
  Select,
} from "@mui/material";

import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import LogoutIcon from "@mui/icons-material/Logout";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";

export default function Home() {
  const navigate = useNavigate();

  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [meta, setMeta] = useState({ page: 1, limit: 8, total: 0 });

  // 🔥 NEW: Filter state
  const [filters, setFilters] = useState({
    type: "",
    startDate: "",
    endDate: "",
    minAmount: "",
    maxAmount: "",
    sortBy: "",
    sortOrder: "desc",
  });

  // Profile menu
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleAvatarClick = (e) => setAnchorEl(e.currentTarget);
  const handleClose = () => setAnchorEl(null);
  const goProfile = () => {
    handleClose();
    navigate("/profile");
  };
  const logout = () => {
    localStorage.removeItem("token");
    navigate("/signin");
  };

  // Fetch transactions WITH FILTERS
  const fetchTx = async (page = meta.page) => {
    try {
      setLoading(true);

      const params = {
        page,
        limit: meta.limit,
        ...filters,
      };

      const query = new URLSearchParams(params).toString();

      const res = await API.get(`/transactions?${query}`);

      setTransactions(res.data.transactions || []);
      setMeta({
        page: res.data.page,
        limit: res.data.limit,
        total: res.data.total,
      });
    } catch (err) {
      console.error("Filter fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTx();
  }, [meta.page]);

  const totalPages = Math.max(1, Math.ceil(meta.total / meta.limit));

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#f5f7fb" }}>
      {/* NAVBAR */}
      <AppBar position="sticky" elevation={3} color="primary">
        <Toolbar>
          <MonetizationOnIcon sx={{ mr: 1 }} />
          <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 700 }}>
            Finance Tracker
          </Typography>

          <IconButton onClick={handleAvatarClick}>
            <Avatar>
              <AccountCircleIcon />
            </Avatar>
          </IconButton>

          <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
            <MenuItem onClick={goProfile}>
              <AccountCircleIcon sx={{ mr: 1 }} /> Profile
            </MenuItem>
            <MenuItem onClick={logout}>
              <LogoutIcon sx={{ mr: 1 }} /> Logout
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Grid container spacing={3}>
          {/* LEFT: ADD FORM */}
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 2, mb: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                Quick Add
              </Typography>
              <div id="tx-form">
                <TransactionForm onAdded={() => fetchTx(1)} />
              </div>
            </Paper>
          </Grid>

          {/* RIGHT: LIST */}
          <Grid item xs={12} md={8}>
            <Paper sx={{ p: 2 }}>
              {/* FILTER UI */}
              <Stack
                direction="row"
                gap={2}
                justifyContent="space-between"
                flexWrap="wrap"
                mb={3}
              >
                <FormControl size="small" sx={{ width: 140 }}>
                  <InputLabel>Type</InputLabel>
                  <Select
                    value={filters.type}
                    label="Type"
                    onChange={(e) =>
                      setFilters({ ...filters, type: e.target.value })
                    }
                  >
                    <MenuItem value="">All</MenuItem>
                    <MenuItem value="income">Income</MenuItem>
                    <MenuItem value="expense">Expense</MenuItem>
                  </Select>
                </FormControl>

                <TextField
                  size="small"
                  type="date"
                  label="Start Date"
                  InputLabelProps={{ shrink: true }}
                  value={filters.startDate}
                  onChange={(e) =>
                    setFilters({ ...filters, startDate: e.target.value })
                  }
                />
                <TextField
                  size="small"
                  type="date"
                  label="End Date"
                  InputLabelProps={{ shrink: true }}
                  value={filters.endDate}
                  onChange={(e) =>
                    setFilters({ ...filters, endDate: e.target.value })
                  }
                />

                <TextField
                  size="small"
                  label="Min Amount"
                  value={filters.minAmount}
                  onChange={(e) =>
                    setFilters({ ...filters, minAmount: e.target.value })
                  }
                  type="number"
                  sx={{ width: 120 }}
                />

                <TextField
                  size="small"
                  label="Max Amount"
                  value={filters.maxAmount}
                  onChange={(e) =>
                    setFilters({ ...filters, maxAmount: e.target.value })
                  }
                  type="number"
                  sx={{ width: 120 }}
                />

                <FormControl size="small" sx={{ width: 130 }}>
                  <InputLabel>Sort By</InputLabel>
                  <Select
                    value={filters.sortBy}
                    label="Sort By"
                    onChange={(e) =>
                      setFilters({ ...filters, sortBy: e.target.value })
                    }
                  >
                    <MenuItem value="">Default</MenuItem>
                    <MenuItem value="amount">Amount</MenuItem>
                    <MenuItem value="date">Date</MenuItem>
                  </Select>
                </FormControl>

                <FormControl size="small" sx={{ width: 120 }}>
                  <InputLabel>Order</InputLabel>
                  <Select
                    value={filters.sortOrder}
                    label="Order"
                    onChange={(e) =>
                      setFilters({ ...filters, sortOrder: e.target.value })
                    }
                  >
                    <MenuItem value="desc">DESC</MenuItem>
                    <MenuItem value="asc">ASC</MenuItem>
                  </Select>
                </FormControl>

                <Button
                  variant="contained"
                  onClick={() => fetchTx(1)}
                  sx={{ height: 40 }}
                >
                  Apply
                </Button>
              </Stack>

              {/* LIST */}
              <Grid container spacing={2}>
                {transactions.length === 0 && (
                  <Grid item xs={12}>
                    <Paper sx={{ p: 3, textAlign: "center" }}>
                      <Typography>No transactions found.</Typography>
                    </Paper>
                  </Grid>
                )}

                {transactions.map((tx) => (
                  <Grid item xs={12} key={tx._id}>
                    <Card variant="outlined" sx={{ borderRadius: 2 }}>
                      <CardContent
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <Stack direction="row" spacing={2} alignItems="center">
                          <Chip
                            label={tx.type?.toUpperCase()}
                            color={tx.type === "income" ? "success" : "error"}
                          />
                          <div>
                            <Typography sx={{ fontWeight: 600 }}>
                              {tx.description || "—"}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {new Date(tx.date).toLocaleString()}
                            </Typography>
                          </div>
                        </Stack>
                        <Typography variant="h6" sx={{ fontWeight: 700 }}>
                          {Number(tx.amount).toLocaleString()}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>

              {/* PAGINATION */}
              <Stack spacing={2} alignItems="center" mt={3}>
                <Pagination
                  count={totalPages}
                  page={meta.page}
                  onChange={(e, pg) =>
                    setMeta((p) => ({ ...p, page: pg }))
                  }
                  color="primary"
                />
              </Stack>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
