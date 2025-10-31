import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AppThemeProvider } from './contexts/ThemeContext.jsx';
import Navbar from './components/Navbar.jsx';
import LoginPage from './pages/LoginPage.jsx';
import DashboardPage from './pages/DashboardPage.jsx';
import BoardView from './pages/BoardView.jsx';
import RegisterPage from './pages/RegisterPage.jsx'; // Naya page import karein

// This component checks if a user is logged in.
// If they are, it shows the page. If not, it redirects to the login page.
const PrivateRoute = ({ children }) => {
    const token = localStorage.getItem('authToken');
    return token ? children : <Navigate to="/login" />;
};

function App() {
    return (
        <AppThemeProvider>
            <Router>
                <Navbar />
                <Routes>
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} /> {/* Yeh naya route add karein */}
                    <Route
                        path="/dashboard"
                        element={
                            <PrivateRoute>
                                <DashboardPage />
                            </PrivateRoute>
                        }
                    />
                    
                    <Route
                        path="/board/:boardId" // This is the new dynamic route for a specific board
                        element={
                            <PrivateRoute>
                                <BoardView />
                            </PrivateRoute>
                        }
                    />
                    
                    <Route path="/" element={<Navigate to="/dashboard" />} />
                </Routes>
            </Router>
        </AppThemeProvider>
    );
}

export default App;