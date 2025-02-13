import React, { useState, useEffect } from 'react';
import ThreatsTable from './components/ThreatsTable';
import Login from './components/Login';

function App() {
  const [token, setToken] = useState(sessionStorage.getItem('token') || '');

  useEffect(() => {
    if (sessionStorage.getItem('token')) {
      setToken(sessionStorage.getItem('token'));
    }
  }, []);

  return (
    <div>
      {token ? (
        <ThreatsTable token={token} />
      ) : (
        <Login setToken={setToken} />
      )}
    </div>
  );
}

export default App;
