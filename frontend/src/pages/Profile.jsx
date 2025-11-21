import React, { useEffect, useState } from 'react';
import API from '../api/api';

export default function Profile() {
  const [user, setUser] = useState(null);
  const [username, setUsername] = useState('');

  useEffect(() => {
    API.get('/users/me').then(res => { setUser(res.data.user); setUsername(res.data.user.username); });
  }, []);

  const update = async () => {
    const res = await API.put('/users/me', { username });
    setUser(res.data.user);
  };

  const logout = () => { localStorage.removeItem('token'); window.location.href = '/signin'; };

  return (
    <div style={{ maxWidth: 640, margin: 'auto', padding: 20 }}>
      <h2>Profile</h2>
      {user && (
        <div>
          <div>Email: {user.email}</div>
          <div>
            Username: <input value={username} onChange={e => setUsername(e.target.value)} /> <button onClick={update}>Save</button>
          </div>
          <div>Password: ******</div>
          <button onClick={logout}>Logout</button>
        </div>
      )}
    </div>
  );
}
