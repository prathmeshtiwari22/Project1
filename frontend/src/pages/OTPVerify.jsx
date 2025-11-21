import React, { useState } from 'react';
import API from '../api/api';
import { useLocation, useNavigate } from 'react-router-dom';

export default function OTPVerify() {
  const [code, setCode] = useState('');
  const [msg, setMsg] = useState(null);
  const loc = useLocation();
  const navigate = useNavigate();

  const purpose = loc.state?.purpose || 'signup';
  const email = loc.state?.email;

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      if (purpose === 'signup') {
        const res = await API.post('/auth/signup/verify', { email, code });
        localStorage.setItem('token', res.data.token);
                navigate('/');
      } else if (purpose === 'signin') {
        const res = await API.post('/auth/signin/verify', { email, code });
        localStorage.setItem('token', res.data.token);
        navigate('/');
      }
    } catch (err) {
      setMsg(err.response?.data?.message || 'Invalid OTP');
    }
  };

  return (
    <div style={{ maxWidth: 420, margin: 'auto', padding: 20 }}>
      <h2>Verify OTP</h2>
      <div>Purpose: {purpose}</div>
      <form onSubmit={onSubmit}>
        <input value={code} onChange={(e) => setCode(e.target.value)} placeholder="Enter OTP" required />
        <button type="submit">Verify</button>
      </form>
      {msg && <div>{msg}</div>}
    </div>
  );
}
