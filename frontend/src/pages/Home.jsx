import React, { useEffect, useState } from 'react';
import API from '../api/api';
import TransactionForm from '../components/TransactionForm';

export default function Home() {
  const [transactions, setTransactions] = useState([]);
  const [filters, setFilters] = useState({ page: 1, limit: 10 });
  const [meta, setMeta] = useState({});

  useEffect(() => {
    let cancelled = false;
    const fetchTx = async () => {
      const params = new URLSearchParams(filters).toString();
      const res = await API.get('/transactions?' + params);
      if (cancelled) return;
      setTransactions(res.data.transactions);
      setMeta({ total: res.data.total, page: res.data.page, limit: res.data.limit });
    };
    fetchTx();
    return () => { cancelled = true; };
  }, [filters]);

  return (
    <div style={{ padding: 20 }}>
      <h2>Home — Finance Tracker</h2>
      <TransactionForm onAdded={() => setFilters({ ...filters })} />

      <div>
        <h3>Filters</h3>
        <select onChange={e => setFilters({ ...filters, type: e.target.value })}>
          <option value="">All</option>
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>

        <button onClick={() => setFilters({ ...filters, page: meta.page - 1 > 0 ? meta.page - 1 : 1 })}>Prev</button>
        <span>{meta.page} / {Math.ceil((meta.total||0)/meta.limit || 1)}</span>
        <button onClick={() => setFilters({ ...filters, page: (meta.page || 1) + 1 })}>Next</button>
      </div>

      <ul>
        {transactions.map(tx => (
          <li key={tx._id}>{tx.type} | {tx.description} | {tx.amount} | {new Date(tx.date).toLocaleString()}</li>
        ))}
      </ul>
      </div>
  );
}
