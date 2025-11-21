import React, { useState } from 'react';
import API from '../api/api';

export default function TransactionForm({ onAdded }) {
  const [form, setForm] = useState({ type: 'expense', description: '', amount: '' });
  const [msg, setMsg] = useState(null);

  const submit = async (e) => {
    e.preventDefault();
    try {
      await API.post('/transactions', { ...form, amount: Number(form.amount) });
      setMsg('Added');
      setForm({ type: 'expense', description: '', amount: '' });
      onAdded && onAdded();
    } catch (err) {
      setMsg(err.response?.data?.message || 'Error');
    }
  };

  return (
    <form onSubmit={submit} style={{ marginBottom: 20 }}>
      <select name="type" value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}>
        <option value="income">Income</option>
        <option value="expense">Expense</option>
      </select>
      <input name="description" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="Description" />
      <input name="amount" value={form.amount} onChange={e => setForm({ ...form, amount: e.target.value })} placeholder="Amount" type="number" />
      <button type="submit">Add</button>
      {msg && <div>{msg}</div>}
    </form>
  );
}
