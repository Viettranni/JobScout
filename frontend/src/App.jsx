import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

import Register from './components/Register';
import Login from './components/Login';
import Logout from './components/Logout';
import JobList from './components/JobList';

function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));

  return (
      <div className="App">
          {!token ? (
              <div>
                  <Register />
                  <Login setToken={setToken} />
              </div>
          ) : (
              <div>
                  <Logout setToken={setToken} />
                  <JobList />
              </div>
          )}
      </div>
  );
}

export default App
