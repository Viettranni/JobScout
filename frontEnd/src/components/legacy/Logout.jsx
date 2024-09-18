import React from 'react';
import axios from 'axios';

const Logout = ({ setToken }) => {
    const handleLogout = () => {
        localStorage.removeItem('token');
        setToken(null);
        axios.post('/api/auth/logout')
            .then(() => alert('Logged out successfully!'))
            .catch(error => alert('Logout failed!'));
    };

    return <button onClick={handleLogout}>Logout</button>;
};

export default Logout;
