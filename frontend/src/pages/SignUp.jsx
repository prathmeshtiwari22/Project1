import React, { useState } from 'react';
import API from '../api/api';
import { useNavigate } from 'react-router-dom';

export default function SignUp() {
  const [form, setForm] = useState({ username: '', email: '', password: '' });
  const [msg, setMsg] = useState(null);
  const navigate = useNavigate();

  const onChange = e => setForm({ ...form, [e.target.name]: e.target.value });
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
    <div style={{ maxWidth: 420, margin: 'auto', padding: 20 }}>
      <h2>Sign Up</h2>
      {msg && <div>{msg}</div>}
      <form onSubmit={onSubmit}>
        <input name="username" value={form.username} onChange={onChange} placeholder="Username" required />
        <input name="email" value={form.email} onChange={onChange} type="email" placeholder="Email" required />
        <input name="password" value={form.password} onChange={onChange} type="password" placeholder="Password" required minLength={6} />
        <button type="submit">Sign Up</button>
      </form>
    </div>
  );
}
