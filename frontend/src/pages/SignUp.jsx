import React, { useState } from 'react';
import API from '../api/api';
import { useNavigate } from 'react-router-dom';

// MUI UI Components
import {
  Box,
  TextField,
  Button,
  Typography,
  Card,
  CardContent,
  Grid
} from "@mui/material";

export default function SignUp() {
  const [form, setForm] = useState({ username: '', email: '', password: '' });
  const [msg, setMsg] = useState(null);
  const navigate = useNavigate();

  const onChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post('/auth/signup', form);
      setMsg(res.data.message);
      navigate('/verify', { state: { email: form.email, purpose: 'signup' } });
    } catch (err) {
      setMsg(err.response?.data?.message || 'Error');
    }
  };

  return (
    <Box sx={{ minHeight: "100vh", display: "flex", justifyContent: "center", alignItems: "center", padding: 2 }}>
      <Card sx={{ width: 450, padding: 4, borderRadius: 4, boxShadow: 6 }}>
        <CardContent>
          
          <Typography variant="h4" textAlign="center" fontWeight="bold" mb={3}>
            Sign Up
          </Typography>

          {msg && (
            <Typography color="error" textAlign="center" mb={2}>
              {msg}
            </Typography>
          )}

          <form onSubmit={onSubmit}>
            <Grid container spacing={2}>

              <Grid item xs={12}>
                <TextField
                  label="Username"
                  name="username"
                  value={form.username}
                  onChange={onChange}
                  fullWidth
                  required
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  label="Email"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={onChange}
                  fullWidth
                  required
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  label="Password"
                  name="password"
                  type="password"
                  value={form.password}
                  onChange={onChange}
                  fullWidth
                  required
                  inputProps={{ minLength: 6 }}
                />
              </Grid>

              <Grid item xs={12}>
                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  fullWidth
                >
                  Register
                </Button>
              </Grid>

            </Grid>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
}
