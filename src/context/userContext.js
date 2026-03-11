// src/context/UserContext.js
import { createContext, useState, useEffect } from 'react';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null); // { id, username }
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        const token = localStorage.getItem('token');

        if (storedUser && token) {
            setUser(JSON.parse(storedUser));
            setIsAuthenticated(true);
        }
    }, []);

    return (
        <UserContext.Provider value={{ user, setUser, isAuthenticated, setIsAuthenticated }}>
            {children}
        </UserContext.Provider>
    );
};