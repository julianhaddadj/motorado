import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, AuthContext } from './contexts/AuthContext';
import { LanguageProvider } from './contexts/LanguageContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Listings from './pages/Listings';
import ListingDetails from './pages/ListingDetails';
import CreateListing from './pages/CreateListing';
import Favorites from './pages/Favorites';
import AdminDashboard from './pages/AdminDashboard';

// Component to protect routes that require authentication
const ProtectedRoute = ({ children, roles }) => {
  const { user, loading } = React.useContext(AuthContext);
  if (loading) {
    return <div className="text-center p-8">Loading...</div>;
  }
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  if (roles && !roles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }
  return children;
};

const App = () => {
  return (
    <AuthProvider>
      <LanguageProvider>
        <Navbar />
        <div className="container mx-auto px-4 py-4">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/listings" element={<Listings />} />
            <Route path="/listings/:id" element={<ListingDetails />} />
            <Route
              path="/create"
              element={
                <ProtectedRoute roles={['seller', 'admin']}>
                  <CreateListing />
                </ProtectedRoute>
              }
            />
            <Route
              path="/favorites"
              element={
                <ProtectedRoute roles={['buyer', 'seller', 'admin']}>
                  <Favorites />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin"
              element={
                <ProtectedRoute roles={['admin']}>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
          </Routes>
        </div>
      </LanguageProvider>
    </AuthProvider>
  );
};

export default App;