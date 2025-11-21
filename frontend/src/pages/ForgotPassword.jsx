import React, { useState } from 'react';
import API from '../api/api';
import { useNavigate } from 'react-router-dom';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const navigate = useNavigate();
  const [msg, setMsg] = useState(null);

  const requestOtp = async () => {
    try {
      const res = await API.post('/auth/forgot/request', { email });
      setMsg(res.data.message);
      navigate('/verify', { state: { email, purpose: 'forgot' } });
    } catch (err) {
      setMsg(err.response?.data?.message || 'Error');
    }
  };

  return (
    <div style={{ maxWidth: 420, margin: 'auto', padding: 20 }}>
      <h2>Forgot Password</h2>
      <input value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" />
      <button onClick={requestOtp}>Request OTP</button>
      {msg && <div>{msg}</div>}
    </div>
  );
}
