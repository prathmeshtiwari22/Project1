// frontend/src/pages/Profile.jsx
import React, { useEffect, useState } from 'react';
import API from '../api/api';
import { useNavigate } from 'react-router-dom';

import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Divider,
  Grid,
  IconButton,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import LogoutIcon from '@mui/icons-material/Logout';

export default function Profile() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [username, setUsername] = useState('');
  const [editing, setEditing] = useState(false);
  const [msg, setMsg] = useState(null);

  useEffect(() => {
    API.get('/users/me')
      .then((res) => {
        setUser(res.data.user);
        setUsername(res.data.user.username);
      })
      .catch((err) => {
        console.error('fetch profile error', err);
        // if unauthorized -> go to signin
        if (err?.response?.status === 401) {
          localStorage.removeItem('token');
          navigate('/signin');
        }
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const update = async () => {
    try {
      const res = await API.put('/users/me', { username });
      setUser(res.data.user);
      setMsg('Saved');
      setEditing(false);
      setTimeout(() => setMsg(null), 2500);
    } catch (err) {
      console.error('update profile error', err);
      setMsg(err.response?.data?.message || 'Error updating');
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    navigate('/signin');
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f5f7fb', py: 6 }}>
      <Container maxWidth="sm">
        <Card sx={{ borderRadius: 3, boxShadow: 6 }}>
          <CardContent sx={{ p: 4 }}>
            <Stack alignItems="center" spacing={2} mb={2}>
              <Avatar sx={{ width: 96, height: 96, bgcolor: 'primary.main' }}>
                {user?.username?.[0]?.toUpperCase() || 'U'}
              </Avatar>

              <Typography variant="h5" sx={{ fontWeight: 800 }}>
                {user?.username || 'User'}
              </Typography>

              <Typography variant="body2" color="text.secondary">
                Member since {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : '—'}
              </Typography>
            </Stack>

            <Divider sx={{ my: 2 }} />

            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
                  Email
                </Typography>
                <TextField
                  value={user?.email || ''}
                  fullWidth
                  size="small"
                  disabled
                />
              </Grid>

              <Grid item xs={12}>
                <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
                  Username
                </Typography>

                <Stack direction="row" spacing={1}>
                  <TextField
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    fullWidth
                    size="small"
                    disabled={!editing}
                  />
                  <IconButton
                    color="primary"
                    onClick={() => {
                      if (editing) update();
                      else setEditing(true);
                    }}
                    sx={{ alignSelf: 'center' }}
                  >
                    {editing ? <SaveIcon /> : <EditIcon />}
                  </IconButton>
                </Stack>
              </Grid>

              <Grid item xs={12}>
                <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
                  Password
                </Typography>
                <TextField value="••••••••" fullWidth size="small" disabled />
              </Grid>
            </Grid>

            {msg && (
              <Typography variant="body2" color="success.main" mt={2}>
                {msg}
              </Typography>
            )}

            <Stack direction="row" spacing={2} mt={3} justifyContent="space-between">
              <Button variant="outlined" color="primary" onClick={() => navigate('/')}>
                Back to Home
              </Button>

              <Button variant="contained" color="error" startIcon={<LogoutIcon />} onClick={logout}>
                Logout
              </Button>
            </Stack>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
}
