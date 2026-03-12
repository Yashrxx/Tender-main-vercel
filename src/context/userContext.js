// src/context/UserContext.js
import { createContext, useState } from 'react';

export const UserContext = createContext();

// Read from localStorage synchronously on module load — no flash
function getInitialUser() {
    try {
        const storedUser = localStorage.getItem('user');
        const token = localStorage.getItem('token');
        if (storedUser && token) {
            return JSON.parse(storedUser);
        }
    } catch (e) {
        // corrupted localStorage
    }
    return null;
}

function getInitialAuth() {
    return !!(localStorage.getItem('user') && localStorage.getItem('token'));
}

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(getInitialUser);
    const [isAuthenticated, setIsAuthenticated] = useState(getInitialAuth);

    return (
        <UserContext.Provider value={{ user, setUser, isAuthenticated, setIsAuthenticated }}>
            {children}
        </UserContext.Provider>
    );
};